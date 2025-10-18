import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const keyv = new Keyv({
      store: new KeyvRedis({
        socket: {
          host: configService.get<string>('REDIS_HOST')!,
          port: parseInt(configService.get<string>('REDIS_PORT')!),
        },
        password: configService.get<string>('REDIS_PASSWORD')!,
      }),
    });

    return {
      store: keyv,
      ttl: 0, // seconds (0 means no expiration)
    };
  },
  inject: [ConfigService],
};
