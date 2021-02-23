import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: UserDocument): Promise<Task[]> {
    const { status, search } = filterDto;

    let query = this.taskModel.find({ userId: user._id });

    if (status) {
      query = this.taskModel.find({ userId: user._id, status });
    }

    if (search) {
      query = this.taskModel.find({
        $or: [
          { title: { $regex: '.*' + status + '.*' } },
          { description: { $regex: '.*' + status + '.*' } },
        ],
      });
    }

    try {
      const tasks = await query;
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, userId: string): Promise<TaskDocument> {
    const found = await this.taskModel.findOne({ _id: id, userId });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, userId } = createTaskDto;

    const task = new this.taskModel();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.userId = userId;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${userId}". Data: ${createTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return task.populate('userId');
  }

  async deleteTask(id: string, user: UserDocument): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, userId: user._id });

    return result;
  }

  async updateTaskStatus(id: string, status: TaskStatus, userId: string): Promise<Task> {
    const task = await this.getTaskById(id, userId);
    task.status = status;
    await task.save();
    return task;
  }
}
