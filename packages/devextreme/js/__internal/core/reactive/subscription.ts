export interface Subscription {
  unsubscribe: () => void;
}

export class SubscriptionBag implements Subscription {
  private readonly subscriptions: Subscription[] = [];

  add(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  unsubscribe(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
