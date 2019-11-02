import subscriptionClosed from './subscriptionClosed';
import cleanupSubscription from './cleanupSubscription';

import Subscription from './Subscription';

export default function closeSubscription<Next>(
  subscription: Subscription<Next>
) {
  if (subscriptionClosed(subscription)) {
    return;
  }

  subscription.observer = undefined;

  cleanupSubscription(subscription);
}
