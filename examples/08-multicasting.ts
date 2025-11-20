/**
 * Multicasting Examples
 * 
 * This file demonstrates multicasting in RxJS:
 * - share()
 * - shareReplay()
 * - multicast()
 * - publish()
 * - publishBehavior()
 * - publishReplay()
 * - publishLast()
 * - refCount()
 * - Hot vs Cold Observables
 */

import {
  Observable,
  interval,
  timer,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  ConnectableObservable
} from 'rxjs';
import {
  share,
  shareReplay,
  multicast,
  publish,
  publishBehavior,
  publishReplay,
  publishLast,
  refCount,
  take,
  tap,
  map
} from 'rxjs/operators';

// ============================================================================
// 1. Cold vs Hot Observables
// ============================================================================
/**
 * Cold Observable: Each subscription triggers a new execution
 * Hot Observable: Shares execution among multiple subscribers
 */

console.log('=== Cold vs Hot Observables ===');

// Cold Observable - each subscription gets independent execution
const coldObservable = new Observable(observer => {
  const random = Math.random();
  console.log('Cold observable execution, random:', random);
  observer.next(random);
  observer.complete();
});

console.log('Cold Observable:');
coldObservable.subscribe(value => console.log('  Subscriber 1:', value));
coldObservable.subscribe(value => console.log('  Subscriber 2:', value));

// Hot Observable - shares execution
const hotSubject = new Subject<number>();
hotSubject.subscribe(value => console.log('Hot subscriber 1:', value));
hotSubject.subscribe(value => console.log('Hot subscriber 2:', value));
hotSubject.next(Math.random()); // Both subscribers receive same value

// ============================================================================
// 2. share() - Simple multicasting
// ============================================================================
/**
 * share(): Returns a new Observable that multicasts (shares) the original Observable.
 * As long as there is at least one Subscriber this Observable will be subscribed
 * and emitting data. When all subscribers have unsubscribed it will unsubscribe
 * from the source Observable.
 */

console.log('\n=== share() Examples ===');

// Without share - each subscription triggers new execution
const source1 = interval(1000).pipe(
  take(5),
  tap(x => console.log('Source execution:', x))
);

console.log('Without share():');
source1.subscribe(value => console.log('  Subscriber 1:', value));
setTimeout(() => {
  source1.subscribe(value => console.log('  Subscriber 2:', value));
}, 2000);

// With share - execution is shared
const sharedSource = interval(1000).pipe(
  take(5),
  tap(x => console.log('Shared source execution:', x)),
  share()
);

setTimeout(() => {
  console.log('\nWith share():');
  sharedSource.subscribe(value => console.log('  Subscriber 1:', value));
  setTimeout(() => {
    sharedSource.subscribe(value => console.log('  Subscriber 2:', value));
  }, 2000);
}, 6000);

// ============================================================================
// 3. shareReplay() - Share and replay values
// ============================================================================
/**
 * shareReplay(): Returns an Observable that shares a single subscription to
 * the underlying Observable and replays the last count emissions to each new subscriber.
 */

console.log('\n=== shareReplay() Examples ===');

const replaySource = interval(1000).pipe(
  take(5),
  tap(x => console.log('Replay source execution:', x)),
  shareReplay(2) // Replay last 2 values
);

setTimeout(() => {
  console.log('shareReplay() - Subscriber 1 (early):');
  replaySource.subscribe(value => console.log('  Value:', value));
  
  setTimeout(() => {
    console.log('shareReplay() - Subscriber 2 (late, gets last 2 values):');
    replaySource.subscribe(value => console.log('  Value:', value));
  }, 3000);
}, 10000);

// ============================================================================
// 4. multicast() - Manual multicasting with Subject
// ============================================================================
/**
 * multicast(): Shares the source Observable by using the provided Subject.
 * Returns a ConnectableObservable that uses the Subject to multicast.
 */

console.log('\n=== multicast() Examples ===');

const source2 = interval(1000).pipe(
  take(5),
  tap(x => console.log('Multicast source execution:', x))
);

const multicasted = source2.pipe(
  multicast(() => new Subject<number>())
);

// Subscribers won't receive values until connect() is called
multicasted.subscribe(value => console.log('Multicast subscriber 1:', value));
multicasted.subscribe(value => console.log('Multicast subscriber 2:', value));

// Connect to start execution
const connection = multicasted.connect();

// Disconnect after 3 seconds
setTimeout(() => {
  connection.unsubscribe();
  console.log('Multicast disconnected');
}, 3000);

// ============================================================================
// 5. publish() - Create ConnectableObservable
// ============================================================================
/**
 * publish(): Returns a ConnectableObservable that uses a Subject internally.
 * This is equivalent to multicast(() => new Subject()).
 */

console.log('\n=== publish() Examples ===');

const source3 = interval(1000).pipe(
  take(5),
  tap(x => console.log('Publish source execution:', x))
);

const published = source3.pipe(publish());

published.subscribe(value => console.log('Published subscriber 1:', value));
published.subscribe(value => console.log('Published subscriber 2:', value));

const publishedConnection = published.connect();

setTimeout(() => {
  publishedConnection.unsubscribe();
}, 3000);

// ============================================================================
// 6. publishBehavior() - Publish with BehaviorSubject
// ============================================================================
/**
 * publishBehavior(): Returns a ConnectableObservable that uses a BehaviorSubject
 * internally. New subscribers will receive the current value immediately.
 */

