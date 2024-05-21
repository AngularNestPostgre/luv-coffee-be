import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { JsonWebTokenService } from '@common/services/json-web-token/json-web-token.service';

import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from '../../libs/fe-shared/src/enums/user-role.enum';
import { EmailJwtKey } from '@common/enums/jwt.enums';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JsonWebTokenService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * User's CRUD
   */
  public async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<UserEntity[]> {
    return await this.userRepository.find({
      skip: paginationQuery.offset || 0,
      take: paginationQuery.limit,
    });
  }

  public async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      bcrypt.genSaltSync(8),
    );
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  private async update(
    id: number,
    updateCoffeDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.preload({
      ...updateCoffeDto,
      id,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<UserEntity> {
    const user = await this.findById(id);
    return await this.userRepository.remove(user);
  }

  /**
   * User's other
   */
  public async confirmEmail(jwt: string): Promise<UserEntity> {
    const jwtPayload = await this.jwtService.decodeJwt(
      jwt,
      this.configService.get(EmailJwtKey.Secret),
    );

    const user: UserEntity = await this.findById(jwtPayload.id);

    if (user.role !== UserRole.NotActivated) {
      throw new BadRequestException('Email has already been confirmed');
    }

    return await this.setUserRole(user.id);
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user?.refreshToken,
    );

    // This validation is implemented if we want to prevent
    // user login on multiple devices
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async removeRefreshToken(userId: number) {
    return this.update(userId, {
      refreshToken: null,
    });
  }

  public async setRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async setUserRole(id: number) {
    return this.update(id, {
      role: UserRole.User,
    });
  }
}
