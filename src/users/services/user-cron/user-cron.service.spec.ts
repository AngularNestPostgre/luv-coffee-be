import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { UserCronService } from './user-cron.service';
import {
  createMockRepository,
  // MockRepository,
} from '@common/types/mock-repository';
import { UserEntity } from '@users/entities/user.entity';

const moduleMocker = new ModuleMocker(global);

describe('UserCronService', () => {
  let service: UserCronService;
  // let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCronService,
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
          return new Mock();
        }
      })
      .compile();

    service = module.get<UserCronService>(UserCronService);
    // userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
