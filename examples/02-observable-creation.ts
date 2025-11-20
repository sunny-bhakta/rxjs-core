/**
 * Observable Creation Operators Examples
 * 
 * This file demonstrates various ways to create Observables:
 * - of()
 * - from()
 * - fromEvent()
 * - interval()
 * - timer()
 * - range()
 * - throwError()
 * - empty()
 * - never()
 * - defer()
 * - generate()
 * - iif()
 */

import {
  of,
  from,
  fromEvent,
  interval,
  timer,
  range,
  throwError,
  EMPTY,
  NEVER,
  defer,
  generate,
  iif,
  Observable
} from 'rxjs';
import { take, delay } from 'rxjs/operators';

// ============================================================================
// 1. of() - Creates Observable from values
// ============================================================================
/**
 * of(): Creates an Observable that emits the arguments you provide,
 * then completes.
 */

console.log('=== of() Examples ===');

// Emit multiple values
const ofExample1 = of(1, 2, 3, 4, 5);
ofExample1.subscribe(value => console.log('of(1,2,3,4,5):', value));

// Emit different types
const ofExample2 = of('Hello', 'World', 42, true);
ofExample2.subscribe(value => console.log('of(mixed):', value));

// Emit an array as a single value
const ofExample3 = of([1, 2, 3]);
ofExample3.subscribe(value => console.log('of([1,2,3]):', value));

// ============================================================================
// 2. from() - Creates Observable from array, promise, or iterable
// ============================================================================
/**
 * from(): Converts various other objects and data structures into Observables.
 * It can convert arrays, promises, iterables, and Observable-like objects.
 */

console.log('\n=== from() Examples ===');

// From array (emits each element)
const fromArray = from([1, 2, 3, 4, 5]);
fromArray.subscribe(value => console.log('from([1,2,3,4,5]):', value));

// From Promise
const promise = Promise.resolve('Hello from Promise');
const fromPromise = from(promise);
fromPromise.subscribe(value => console.log('from(Promise):', value));

// From string (emits each character)
const fromString = from('Hello');
fromString.subscribe(value => console.log('from("Hello"):', value));

// From Set
const fromSet = from(new Set([1, 2, 3]));
fromSet.subscribe(value => console.log('from(Set):', value));

// From Map
const fromMap = from(new Map([['key1', 'value1'], ['key2', 'value2']]));
fromMap.subscribe(value => console.log('from(Map):', value));

// ============================================================================
// 3. fromEvent() - Creates Observable from DOM events
// ============================================================================
/**
 * fromEvent(): Creates an Observable that emits events of a specific type
 * coming from the given event target.
 */

console.log('\n=== fromEvent() Examples ===');

// Note: These examples require a DOM environment
// In Node.js, you would use EventEmitter instead

// Example for browser (commented out for Node.js compatibility)
/*
const button = document.querySelector('button');
const click$ = fromEvent(button, 'click');
click$.subscribe(event => console.log('Button clicked!', event));
*/

// Example for Node.js EventEmitter
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
const event$ = fromEvent(emitter, 'data');
event$.subscribe(data => console.log('Event received:', data));

// Emit some events
setTimeout(() => emitter.emit('data', 'Event 1'), 100);
setTimeout(() => emitter.emit('data', 'Event 2'), 200);
setTimeout(() => emitter.emit('data', 'Event 3'), 300);

// ============================================================================
// 4. interval() - Emits sequential numbers at intervals
// ============================================================================
/**
 * interval(): Creates an Observable that emits sequential numbers
 * every specified interval of time.
 */

console.log('\n=== interval() Examples ===');

// Emit numbers every 1 second (take only first 5)
const intervalExample = interval(1000).pipe(take(5));
intervalExample.subscribe(value => console.log('interval(1000):', value));

// ============================================================================
// 5. timer() - Emits after a delay
// ============================================================================
/**
 * timer(): Creates an Observable that starts emitting after an initialDelay,
 * and then emits values at the specified interval.
 */

console.log('\n=== timer() Examples ===');

// Emit after 2 seconds, then complete
const timer1 = timer(2000);
timer1.subscribe({
  next: () => console.log('timer(2000): Emitted after 2 seconds'),
  complete: () => console.log('timer(2000): Completed')
});

// Emit after 1 second, then every 500ms (take 5 values)
const timer2 = timer(1000, 500).pipe(take(5));
timer2.subscribe(value => console.log('timer(1000, 500):', value));

// ============================================================================
// 6. range() - Emits a range of numbers
// ============================================================================
/**
 * range(): Creates an Observable that emits a sequence of numbers
 * within a specified range.
 */

console.log('\n=== range() Examples ===');

