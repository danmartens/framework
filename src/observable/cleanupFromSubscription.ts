import Subscription from './Subscription';

export default function cleanupFromSubscription<Next>(
  subscription: Subscription<Next>
) {
  return () => {
    subscription.unsubscribe();
  };
}
