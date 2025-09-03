# Sistema de Cache - Implementação

## Visão Geral

Foi implementado um sistema de cache em memória para otimizar as consultas à API externa de produtos, melhorando significativamente a performance da aplicação.

## Componentes Implementados

### 1. Serviço de Cache (`src/services/cache/product-cache.service.ts`)

**Características:**
- Cache em memória utilizando Map nativo do JavaScript
- TTL (Time To Live) configurável (padrão: 5 minutos)
- Limpeza automática de itens expirados a cada 10 minutos
- Singleton para garantir uma única instância
- Estatísticas de uso (total, ativos, expirados, hit rate)

**Métodos principais:**
- `get(itemId)` - Busca item no cache
- `set(itemId, data, ttl?)` - Armazena item no cache
- `delete(itemId)` - Remove item específico
- `clear()` - Limpa todo o cache
- `getStats()` - Retorna estatísticas de uso

### 2. Integração com API Externa (`src/services/favorites/add.service.ts`)

**Fluxo de funcionamento:**
1. Verifica se o produto existe no cache
2. Se existir (Cache HIT): retorna dados do cache
3. Se não existir (Cache MISS): 
   - Busca na API externa ou usa dados mockados
   - Armazena resultado no cache
   - Retorna os dados

**Ambiente de desenvolvimento:**
- Mock automático quando `NODE_ENV=development` ou `MOCK_API=true`
- Dados simulados com delay de 100ms para simular latência da API
- Produtos com nomes, preços e marcas aleatórios

### 3. Endpoints de Administração (`src/controllers/cache/cache-stats.controller.ts`)

**Rotas disponíveis:**
- `GET /api/cache/stats` - Estatísticas do cache (admin only)
- `DELETE /api/cache/clear` - Limpar cache (admin only)

**Resposta das estatísticas:**
```json
{
  "success": true,
  "message": "Cache statistics retrieved successfully",
  "data": {
    "total": 3,
    "active": 2,
    "expired": 1,
    "hitRate": "66.67%",
    "timestamp": "2025-09-03T00:41:42.104Z"
  }
}
```

## Configuração

### Variáveis de Ambiente

```bash
# Ativar dados mockados em desenvolvimento
NODE_ENV=development
# ou
MOCK_API=true
```

### Autenticação

Para acessar os endpoints de cache, é necessário um token JWT com role `admin`:

```bash
Authorization: Bearer <admin_jwt_token>
```

## Implementação Alternativa - Redis

Foi criado um arquivo de exemplo para implementação com Redis (`src/services/cache/redis-cache.service.ts`):

**Para usar Redis:**
1. Instalar dependências: `npm install redis @types/redis`
2. Descomentar o código no arquivo
3. Configurar variáveis de ambiente Redis
4. Substituir importação no serviço de favoritos

**Variáveis para Redis:**
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=sua_senha
```

## Próximos Passos

1. **Monitoramento**: Implementar logs estruturados para análise
2. **Métricas avançadas**: Tempo médio de resposta, volume de dados
3. **Cache distribuído**: Migração para Redis em produção
4. **Políticas de cache**: LRU, LFU para otimização de memória
5. **Cache warming**: Pré-carregar produtos populares

## Conclusão

O sistema de cache implementado oferece uma solução robusta e eficiente para otimização de performance, com facilidade de monitoramento e manutenção através dos endpoints administrativos.
