import { productCache } from '../../../src/services/cache/product-cache.service';

describe('ProductCacheService', () => {
    beforeEach(() => {
        productCache.clear();
    });

    it('should store and retrieve product data', () => {
        const itemId = 'test-product-123';
        const productData = {
            id: itemId,
            title: 'Test Product',
            price: 99.99,
            image: 'https://example.com/image.jpg',
            brand: 'Test Brand',
            reviewScore: 4.5
        };

        // Armazena no cache
        productCache.set(itemId, productData);

        // Recupera do cache
        const cached = productCache.get(itemId);

        expect(cached).toEqual(productData);
    });

    it('should return null for non-existent items', () => {
        const result = productCache.get('non-existent-item');
        expect(result).toBeNull();
    });

    it('should respect TTL and expire items', async () => {
        const itemId = 'test-product-ttl';
        const productData = {
            id: itemId,
            title: 'TTL Test Product',
            price: 49.99,
            image: 'https://example.com/ttl.jpg',
            brand: 'TTL Brand',
            reviewScore: 3.5
        };

        // Armazena com TTL de 100ms
        productCache.set(itemId, productData, 100);

        // Deve estar disponível imediatamente
        expect(productCache.get(itemId)).toEqual(productData);

        // Espera expirar
        await new Promise(resolve => setTimeout(resolve, 150));

        // Deve ter expirado
        expect(productCache.get(itemId)).toBeNull();
    });

    it('should return correct stats', () => {
        const productData = {
            id: 'stats-test',
            title: 'Stats Test Product',
            price: 25.99,
            image: 'https://example.com/stats.jpg',
            brand: 'Stats Brand',
            reviewScore: 5.0
        };

        // Cache vazio
        let stats = productCache.getStats();
        expect(stats.total).toBe(0);
        expect(stats.active).toBe(0);

        // Adiciona item
        productCache.set('item1', productData);
        productCache.set('item2', productData);

        stats = productCache.getStats();
        expect(stats.total).toBe(2);
        expect(stats.active).toBe(2);
    });

    it('should clear all items', () => {
        const productData = {
            id: 'clear-test',
            title: 'Clear Test Product',
            price: 15.99,
            image: 'https://example.com/clear.jpg',
            brand: 'Clear Brand',
            reviewScore: 2.5
        };

        productCache.set('item1', productData);
        productCache.set('item2', productData);

        expect(productCache.getStats().total).toBe(2);

        productCache.clear();

        expect(productCache.getStats().total).toBe(0);
        expect(productCache.get('item1')).toBeNull();
        expect(productCache.get('item2')).toBeNull();
    });
});
