import { EmailService } from '@email/email.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UserEmailService } from './user-email.service';

const moduleMocker = new ModuleMocker(global);

describe('UserEmailService', () => {
  let service: UserEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEmailService],
    })
      .useMocker((token) => {
        if (token === EmailService) {
          return {
            sendMail: jest.fn().mockResolvedValue(null),
          };
        }

        if (token === JwtService) {
          return {
            sign: jest.fn().mockResolvedValue(null),
          };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<UserEmailService>(UserEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
