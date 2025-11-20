/**
 * Advanced Operators Examples
 * 
 * This file demonstrates advanced RxJS operators:
 * - bufferWhen()
 * - windowTime()
 * - audit()
 * - debounce()
 * - throttle()
 * - sample()
 * - onErrorResumeNext()
 */

import {
  of,
  interval,
  timer,
  throwError,
  Observable,
  EMPTY
} from 'rxjs';
import {
  bufferWhen,
  windowTime,
  audit,
  debounce,
  throttle,
  sample,
  onErrorResumeNext,
  take,
  map,
  tap,
  mergeMap,
  toArray
} from 'rxjs/operators';

// ============================================================================
// 1. bufferWhen() - Buffer based on closing Observable
// ============================================================================
/**
 * bufferWhen(): Collects values from the past as an array. When it starts
 * collecting values, it calls a function that returns an Observable that
 * determines when to close the buffer and restart collecting.
 */

console.log('=== bufferWhen() Examples ===');

// Buffer values until a timer emits
interval(100).pipe(
  take(20),
  bufferWhen(() => timer(500)) // Close buffer every 500ms
).subscribe(buffer => console.log('bufferWhen(timer):', buffer));

// Buffer with dynamic closing
interval(100).pipe(
  take(20),
  bufferWhen(() => {
    // Close buffer after random time between 300-700ms
    const delay = 300 + Math.random() * 400;
    return timer(delay);
  })
).subscribe(buffer => console.log('bufferWhen(dynamic):', buffer));

// Buffer until another Observable emits
const source1 = interval(100).pipe(take(20));
const closer = interval(1000);
source1.pipe(
  bufferWhen(() => closer)
).subscribe(buffer => console.log('bufferWhen(interval):', buffer));

// ============================================================================
// 2. windowTime() - Window by time period
// ============================================================================
/**
 * windowTime(): Branch out the source Observable values as a nested Observable
 * periodically in time.
 */

console.log('\n=== windowTime() Examples ===');

// Window every 500ms
interval(100).pipe(
  take(20),
  windowTime(500)
).subscribe(window$ => {
  console.log('New window opened');
  window$.subscribe(value => console.log('  Window value:', value));
});

// Window with start window every 500ms, max window size 3
interval(100).pipe(
  take(20),
  windowTime(500, undefined, 3) // windowTime(duration, scheduler, maxWindowSize)
).subscribe(window$ => {
  window$.subscribe(value => console.log('windowTime(maxSize):', value));
});

// ============================================================================
// 3. audit() - Ignore values for duration after each emission
// ============================================================================
/**
 * audit(): Ignores source values for a duration determined by another Observable,
 * then emits the most recent value from the source Observable, then repeats
 * this process.
 */

console.log('\n=== audit() Examples ===');

// Audit: ignore for 500ms after each emission, then emit latest
interval(100).pipe(
  take(20),
  audit(() => timer(500)) // Ignore for 500ms after each emission
).subscribe(value => console.log('audit(500ms):', value));

// Audit with dynamic duration
interval(100).pipe(
  take(20),
  audit(() => timer(200 + Math.random() * 300))
).subscribe(value => console.log('audit(dynamic):', value));

// ============================================================================
// 4. debounce() - Emit after period of silence (with Observable)
// ============================================================================
/**
 * debounce(): Emits a value from the source Observable only after a particular
 * time span determined by another Observable has passed without another source emission.
 */

console.log('\n=== debounce() Examples ===');

// Debounce with Observable duration
interval(100).pipe(
  take(20),
  debounce(() => timer(300)) // Emit after 300ms of silence
).subscribe(value => console.log('debounce(300ms):', value));

// Debounce with dynamic duration based on value
of(1, 2, 3, 4, 5).pipe(
  mergeMap(x => timer(x * 100).pipe(mapTo(x))),
  debounce(x => timer(x * 200)) // Longer debounce for larger values
).subscribe(value => console.log('debounce(dynamic):', value));

