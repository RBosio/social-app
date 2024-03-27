import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupService {
  getHello(): string {
    return 'Hello World!';
  }
}
