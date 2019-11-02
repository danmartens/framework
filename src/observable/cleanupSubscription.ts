import Subscription from './Subscription';

export default function cleanupSubscription<Next>(
  subscription: Subscription<Next>
) {
  const { cleanup } = subscription;

  if (!cleanup) {
    return;
  }

  // Drop the reference to the cleanup function so that we won't call it
  // more than once
  subscription.cleanup = undefined;

  // Call the cleanup function
  try {
    cleanup();
  } catch (error) {
    // console.error(error);
    // Handle errors....
  }
}
