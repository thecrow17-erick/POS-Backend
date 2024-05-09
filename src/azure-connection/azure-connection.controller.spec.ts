import { Test, TestingModule } from '@nestjs/testing';
import { AzureConnectionController } from './azure-connection.controller';
import { AzureConnectionService } from './azure-connection.service';

describe('AzureConnectionController', () => {
  let controller: AzureConnectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AzureConnectionController],
      providers: [AzureConnectionService],
    }).compile();

    controller = module.get<AzureConnectionController>(AzureConnectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
