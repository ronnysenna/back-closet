# Implementação Futura: Sistema de Pedidos

Este documento descreve a estrutura prevista para o sistema de pedidos que será implementado no futuro. Os modelos já estão definidos no schema do Prisma, mas a migração ainda não foi aplicada.

## Modelos de Dados

Os seguintes modelos foram adicionados ao schema:

1. **Order** - Pedido principal
2. **OrderItem** - Itens individuais de cada pedido

## Passos para Implementar o Sistema de Pedidos

Quando for o momento de implementar o sistema de pedidos completo, siga estas etapas:

1. **Migrar o banco de dados**:
   ```bash
   npx prisma migrate dev --name add_orders_tables
   ```

2. **Criar as seguintes funcionalidades**:

   - Controller para pedidos (`orderController.ts`)
   - Rotas para pedidos (`orderRoutes.ts`)
   - Frontend para visualização de pedidos
   - Integração com sistema de pagamento
   - Sistema de rastreamento de entregas

## Rotas Planejadas

```typescript
// Rotas para o cliente
router.post("/orders", authenticateToken, orderController.createOrder);
router.get("/orders/my-orders", authenticateToken, orderController.getMyOrders);
router.get("/orders/:id", authenticateToken, orderController.getOrderById);

// Rotas administrativas
router.get("/orders", authenticateToken, isAdmin, orderController.getAllOrders);
router.put("/orders/:id/status", authenticateToken, isAdmin, orderController.updateOrderStatus);
```

## Integração com Dashboard

O controller de dashboard (`dashboardController.ts`) já está preparado com a lógica comentada para calcular estatísticas de receitas quando o sistema de pedidos for implementado.

Para ativar essas estatísticas, basta descomentar o código relevante após a implementação do sistema de pedidos.

## Estrutura do Frontend

No frontend, será necessário implementar:

1. Carrinho de compras (já em desenvolvimento)
2. Página de checkout
3. Páginas de visualização de pedidos para clientes
4. Páginas administrativas para gerenciamento de pedidos

## Sistema de Notificações

Recomendamos implementar um sistema de notificações para:

1. Confirmação de novos pedidos
2. Atualizações de status de pedidos
3. Lembretes para pedidos pendentes de pagamento

## Relatórios e Métricas

Com o sistema de pedidos ativo, o dashboard poderá exibir:

- Total de vendas por período
- Ticket médio
- Produtos mais vendidos
- Clientes mais ativos
