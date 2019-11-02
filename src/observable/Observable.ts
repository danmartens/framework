import Subscription from './Subscription';
import completeObserver from './completeObserver';
import { Subscriber, PartialObserver, ObservableLike } from './types';

class Observable<Next> implements ObservableLike<Next> {
  static of<V>(value: V): Observable<V> {
    return new Observable(observer => {
      observer.next(value);
      observer.complete();
    });
  }

  static from<V>(iterable: Array<V>): Observable<V> {
    return new Observable(observer => {
      for (const value of iterable) {
        observer.next(value);
      }

      observer.complete();

      return () => {};
    });
  }

  static fromPromise<V>(promise: Promise<V>): Observable<V> {
    return new Observable(observer => {
      promise.then(
        value => {
          observer.next(value);

          if (observer.complete != null) {
            observer.complete();
          }
        },
        error => {
          observer.error(error);

          if (observer.complete != null) {
            observer.complete();
          }
        }
      );
    });
  }

  readonly subscriber: Subscriber<Next>;

  constructor(subscriber: Subscriber<Next>) {
    this.subscriber = subscriber;
  }

  subscribe(observer: PartialObserver<Next>): Subscription<Next>;

  subscribe(
    onNext: (value: Next) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Subscription<Next>;

  subscribe(
    onNextOrObserver: PartialObserver<Next> | ((value: Next) => void),
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Subscription<Next> {
    let observer;

    if (typeof onNextOrObserver === 'function') {
      observer = completeObserver(onNextOrObserver, onError, onComplete);
    } else {
      observer = completeObserver(onNextOrObserver);
    }

    return new Subscription(observer, this.subscriber);
  }
}

export default Observable;
