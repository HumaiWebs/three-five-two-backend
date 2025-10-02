import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryProvider } from './cloudinary.provider';

describe('Cloudinary', () => {
  let provider: typeof CloudinaryProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryProvider],
    }).compile();

    provider = module.get<typeof CloudinaryProvider>('cloudinary');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
