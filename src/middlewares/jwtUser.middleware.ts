import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

@Injectable()
export class JwtUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Record<string, any>, res: Response, next: NextFunction): Promise<any> {
    let encryptedToken = req.header('Authorization')
      ? req.header('Authorization').split(' ')[1]
      : null;
    if (!encryptedToken)
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Token is miss' },
        HttpStatus.FORBIDDEN,
      );
    let payload = await this.jwtService.verify(encryptedToken);
    req.role = payload.role;

    next();
  }
}
