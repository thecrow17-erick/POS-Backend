import { Test, TestingModule } from '@nestjs/testing';
import { AzureConnectionService } from './azure-connection.service';

describe('AzureConnectionService', () => {
  let service: AzureConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureConnectionService],
    }).compile();

    service = module.get<AzureConnectionService>(AzureConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
