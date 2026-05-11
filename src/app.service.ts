import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('NOW RETURNING THE HELLO WORLD');
    return 'Hello World!';
  }
}
