import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

interface IError {
  message: string;
  status: number;
}

@Injectable()
export class ErrorHandlerService {
  handle(value: IError) {
    if (value.status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException(value.message);
    }

    if (value.status === HttpStatus.UNAUTHORIZED) {
      throw new UnauthorizedException(value.message);
    }

    if (value.status === HttpStatus.BAD_REQUEST) {
      throw new BadRequestException(value.message);
    }
  }
}
