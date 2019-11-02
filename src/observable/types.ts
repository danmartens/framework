import Subscription from './Subscription';

export interface ObservableLike<Next> {
  subscribe(observer: PartialObserver<Next>): Subscription<Next>;
}

export interface ObserverLike<Next> {
  readonly next: (value: Next) => void;
  readonly error: (error: Error) => void;
  readonly complete: () => void;
}

export type PartialObserver<Next> = {
  readonly next: (value: Next) => void;
  readonly error?: (error: Error) => void;
  readonly complete?: () => void;
};

export type Subscriber<Next> = (
  observer: ObserverLike<Next>
) => (() => void) | void;
