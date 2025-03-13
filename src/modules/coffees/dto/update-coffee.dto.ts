import { PartialType } from '@nestjs/swagger'; // '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

/**
 * PartialType:
 * - Marks all the fields as optional.
 * - Inherits all the validation rules applied via decorators.
 * - Adds a single validation rule to each field, that is optional rule, on the fly.
 */
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
