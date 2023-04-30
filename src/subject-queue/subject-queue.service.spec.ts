import { Test, TestingModule } from '@nestjs/testing';
import { SubjectQueueService } from './subject-queue.service';

describe('SubjectQueueService', () => {
  let service: SubjectQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectQueueService],
    }).compile();

    service = module.get<SubjectQueueService>(SubjectQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
