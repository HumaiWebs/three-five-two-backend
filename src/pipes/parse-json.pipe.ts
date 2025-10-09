// parse-json.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  constructor(private readonly fieldsToParse: string[]) {}

  transform(value: any) {
    for (const field of this.fieldsToParse) {
      if (typeof value[field] === 'string') {
        try {
          value[field] = JSON.parse(value[field]);
        } catch (err) {
          throw new BadRequestException(`Invalid JSON format in field "${field}"`);
        }
      }
    }
    return value;
  }
}