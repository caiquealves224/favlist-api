import { Request, Response } from 'express';
import { redisProductCache as productCache } from '../../services/cache/redis-cache.service';

export default class CacheStatsController {
    async handler(request: Request, response: Response): Promise<Response> {
        const stats = await productCache.getStats();
        
        return response.status(200).json({
            success: true,
            message: 'Cache statistics retrieved successfully',
            data: {
                ...stats,
                hitRate:
                    stats.total > 0
                        ? ((stats.active / stats.total) * 100).toFixed(2) + '%'
                        : '0%',
                timestamp: new Date().toISOString(),
            },
        });
    }

    async clearCache(request: Request, response: Response): Promise<Response> {
        await productCache.clear();
        
        return response.status(200).json({
            success: true,
            message: 'Cache cleared successfully',
        });
    }
}
