import Subscription from './Subscription';
import subscriptionClosed from './subscriptionClosed';
import cleanupSubscription from './cleanupSubscription';

export default class SubscriptionObserver<Next> {
  readonly subscription: Subscription<Next>;

  constructor(subscription: Subscription<Next>) {
    this.subscription = subscription;
  }

  get closed() {
    return subscriptionClosed(this.subscription);
  }

  next(value: Next) {
    const { subscription } = this;

    if (subscriptionClosed(subscription)) {
      return undefined;
    }

    const { observer } = subscription;

    if (observer != null && typeof observer.next === 'function') {
      observer.next(value);
    }
  }

  error(value: Error) {
    const { subscription } = this;

    // If the stream is closed, throw the error to the caller
    if (subscriptionClosed(subscription)) {
      return undefined;
    }

    const { observer } = subscription;

    subscription.observer = undefined;

    try {
      if (observer != null && typeof observer.error === 'function') {
        // eslint-disable-next-line no-console
        observer.error(value);
      } else {
        // Report error
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      // Report error
    }

    cleanupSubscription(subscription);
  }

  complete() {
    const { subscription } = this;

    // If the stream is closed, then return undefined
    if (subscription == null || subscriptionClosed(subscription)) {
      return undefined;
    }

    const { observer } = subscription;

    subscription.observer = undefined;

    try {
      if (observer != null && typeof observer.complete === 'function') {
        observer.complete();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // Do something
    }

    cleanupSubscription(subscription);
  }
}