// Emit numbers from 1 to 5
const range1 = range(1, 5);
range1.subscribe(value => console.log('range(1, 5):', value));

// Emit numbers from 10 to 15
const range2 = range(10, 6);
range2.subscribe(value => console.log('range(10, 6):', value));

// ============================================================================
// 7. throwError() - Creates Observable that errors
// ============================================================================
/**
 * throwError(): Creates an Observable that immediately errors
 * with the specified error.
 */

console.log('\n=== throwError() Examples ===');

const errorObservable = throwError(() => new Error('Something went wrong!'));
errorObservable.subscribe({
  next: () => console.log('This will not be called'),
  error: (err) => console.error('throwError():', err.message),
  complete: () => console.log('This will not be called')
});

// ============================================================================
// 8. EMPTY - Completes immediately
// ============================================================================
/**
 * EMPTY: Creates an Observable that emits no items and immediately
 * completes.
 */

console.log('\n=== EMPTY Examples ===');

const emptyObservable = EMPTY;
emptyObservable.subscribe({
  next: () => console.log('This will not be called'),
  complete: () => console.log('EMPTY: Completed immediately')
});

// ============================================================================
// 9. NEVER - Never emits or completes
// ============================================================================
/**
 * NEVER: Creates an Observable that never emits anything and never completes.
 */

console.log('\n=== NEVER Examples ===');

const neverObservable = NEVER;
// This will never emit or complete
const neverSub = neverObservable.subscribe({
  next: () => console.log('This will never be called'),
  complete: () => console.log('This will never be called')
});

// Unsubscribe after 1 second to prevent hanging
setTimeout(() => {
  neverSub.unsubscribe();
  console.log('NEVER: Unsubscribed (it would never complete)');
}, 1000);

// ============================================================================
// 10. defer() - Lazy Observable creation
// ============================================================================
/**
 * defer(): Creates an Observable that, on subscribe, calls an Observable
 * factory function to make an Observable for each new Observer.
 */

console.log('\n=== defer() Examples ===');

// Defer the creation until subscription
const deferredObservable = defer(() => {
  const random = Math.random();
  console.log('defer(): Creating Observable with random:', random);
  return of(random);
});

// Each subscription gets a new Observable with a new random value
deferredObservable.subscribe(value => console.log('defer() subscriber 1:', value));
deferredObservable.subscribe(value => console.log('defer() subscriber 2:', value));

// ============================================================================
// 11. generate() - Generates values
// ============================================================================
/**
 * generate(): Creates an Observable by generating values based on
 * an initial state and a condition function.
 */

console.log('\n=== generate() Examples ===');

// Generate numbers from 1 to 5
const generated1 = generate(
  1,                    // initial state
  x => x <= 5,          // condition
  x => x + 1,           // iterate
  x => x                // result selector
);
generated1.subscribe(value => console.log('generate(1 to 5):', value));

// Generate even numbers
const generated2 = generate(
  0,
  x => x < 10,
  x => x + 2,
  x => x
);
generated2.subscribe(value => console.log('generate(even):', value));

// ============================================================================
// 12. iif() - Conditional Observable creation
// ============================================================================
/**
 * iif(): Determines which Observable will be subscribed to at subscription time
 * based on a condition function.
 */

console.log('\n=== iif() Examples ===');

const condition = true;
const trueObservable = of('Condition is true');
const falseObservable = of('Condition is false');

const conditionalObservable = iif(
  () => condition,
  trueObservable,
  falseObservable
);

conditionalObservable.subscribe(value => console.log('iif():', value));

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

/**
 * Example: Creating an Observable from user input
 */
function createUserInputObservable(): Observable<string> {
  // In a real scenario, this would be fromEvent for input field
  return from(['user1', 'user2', 'user3']);
}

/**
 * Example: Creating a polling Observable
 */
function createPollingObservable(intervalMs: number): Observable<number> {
  return interval(intervalMs).pipe(
    // In real scenario, you'd make an HTTP request here
    // switchMap(() => this.http.get('/api/data'))
  );
}

/**
 * Example: Creating an Observable with retry logic
 */
function createRetryableObservable(): Observable<any> {
  return defer(() => {
    // Simulate an API call
    const shouldFail = Math.random() > 0.5;
    if (shouldFail) {
      return throwError(() => new Error('API call failed'));
    }
    return of({ data: 'Success' });
  });
}

// Export for use in other files
export {
  ofExample1,
  fromArray,
  fromPromise,
  intervalExample,
  timer1,
  timer2,
  range1,
  errorObservable,
  emptyObservable,
  deferredObservable,
  generated1,
  conditionalObservable
};

