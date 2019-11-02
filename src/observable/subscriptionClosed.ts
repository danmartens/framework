import Subscription from './Subscription';

export default function subscriptionClosed<Next>(
  subscription: Subscription<Next>
): boolean {
  return subscription.observer === undefined;
}
