import { Injectable } from "@nestjs/common";

@Injectable()
export class ClockService {
  
  static now(): Date {
    return new Date();
  }
}
