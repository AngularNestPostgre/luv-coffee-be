import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

import { Protocol } from '@common/decorators/protocol.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { ParseIntPipe } from '@common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@ApiTags('coffees')
@Controller('api/coffees')
export class CoffeesController {
  constructor(private readonly coffesService: CoffeesService) {}

  @Put('recommend/:id')
  recommendCoffee(@Param('id') id: string): Promise<Coffee> {
    return this.coffesService.recommendCoffee(id);
  }

  @Get('flavors')
  @Public()
  async findAllFlavors(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Flavor[]> {
    // console.log('protocol', protocol);
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    return this.coffesService.findAllFlavors(paginationQuery);
  }

  /**
   * CRUD
   */
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Public()
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Coffee[]> {
    return this.coffesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<Coffee> {
    return this.coffesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    return this.coffesService.create(createCoffeeDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ): Promise<Coffee> {
    return this.coffesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Coffee> {
    return this.coffesService.remove(id);
  }
}
