import Redis from 'ioredis';
import { loadEnv } from '../../utils';

loadEnv(process.env.NODE_ENV!);

export const redisCache = new Redis(process.env.REDIS_URL!, {});
