import { PartialObserver, ObserverLike } from './types';

const defaultOnError = (error: Error) => {};
const defaultOnComplete = () => {};

function completeObserver<V>(observer: PartialObserver<V>): ObserverLike<V>;

function completeObserver<V>(
  onNext: (value: V) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): ObserverLike<V>;

function completeObserver<V>(
  onNextOrObserver: PartialObserver<V> | ((value: V) => void),
  onError?: (error: Error) => void,
  onComplete?: () => void
) {
  if (typeof onNextOrObserver === 'function') {
    return {
      next: onNextOrObserver,
      error: onError || defaultOnError,
      complete: onComplete || defaultOnComplete
    };
  } else {
    return {
      error: defaultOnError,
      complete: defaultOnComplete,
      ...onNextOrObserver
    };
  }
}

export default completeObserver;
