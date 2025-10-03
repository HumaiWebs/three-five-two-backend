import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async setFeaturedProductsCache(key: string, value: any, ttl: number) {
    await this.cache.set('featured-products', value);
  }
}
