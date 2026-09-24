# Payments Prompt

Implement a provider-agnostic payment architecture.

Support:
- order
- order items
- checkout
- payment status
- webhook
- enrollment
- coupons
- refunds

Never trust client price/status.

Verify provider webhooks.

Make webhook processing idempotent.

Do not add a provider until its credentials/configuration are explicitly
provided.
