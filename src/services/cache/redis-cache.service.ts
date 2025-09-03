/**
 * Cache Redis para produtos (versão alternativa)
 * Para usar esta versão, instale: npm install redis @types/redis
 */

import { createClient, RedisClientType } from 'redis';

interface ProductCacheData {
    price: number;
    image: string;
    brand: string;
    id: string;
    title: string;
    reviewScore: number;
}

interface CacheStats {
    total: number;
    active: number;
    expired: number;
}

class RedisCacheService {
    private client: RedisClientType;
    private readonly keyPrefix = 'product:';
    private readonly defaultTTL = 300; // 5 minutos em segundos
    private isConnected = false;

    constructor() {
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
            password: process.env.REDIS_PASSWORD,
        });

        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
            this.isConnected = false;
        });

        this.client.on('connect', () => {
            console.log('Redis Client Connected');
            this.isConnected = true;
        });

        this.client.on('ready', () => {
            console.log('Redis Client Ready');
            this.isConnected = true;
        });

        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            if (!this.isConnected) {
                await this.client.connect();
                console.log('✅ Connected to Redis');
            }
        } catch (error) {
            console.error('❌ Failed to connect to Redis:', error);
            this.isConnected = false;
        }
    }

    private async ensureConnection(): Promise<boolean> {
        if (!this.isConnected) {
            await this.connect();
        }
        return this.isConnected;
    }

    private getKey(itemId: string): string {
        return `${this.keyPrefix}${itemId}`;
    }

    async get(itemId: string): Promise<ProductCacheData | null> {
        try {
            if (!(await this.ensureConnection())) {
                console.warn('Redis not connected, returning null');
                return null;
            }

            const data = await this.client.get(this.getKey(itemId));
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set(itemId: string, data: ProductCacheData, ttlSeconds?: number): Promise<void> {
        try {
            if (!(await this.ensureConnection())) {
                console.warn('Redis not connected, skipping cache set');
                return;
            }

            const key = this.getKey(itemId);
            const ttl = ttlSeconds || this.defaultTTL;
            await this.client.setEx(key, ttl, JSON.stringify(data));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async delete(itemId: string): Promise<boolean> {
        try {
            if (!(await this.ensureConnection())) {
                console.warn('Redis not connected, returning false');
                return false;
            }

            const result = await this.client.del(this.getKey(itemId));
            return result > 0;
        } catch (error) {
            console.error('Cache delete error:', error);
            return false;
        }
    }

    async clear(): Promise<void> {
        try {
            if (!(await this.ensureConnection())) {
                console.warn('Redis not connected, skipping cache clear');
                return;
            }

            const keys = await this.client.keys(`${this.keyPrefix}*`);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    async getStats(): Promise<CacheStats> {
        try {
            if (!(await this.ensureConnection())) {
                console.warn('Redis not connected, returning empty stats');
                return { total: 0, active: 0, expired: 0 };
            }

            const keys = await this.client.keys(`${this.keyPrefix}*`);
            let activeCount = 0;

            // Verificar quais chaves ainda têm TTL válido
            for (const key of keys) {
                const ttl = await this.client.ttl(key);
                if (ttl > 0) {
                    activeCount++;
                }
            }

            return {
                total: keys.length,
                active: activeCount,
                expired: keys.length - activeCount,
            };
        } catch (error) {
            console.error('Cache stats error:', error);
            return { total: 0, active: 0, expired: 0 };
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.isConnected) {
                await this.client.quit();
                this.isConnected = false;
                console.log('Redis client disconnected');
            }
        } catch (error) {
            console.error('Error disconnecting Redis:', error);
        }
    }
}

export const redisProductCache = new RedisCacheService();

// Para usar Redis, substitua a importação em add.service.ts:
// import { redisProductCache as productCache } from '../cache/redis-cache.service';