console.log('\n=== publishBehavior() Examples ===');

const source4 = interval(1000).pipe(
  take(5),
  tap(x => console.log('PublishBehavior source execution:', x))
);

const publishedBehavior = source4.pipe(
  publishBehavior(0) // Initial value
);

publishedBehavior.subscribe(value => console.log('PublishBehavior subscriber 1:', value));

const behaviorConnection = publishedBehavior.connect();

setTimeout(() => {
  publishedBehavior.subscribe(value => console.log('PublishBehavior subscriber 2 (late):', value));
}, 2500);

setTimeout(() => {
  behaviorConnection.unsubscribe();
}, 4000);

// ============================================================================
// 7. publishReplay() - Publish with ReplaySubject
// ============================================================================
/**
 * publishReplay(): Returns a ConnectableObservable that uses a ReplaySubject
 * internally. New subscribers will receive the last N values.
 */

console.log('\n=== publishReplay() Examples ===');

const source5 = interval(1000).pipe(
  take(5),
  tap(x => console.log('PublishReplay source execution:', x))
);

const publishedReplay = source5.pipe(
  publishReplay(2) // Replay last 2 values
);

const replayConnection = publishedReplay.connect();

setTimeout(() => {
  publishedReplay.subscribe(value => console.log('PublishReplay subscriber (late):', value));
}, 3500);

setTimeout(() => {
  replayConnection.unsubscribe();
}, 5000);

// ============================================================================
// 8. publishLast() - Publish with AsyncSubject
// ============================================================================
/**
 * publishLast(): Returns a ConnectableObservable that uses an AsyncSubject
 * internally. New subscribers will receive only the last value when it completes.
 */

console.log('\n=== publishLast() Examples ===');

const source6 = interval(1000).pipe(
  take(5),
  tap(x => console.log('PublishLast source execution:', x))
);

const publishedLast = source6.pipe(publishLast());

publishedLast.subscribe(value => console.log('PublishLast subscriber 1:', value));

const lastConnection = publishedLast.connect();

setTimeout(() => {
  publishedLast.subscribe(value => console.log('PublishLast subscriber 2 (late):', value));
}, 2000);

setTimeout(() => {
  lastConnection.unsubscribe();
}, 6000);

// ============================================================================
// 9. refCount() - Automatic connection management
// ============================================================================
/**
 * refCount(): Makes a ConnectableObservable behave like an ordinary Observable.
 * It automatically connects when the first subscriber subscribes and disconnects
 * when the last subscriber unsubscribes.
 */

console.log('\n=== refCount() Examples ===');

const source7 = interval(1000).pipe(
  take(5),
  tap(x => console.log('RefCount source execution:', x))
);

const refCounted = source7.pipe(
  publish(),
  refCount() // Automatically connect/disconnect
);

// First subscriber triggers connection
const sub1 = refCounted.subscribe(value => console.log('RefCount subscriber 1:', value));

setTimeout(() => {
  // Second subscriber (connection already active)
  const sub2 = refCounted.subscribe(value => console.log('RefCount subscriber 2:', value));
  
  setTimeout(() => {
    // Unsubscribe first subscriber
    sub1.unsubscribe();
    console.log('RefCount: First subscriber unsubscribed');
    
    setTimeout(() => {
      // Unsubscribe second subscriber (triggers disconnect)
      sub2.unsubscribe();
      console.log('RefCount: Second subscriber unsubscribed (disconnected)');
    }, 1000);
  }, 2000);
}, 1000);

// ============================================================================
// 10. Practical Examples
// ============================================================================

/**
 * Example: Shared HTTP Request
 * Multiple components can subscribe to the same HTTP request
 */
function createSharedHttpRequest<T>(request$: Observable<T>): Observable<T> {
  return request$.pipe(
    shareReplay(1) // Share and replay last value
  );
}

/**
 * Example: Shared Configuration
 * Load configuration once and share with all subscribers
 */
function createSharedConfig(): Observable<any> {
  const config$ = new Observable(observer => {
    console.log('Loading configuration...');
    // Simulate API call
    setTimeout(() => {
      observer.next({ apiUrl: 'https://api.example.com', timeout: 5000 });
      observer.complete();
    }, 1000);
  });

  return config$.pipe(
    shareReplay(1)
  );
}

const sharedConfig = createSharedConfig();
sharedConfig.subscribe(config => console.log('Config subscriber 1:', config));
sharedConfig.subscribe(config => console.log('Config subscriber 2:', config));

/**
 * Example: WebSocket Connection Sharing
 */
function createSharedWebSocket(url: string): Observable<any> {
  const ws$ = new Observable(observer => {
    console.log('Connecting to WebSocket...');
    // Simulate WebSocket
    const intervalId = setInterval(() => {
      observer.next({ type: 'message', data: 'WebSocket data' });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('WebSocket disconnected');
    };
  });

  return ws$.pipe(
    share() // Share the WebSocket connection
  );
}

const sharedWS = createSharedWebSocket('ws://example.com');
sharedWS.subscribe(msg => console.log('WS subscriber 1:', msg));
setTimeout(() => {
  sharedWS.subscribe(msg => console.log('WS subscriber 2:', msg));
}, 2000);

// Export for use in other files
export {
  createSharedHttpRequest,
  createSharedConfig,
  createSharedWebSocket
};

