import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { RequestWithUser } from '@auth/interfaces/request-with-user.interface';
import { Public } from '@auth/decorators/public.decorator';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { UserEntity } from './entities/user.entity';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../../libs/fe-shared/src/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { EmaiConfirmationQueryDto } from './dto/email-confirmation.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.Admin, UserRole.Root)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<UserEntity[]> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser): Promise<UserEntity> {
    return this.usersService.findById(req.user.id);
  }

  @Public()
  @Get('email/confirm')
  async confirmEmail(@Query() emaiConfirmationQuery: EmaiConfirmationQueryDto) {
    const user = this.usersService.confirmEmail(emaiConfirmationQuery.jwt);
    return user;
  }

  // Users created only during signup
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.usersService.create(createUserDto);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<User> {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: string): Promise<User> {
  //   return this.usersService.remove(+id);
  // }
}
