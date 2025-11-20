/**
 * Subjects Examples
 * 
 * This file demonstrates RxJS Subjects:
 * - Subject
 * - BehaviorSubject
 * - ReplaySubject
 * - AsyncSubject
 */

import {
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  Observable,
  interval
} from 'rxjs';
import { take } from 'rxjs/operators';

// ============================================================================
// 1. Subject - Basic multicast Observable
// ============================================================================
/**
 * Subject: A multicast Observable that can emit values imperatively.
 * It maintains a list of observers and notifies them of events.
 */

console.log('=== Subject Examples ===');

const subject = new Subject<number>();

// Subscribe before emitting
const subscription1 = subject.subscribe({
  next: (value) => console.log('Subject subscriber 1:', value)
});

const subscription2 = subject.subscribe({
  next: (value) => console.log('Subject subscriber 2:', value)
});

// Emit values
subject.next(1);
subject.next(2);
subject.next(3);

// Subscribe after emitting (won't receive previous values)
const subscription3 = subject.subscribe({
  next: (value) => console.log('Subject subscriber 3 (late):', value)
});

subject.next(4);

// Complete the Subject
subject.complete();

// After complete, new subscribers won't receive values
const subscription4 = subject.subscribe({
  next: (value) => console.log('This will not be called'),
  complete: () => console.log('Subject completed')
});

// Cleanup
subscription1.unsubscribe();
subscription2.unsubscribe();
subscription3.unsubscribe();
subscription4.unsubscribe();

// ============================================================================
// 2. BehaviorSubject - Subject with current value
// ============================================================================
/**
 * BehaviorSubject: A Subject that requires an initial value and emits
 * its current value to new subscribers.
 */

console.log('\n=== BehaviorSubject Examples ===');

// Create with initial value
const behaviorSubject = new BehaviorSubject<number>(0);

// Subscribe immediately (gets initial value)
behaviorSubject.subscribe({
  next: (value) => console.log('BehaviorSubject subscriber 1:', value)
});

// Emit new values
behaviorSubject.next(1);
behaviorSubject.next(2);

// Subscribe later (gets current value)
behaviorSubject.subscribe({
  next: (value) => console.log('BehaviorSubject subscriber 2 (late):', value)
});

behaviorSubject.next(3);

// Get current value synchronously
console.log('Current value:', behaviorSubject.value);

// Complete
behaviorSubject.complete();

// ============================================================================
// 3. ReplaySubject - Replay previous values to new subscribers
// ============================================================================
/**
 * ReplaySubject: A Subject that replays a specified number of previous
 * values to new subscribers.
 */

console.log('\n=== ReplaySubject Examples ===');

// Replay last 3 values
const replaySubject = new ReplaySubject<number>(3);

replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);
replaySubject.next(4);
replaySubject.next(5);

// Subscribe after values were emitted (gets last 3)
replaySubject.subscribe({
  next: (value) => console.log('ReplaySubject subscriber (late):', value)
});

replaySubject.next(6);

// ReplaySubject with time window
const replaySubjectWithTime = new ReplaySubject<number>(10, 500);

replaySubjectWithTime.next(1);
setTimeout(() => replaySubjectWithTime.next(2), 100);
setTimeout(() => replaySubjectWithTime.next(3), 200);
setTimeout(() => {
  replaySubjectWithTime.subscribe({
    next: (value) => console.log('ReplaySubject (time window):', value)
  });
}, 400);

// ============================================================================
// 4. AsyncSubject - Emit only last value on completion
// ============================================================================
/**
 * AsyncSubject: A Subject that emits only the last value (and only the last value)
 * emitted by the source Observable, and only after that source Observable completes.
 */

console.log('\n=== AsyncSubject Examples ===');

const asyncSubject = new AsyncSubject<number>();

// Subscribe before completion
asyncSubject.subscribe({
  next: (value) => console.log('AsyncSubject subscriber 1:', value),
  complete: () => console.log('AsyncSubject subscriber 1: completed')
});

asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3);

// Subscribe before completion (will still get last value)
asyncSubject.subscribe({
  next: (value) => console.log('AsyncSubject subscriber 2:', value),
  complete: () => console.log('AsyncSubject subscriber 2: completed')
});

// Complete - only now will subscribers receive the last value (3)
asyncSubject.complete();

// Subscribe after completion (won't receive anything)
asyncSubject.subscribe({
  next: (value) => console.log('This will not be called'),
  complete: () => console.log('AsyncSubject subscriber 3: completed (no value)')
});

// ============================================================================
// 5. Subject as Observable and Observer
// ============================================================================
/**
 * Subjects can be used as both Observable and Observer.
 * This allows them to bridge between imperative and reactive code.
 */

console.log('\n=== Subject as Bridge Examples ===');

const bridgeSubject = new Subject<number>();

// Use as Observable
bridgeSubject.subscribe({
  next: (value) => console.log('Bridge as Observable:', value)
});

// Use as Observer (subscribe another Observable to it)
const source$ = interval(100).pipe(take(5));
source$.subscribe(bridgeSubject);

// ============================================================================
// 6. Practical Examples
// ============================================================================

/**
 * Example: State management with BehaviorSubject
 */
class StateService {
  private stateSubject = new BehaviorSubject<{ count: number }>({ count: 0 });
  public state$ = this.stateSubject.asObservable();

  getState() {
    return this.stateSubject.value;
  }

  increment() {
    const current = this.stateSubject.value;
    this.stateSubject.next({ count: current.count + 1 });
  }

  decrement() {
    const current = this.stateSubject.value;
    this.stateSubject.next({ count: current.count - 1 });
  }
}

// Usage
const stateService = new StateService();
stateService.state$.subscribe(state => console.log('State:', state));
stateService.increment();
stateService.increment();
stateService.decrement();

/**
 * Example: Event bus with Subject
 */
class EventBus {
  private eventSubject = new Subject<string>();
  public events$ = this.eventSubject.asObservable();

  emit(event: string) {
    this.eventSubject.next(event);
  }
}

const eventBus = new EventBus();
eventBus.events$.subscribe(event => console.log('Event:', event));
eventBus.emit('user-logged-in');
eventBus.emit('data-loaded');

/**
 * Example: Caching with ReplaySubject
 */
class DataCache<T> {
  private cacheSubject = new ReplaySubject<T>(1);
  public data$ = this.cacheSubject.asObservable();

  setData(data: T) {
    this.cacheSubject.next(data);
  }

  getData(): Observable<T> {
    return this.data$;
  }
}

const cache = new DataCache<string>();
cache.setData('Cached Data 1');
cache.setData('Cached Data 2');

// Late subscriber gets last value
cache.getData().subscribe(data => console.log('Cached data:', data));

/**
 * Example: Request/Response with AsyncSubject
 */
class RequestService {
  private responseSubject = new AsyncSubject<any>();

  makeRequest(): Observable<any> {
    // Simulate async request
    setTimeout(() => {
      this.responseSubject.next({ data: 'Response Data' });
      this.responseSubject.complete();
    }, 1000);

    return this.responseSubject.asObservable();
  }
}

const requestService = new RequestService();
requestService.makeRequest().subscribe(response => {
  console.log('Request response:', response);
});

// ============================================================================
// EXPORT FOR USE IN OTHER FILES
// ============================================================================
export {
  subject,
  behaviorSubject,
  replaySubject,
  asyncSubject,
  StateService,
  EventBus,
  DataCache,
  RequestService
};

