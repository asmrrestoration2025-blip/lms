// Provider-agnostic payment abstraction — implement provider when credentials supplied
export type CreateCheckoutInput = { orderId: string; amountCents: number; currency: string; userId: string; courseId: string };
export type CheckoutResult = { provider: string; checkoutUrl?: string; providerPaymentId?: string };
export type WebhookEvent = { provider: string; type: string; providerPaymentId: string; orderId?: string; amountCents?: number; raw: unknown };

export interface PaymentProvider {
  name: string;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult>;
  verifyWebhook(payload: unknown, signature: string): Promise<WebhookEvent>;
}

// No-op provider for local/zero-cost dev — logs and pretends success when env not set
export class NoopProvider implements PaymentProvider {
  name = "noop";
  async createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
    return { provider: "noop", providerPaymentId: `noop_${input.orderId}`, checkoutUrl: undefined };
  }
  async verifyWebhook(payload: unknown): Promise<WebhookEvent> {
    return { provider: "noop", type: "payment.succeeded", providerPaymentId: "noop_test", raw: payload };
  }
}

export function getProvider(): PaymentProvider {
  // When STRIPE_SECRET_KEY etc. are set, return StripeProvider; else noop
  return new NoopProvider();
}
