// Dados de teste reutilizáveis para os testes

export const mockClient = {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockClient2 = {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockFavorite = {
    id: '1',
    clientId: '1',
    itemId: 'item-123',
    title: 'Produto Teste',
    price: 99.99,
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockFavorite2 = {
    id: '2',
    clientId: '1',
    itemId: 'item-456',
    title: 'Produto Teste 2',
    price: 149.99,
    imageUrl: 'https://example.com/image2.jpg',
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockProductData = {
    id: 'item-123',
    title: 'Produto Teste',
    price: 99.99,
    image: 'https://example.com/image.jpg',
    brand: 'Marca Teste',
    reviewScore: 4.5,
};

export const mockClientWithFavorites = {
    ...mockClient,
    favorites: [mockFavorite, mockFavorite2],
};

export const mockClientsList = [mockClient, mockClient2];

export const mockFavoritesList = [mockFavorite, mockFavorite2];
