/**
 * Schedulers Examples
 * 
 * This file demonstrates RxJS Schedulers:
 * - asyncScheduler
 * - asapScheduler
 * - queueScheduler
 * - animationFrameScheduler
 * - observeOn()
 * - subscribeOn()
 */

import {
  of,
  interval,
  Observable,
  asyncScheduler,
  asapScheduler,
  queueScheduler,
  animationFrameScheduler
} from 'rxjs';
import {
  observeOn,
  subscribeOn,
  tap,
  map
} from 'rxjs/operators';

// ============================================================================
// 1. Scheduler Concept
// ============================================================================
/**
 * Scheduler: Controls when a subscription starts and when notifications
 * are delivered. It provides a context for execution.
 */

console.log('=== Scheduler Concept ===');

// Without scheduler (synchronous)
console.log('Without scheduler (sync):');
of(1, 2, 3).subscribe(value => console.log('  Value:', value));
console.log('  After subscription');

// ============================================================================
// 2. asyncScheduler - Async queue (setTimeout)
// ============================================================================
/**
 * asyncScheduler: Schedules tasks on the async queue (uses setTimeout).
 * Tasks are executed asynchronously.
 */

console.log('\n=== asyncScheduler Examples ===');

console.log('Before asyncScheduler:');
of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(value => console.log('  asyncScheduler value:', value));
console.log('After asyncScheduler subscription');

// Using asyncScheduler for delayed execution
of(1, 2, 3).pipe(
  observeOn(asyncScheduler, 1000) // Delay by 1 second
).subscribe(value => console.log('  asyncScheduler (delayed):', value));

// ============================================================================
// 3. asapScheduler - Microtask queue (Promise)
// ============================================================================
/**
 * asapScheduler: Schedules tasks on the microtask queue (uses Promise).
 * Tasks are executed as soon as possible, but after the current execution.
 */

console.log('\n=== asapScheduler Examples ===');

console.log('Before asapScheduler:');
of(1, 2, 3).pipe(
  observeOn(asapScheduler)
).subscribe(value => console.log('  asapScheduler value:', value));
console.log('After asapScheduler subscription');

// asapScheduler executes before asyncScheduler
Promise.resolve().then(() => console.log('  Promise resolved'));
of('asap').pipe(
  observeOn(asapScheduler)
).subscribe(value => console.log('  asapScheduler:', value));
of('async').pipe(
  observeOn(asyncScheduler)
).subscribe(value => console.log('  asyncScheduler:', value));

// ============================================================================
// 4. queueScheduler - Synchronous queue
// ============================================================================
/**
 * queueScheduler: Schedules tasks synchronously in a queue.
 * Tasks are executed immediately in order.
 */

console.log('\n=== queueScheduler Examples ===');

console.log('Before queueScheduler:');
of(1, 2, 3).pipe(
  observeOn(queueScheduler)
).subscribe(value => console.log('  queueScheduler value:', value));
console.log('After queueScheduler subscription');

// ============================================================================
// 5. animationFrameScheduler - requestAnimationFrame
// ============================================================================
/**
 * animationFrameScheduler: Schedules tasks on requestAnimationFrame.
 * Useful for animations and smooth UI updates.
 */

console.log('\n=== animationFrameScheduler Examples ===');

// Note: animationFrameScheduler is typically used in browser environments
// This is a conceptual example
of(1, 2, 3).pipe(
  observeOn(animationFrameScheduler)
).subscribe(value => console.log('  animationFrameScheduler value:', value));

// ============================================================================
// 6. observeOn() - Control notification delivery
// ============================================================================
/**
 * observeOn(): Re-emits all notifications from source Observable with
 * specified scheduler. Controls when values are delivered to subscribers.
 */

console.log('\n=== observeOn() Examples ===');

// Deliver notifications asynchronously
of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(value => console.log('observeOn(async):', value));

// Deliver notifications with delay
of(1, 2, 3).pipe(
  observeOn(asyncScheduler, 1000)
).subscribe(value => console.log('observeOn(async, 1000ms):', value));

// ============================================================================
// 7. subscribeOn() - Control subscription timing
// ============================================================================
/**
 * subscribeOn(): Asynchronously subscribes Observers to this Observable
 * on the specified scheduler. Controls when subscription starts.
 */

console.log('\n=== subscribeOn() Examples ===');

// Subscribe asynchronously
of(1, 2, 3).pipe(
  subscribeOn(asyncScheduler)
).subscribe(value => console.log('subscribeOn(async):', value));

// Subscribe on ASAP scheduler
of(1, 2, 3).pipe(
  subscribeOn(asapScheduler)
).subscribe(value => console.log('subscribeOn(asap):', value));

// ============================================================================
// 8. Scheduler Comparison
// ============================================================================
/**
 * Comparison of different schedulers:
 * - queueScheduler: Synchronous, immediate execution
 * - asapScheduler: Microtask queue, executes after current execution
 * - asyncScheduler: Async queue, executes after current and microtasks
 * - animationFrameScheduler: Next animation frame
 */

console.log('\n=== Scheduler Comparison ===');

console.log('1. queueScheduler (sync):');
of('queue').pipe(observeOn(queueScheduler)).subscribe(v => console.log('  ', v));
console.log('2. asapScheduler (microtask):');
of('asap').pipe(observeOn(asapScheduler)).subscribe(v => console.log('  ', v));
console.log('3. asyncScheduler (async):');
of('async').pipe(observeOn(asyncScheduler)).subscribe(v => console.log('  ', v));
console.log('4. After all schedulers');

// ============================================================================
// 9. Practical Examples
// ============================================================================

/**
 * Example: UI updates with animationFrameScheduler
 * (Conceptual - would work in browser)
 */
function updateUIWithAnimation<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    observeOn(animationFrameScheduler),
    tap(value => {
      // Update UI smoothly
      console.log('UI updated:', value);
    })
  );
}

/**
 * Example: Heavy computation on async scheduler
 */
function heavyComputationOnAsync<T>(
  source: Observable<T>,
  computation: (value: T) => T
): Observable<T> {
  return source.pipe(
    observeOn(asyncScheduler),
    map(computation)
  );
}

/**
 * Example: Subscribe asynchronously to prevent blocking
 */
function subscribeAsync<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    subscribeOn(asyncScheduler)
  );
}

/**
 * Example: Batch UI updates
 */
function batchUIUpdates<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    observeOn(asapScheduler), // Batch in microtask
    tap(value => {
      // Batch UI updates
      console.log('Batched UI update:', value);
    })
  );
}

// Export for use in other files
export {
  updateUIWithAnimation,
  heavyComputationOnAsync,
  subscribeAsync,
  batchUIUpdates
};

