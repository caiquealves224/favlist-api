/**
 * Cache Redis para produtos (versão alternativa)
 * Para usar esta versão, instale: npm install redis @types/redis
 */

// import Redis from 'redis';

// interface ProductCacheData {
//     price: number;
//     image: string;
//     brand: string;
//     id: string;
//     title: string;
//     reviewScore: number;
// }

// class RedisCacheService {
//     private client: Redis.RedisClientType;
//     private readonly keyPrefix = 'product:';
//     private readonly defaultTTL = 300; // 5 minutos em segundos

//     constructor() {
//         this.client = Redis.createClient({
//             host: process.env.REDIS_HOST || 'localhost',
//             port: parseInt(process.env.REDIS_PORT || '6379'),
//             password: process.env.REDIS_PASSWORD,
//         });

//         this.client.on('error', (err) => {
//             console.error('Redis Client Error:', err);
//         });

//         this.connect();
//     }

//     private async connect(): Promise<void> {
//         try {
//             await this.client.connect();
//             console.log('Connected to Redis');
//         } catch (error) {
//             console.error('Failed to connect to Redis:', error);
//         }
//     }

//     private getKey(itemId: string): string {
//         return `${this.keyPrefix}${itemId}`;
//     }

//     async get(itemId: string): Promise<ProductCacheData | null> {
//         try {
//             const data = await this.client.get(this.getKey(itemId));
//             return data ? JSON.parse(data) : null;
//         } catch (error) {
//             console.error('Cache get error:', error);
//             return null;
//         }
//     }

//     async set(itemId: string, data: ProductCacheData, ttlSeconds?: number): Promise<void> {
//         try {
//             const key = this.getKey(itemId);
//             const ttl = ttlSeconds || this.defaultTTL;
//             await this.client.setEx(key, ttl, JSON.stringify(data));
//         } catch (error) {
//             console.error('Cache set error:', error);
//         }
//     }

//     async delete(itemId: string): Promise<boolean> {
//         try {
//             const result = await this.client.del(this.getKey(itemId));
//             return result > 0;
//         } catch (error) {
//             console.error('Cache delete error:', error);
//             return false;
//         }
//     }

//     async clear(): Promise<void> {
//         try {
//             const keys = await this.client.keys(`${this.keyPrefix}*`);
//             if (keys.length > 0) {
//                 await this.client.del(keys);
//             }
//         } catch (error) {
//             console.error('Cache clear error:', error);
//         }
//     }

//     async getStats(): Promise<{ total: number }> {
//         try {
//             const keys = await this.client.keys(`${this.keyPrefix}*`);
//             return { total: keys.length };
//         } catch (error) {
//             console.error('Cache stats error:', error);
//             return { total: 0 };
//         }
//     }
// }

// export const redisProductCache = new RedisCacheService();

// Para usar Redis, descomente o código acima e substitua a importação em add.service.ts:
// import { redisProductCache as productCache } from '../cache/redis-cache.service';

export default 'Redis cache implementation (commented out)';
