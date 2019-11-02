import SubscriptionObserver from './SubscriptionObserver';
import closeSubscription from './closeSubscription';
import subscriptionClosed from './subscriptionClosed';
import cleanupFromSubscription from './cleanupFromSubscription';

import { ObserverLike, Subscriber } from './types';

export default class Subscription<Next> {
  observer?: ObserverLike<Next>;
  cleanup?: () => void;

  constructor(observer: ObserverLike<Next>, subscriber: Subscriber<Next>) {
    this.observer = observer;

    if (subscriptionClosed(this)) {
      return;
    }

    const subscriptionObserver = new SubscriptionObserver(this);

    try {
      let cleanup = subscriber.call(undefined, subscriptionObserver);

      if (cleanup != null) {
        if (typeof cleanup.unsubscribe === 'function') {
          cleanup = cleanupFromSubscription(cleanup);
        }
      } else if (typeof cleanup !== 'function') {
        // throw new TypeError(`${String(cleanup)} is not a function`);
      }

      this.cleanup = cleanup;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  unsubscribe() {
    closeSubscription(this);
  }
}