// ============================================================================
// 5. throttle() - Emit first value, then ignore for duration
// ============================================================================
/**
 * throttle(): Emits a value from the source Observable, then ignores subsequent
 * source values for a duration determined by another Observable, then repeats
 * this process.
 */

console.log('\n=== throttle() Examples ===');

// Throttle: emit first, then ignore for 500ms
interval(100).pipe(
  take(20),
  throttle(() => timer(500)) // Ignore for 500ms after first emission
).subscribe(value => console.log('throttle(500ms):', value));

// Throttle with leading and trailing
interval(100).pipe(
  take(20),
  throttle(
    () => timer(500),
    { leading: true, trailing: true } // Emit both first and last in window
  )
).subscribe(value => console.log('throttle(leading+trailing):', value));

// ============================================================================
// 6. sample() - Sample latest value at intervals
// ============================================================================
/**
 * sample(): Emits the most recently emitted value from the source Observable
 * whenever another Observable (the notifier) emits.
 */

console.log('\n=== sample() Examples ===');

// Sample latest value every 500ms
interval(100).pipe(
  take(20),
  sample(timer(0, 500)) // Sample every 500ms
).subscribe(value => console.log('sample(500ms):', value));

// Sample with interval notifier
interval(50).pipe(
  take(30),
  sample(interval(300)) // Sample every 300ms
).subscribe(value => console.log('sample(interval):', value));

// ============================================================================
// 7. onErrorResumeNext() - Continue with another Observable on error
// ============================================================================
/**
 * onErrorResumeNext(): When the source Observable emits an error, this operator
 * will begin emitting items from another Observable you provide.
 */

console.log('\n=== onErrorResumeNext() Examples ===');

// Continue with fallback Observable on error
throwError(() => new Error('Source error')).pipe(
  onErrorResumeNext(of('Fallback value 1', 'Fallback value 2'))
).subscribe({
  next: value => console.log('onErrorResumeNext():', value),
  error: err => console.error('This should not be called:', err)
});

// Multiple fallback Observables
throwError(() => new Error('Error 1')).pipe(
  onErrorResumeNext(
    throwError(() => new Error('Error 2')),
    of('Final fallback')
  )
).subscribe({
  next: value => console.log('onErrorResumeNext(multiple):', value)
});

// ============================================================================
// 8. Practical Examples
// ============================================================================

/**
 * Example: Rate limiting with throttle
 */
function rateLimit<T>(
  source: Observable<T>,
  maxPerSecond: number
): Observable<T> {
  const intervalMs = 1000 / maxPerSecond;
  return source.pipe(
    throttle(() => timer(intervalMs))
  );
}

/**
 * Example: Smart debounce (longer for larger values)
 */
function smartDebounce<T>(
  source: Observable<T>,
  getDebounceTime: (value: T) => number
): Observable<T> {
  return source.pipe(
    debounce(value => timer(getDebounceTime(value)))
  );
}

/**
 * Example: Batch processing with bufferWhen
 */
function batchProcess<T>(
  source: Observable<T>,
  batchSize: number
): Observable<T[]> {
  let count = 0;
  return source.pipe(
    bufferWhen(() => {
      count++;
      if (count >= batchSize) {
        count = 0;
        return timer(0); // Immediate
      }
      return EMPTY; // Never close
    })
  );
}

/**
 * Example: Sliding window with windowTime
 */
function slidingWindow<T>(
  source: Observable<T>,
  windowSize: number,
  slideInterval: number
): Observable<T[]> {
  return source.pipe(
    windowTime(windowSize, undefined, slideInterval),
    mergeMap(window$ => window$.pipe(toArray()))
  );
}

/**
 * Example: Error recovery chain
 */
function errorRecovery<T>(
  source: Observable<T>,
  ...fallbacks: Observable<T>[]
): Observable<T> {
  return source.pipe(
    onErrorResumeNext(...fallbacks)
  );
}

// Export for use in other files
export {
  rateLimit,
  smartDebounce,
  batchProcess,
  slidingWindow,
  errorRecovery
};

