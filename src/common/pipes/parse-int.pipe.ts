import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata) {
    console.log('ParseIntPipe');

    if (isNaN(Number(value))) {
      throw new BadRequestException(
        `Validation failed. '${value}' is not an integer`,
      );
    }

    return value;
  }
}
