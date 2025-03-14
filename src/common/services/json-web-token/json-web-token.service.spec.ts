import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { JsonWebTokenService } from './json-web-token.service';

const moduleMocker = new ModuleMocker(global);

describe('JsonWebTokenService', () => {
  let service: JsonWebTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonWebTokenService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return {
            sign: jest.fn().mockResolvedValue(''),
            verify: jest.fn().mockResolvedValue({}),
          };
        }
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

    service = module.get<JsonWebTokenService>(JsonWebTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
