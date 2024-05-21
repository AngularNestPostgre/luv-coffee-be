import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import {
  createMockRepository,
  MockRepository,
} from '@common/types/mock-repository';

const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user with ID exists', () => {
      it('should return coffee object', async () => {
        const userId = 1;
        const expectedCofee = {};

        userRepository.findOne.mockReturnValue(expectedCofee);
        const coffee = await service.findById(userId);
        expect(coffee).toEqual(expectedCofee);
      });
    });

    describe('when user with ID does not exist', () => {
      it('should throw "NotFoundException"', async () => {
        const userId = 1;
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findById(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User #${userId} not found`);
        }
      });
    });
  });
});
