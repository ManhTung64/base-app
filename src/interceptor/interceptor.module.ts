import { Module } from '@nestjs/common';
import { CacheInterceptor } from './cache.interceptor';

@Module({
    providers:[CacheInterceptor]
})
export class InterceptorModule {}
