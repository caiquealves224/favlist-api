/**
 * Serviço de cache para armazenar dados de produtos da API externa
 * Implementa cache em memória com TTL configurável
 */

interface CacheItem<T> {
    data: T;
    expiresAt: number;
}

interface ProductCacheData {
    price: number;
    image: string;
    brand: string;
    id: string;
    title: string;
    reviewScore: number;
}

class ProductCacheService {
    private cache = new Map<string, CacheItem<ProductCacheData>>();
    private readonly defaultTTL = 5 * 60 * 1000; // 5 minutos em ms

    /**
     * Busca um produto no cache
     */
    get(itemId: string): ProductCacheData | null {
        const item = this.cache.get(itemId);
        
        if (!item) {
            return null;
        }

        // Verifica se expirou
        if (Date.now() > item.expiresAt) {
            this.cache.delete(itemId);
            return null;
        }

        return item.data;
    }

    /**
     * Armazena um produto no cache
     */
    set(itemId: string, data: ProductCacheData, ttlMs?: number): void {
        const ttl = ttlMs ?? this.defaultTTL;
        const expiresAt = Date.now() + ttl;
        
        this.cache.set(itemId, {
            data,
            expiresAt,
        });
    }

    /**
     * Remove um produto do cache
     */
    delete(itemId: string): boolean {
        return this.cache.delete(itemId);
    }

    /**
     * Limpa todo o cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Remove itens expirados do cache
     */
    cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Retorna estatísticas do cache
     */
    getStats(): { total: number; active: number; expired: number } {
        const now = Date.now();
        let expired = 0;
        let active = 0;

        for (const item of this.cache.values()) {
            if (now > item.expiresAt) {
                expired++;
            } else {
                active++;
            }
        }

        return {
            total: this.cache.size,
            active,
            expired,
        };
    }
}

// Singleton instance
export const productCache = new ProductCacheService();

// Limpa cache expirado a cada 10 minutos
setInterval(
    () => {
        productCache.cleanup();
    },
    10 * 60 * 1000
);
