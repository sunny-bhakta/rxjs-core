/**
 * Utility Operators Examples
 * 
 * This file demonstrates utility operators:
 * - tap()
 * - delay()
 * - delayWhen()
 * - timeout()
 * - timeoutWith()
 * - repeat()
 * - retry()
 * - finalize()
 * - toArray()
 * - observeOn()
 * - subscribeOn()
 */

import {
  of,
  interval,
  timer,
  Observable,
  EMPTY,
  asyncScheduler,
  asapScheduler
} from 'rxjs';
import {
  tap,
  delay,
  delayWhen,
  timeout,
  timeoutWith,
  repeat,
  retry,
  finalize,
  toArray,
  observeOn,
  subscribeOn,
  take,
  map,
  catchError
} from 'rxjs/operators';

// ============================================================================
// 1. tap() - Side effects without modifying stream
// ============================================================================
/**
 * tap(): Performs a side effect for every emission on the source Observable,
 * but returns an Observable that is identical to the source.
 */

console.log('=== tap() Examples ===');

// Logging side effect
of(1, 2, 3, 4, 5).pipe(
  tap(value => console.log('Before map:', value)),
  map(x => x * 2),
  tap(value => console.log('After map:', value))
).subscribe();

// Multiple taps
of(1, 2, 3).pipe(
  tap({
    next: value => console.log('Next:', value),
    error: err => console.error('Error:', err),
    complete: () => console.log('Complete')
  })
).subscribe();

// Side effect for debugging
of(1, 2, 3).pipe(
  tap(value => {
    // Perform side effect (e.g., update UI, log, etc.)
    console.log('Side effect for:', value);
  })
).subscribe();

// ============================================================================
// 2. delay() - Delay each emission
// ============================================================================
/**
 * delay(): Time shifts each emission by the specified amount of time.
 */

console.log('\n=== delay() Examples ===');

of(1, 2, 3).pipe(
  delay(1000)
).subscribe(value => console.log('delay(1000):', value));

// Delay with date
of(1, 2, 3).pipe(
  delay(new Date(Date.now() + 2000))
).subscribe(value => console.log('delay(date):', value));

// ============================================================================
// 3. delayWhen() - Delay based on another Observable
// ============================================================================
/**
 * delayWhen(): Delays the emission of items from the source Observable by
 * a time span determined by another Observable.
 */

console.log('\n=== delayWhen() Examples ===');

of(1, 2, 3).pipe(
  delayWhen(value => timer(value * 1000))
).subscribe(value => console.log('delayWhen(dynamic):', value));

// ============================================================================
// 4. timeout() - Error if no value within time period
// ============================================================================
/**
 * timeout(): Errors if the source Observable does not emit a value within
 * the specified time period.
 */

console.log('\n=== timeout() Examples ===');

// Observable that emits within timeout
interval(500).pipe(
  take(3),
  timeout(1000)
).subscribe({
  next: value => console.log('timeout(success):', value),
  error: err => console.error('timeout(error):', err.message)
});

// Observable that doesn't emit in time (will error)
timer(2000).pipe(
  timeout(1000)
).subscribe({
  next: value => console.log('This will not be called'),
  error: err => console.error('timeout(expired):', err.message)
});

// ============================================================================
// 5. timeoutWith() - Switch to another Observable on timeout
// ============================================================================
/**
 * timeoutWith(): If the source Observable does not emit within the specified
 * time, switch to another Observable.
 */

console.log('\n=== timeoutWith() Examples ===');

timer(2000).pipe(
  timeoutWith(1000, of('Timeout fallback'))
).subscribe(value => console.log('timeoutWith():', value));

// ============================================================================
// 6. repeat() - Repeat Observable
// ============================================================================
/**
 * repeat(): Returns an Observable that repeats the stream of items emitted
 * by the source Observable at most count times.
 */

console.log('\n=== repeat() Examples ===');

of(1, 2, 3).pipe(
  repeat(2)
).subscribe(value => console.log('repeat(2):', value));

// Repeat infinite times (with take to limit)
of(1, 2).pipe(
  repeat(),
  take(10)
).subscribe(value => console.log('repeat(infinite):', value));

// ============================================================================
// 7. retry() - Retry on error
// ============================================================================
/**
 * retry(): Returns an Observable that mirrors the source Observable,
 * resubscribing to it if it calls error.
 */

console.log('\n=== retry() Examples ===');

let attempt = 0;
of(1, 2, 3).pipe(
  map(x => {
    attempt++;
    if (attempt < 3) {
      throw new Error(`Attempt ${attempt} failed`);
    }
    return x;
  }),
  retry(3)
).subscribe({
  next: value => console.log('retry(success):', value),
  error: err => console.error('retry(failed):', err.message)
});

// ============================================================================
// 8. finalize() - Execute callback on termination
// ============================================================================
/**
 * finalize(): Returns an Observable that mirrors the source Observable,
 * but will call a specified function when the source terminates on complete
 * or error.
 */

console.log('\n=== finalize() Examples ===');

of(1, 2, 3).pipe(
  finalize(() => console.log('finalize(): Cleanup executed'))
).subscribe(value => console.log('Value:', value));

// finalize on error
throwError(() => new Error('Test error')).pipe(
  finalize(() => console.log('finalize(): Cleanup on error'))
).subscribe({
  error: err => console.error('Error:', err.message)
});

// ============================================================================
// 9. toArray() - Collect all values into array
// ============================================================================
/**
 * toArray(): Collects all source emissions and emits them as an array
 * when the source completes.
 */

console.log('\n=== toArray() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  toArray()
).subscribe(array => console.log('toArray():', array));

interval(100).pipe(
  take(5),
  toArray()
).subscribe(array => console.log('toArray(interval):', array));

// ============================================================================
// 10. observeOn() - Specify scheduler for notifications
// ============================================================================
/**
 * observeOn(): Re-emits all notifications from source Observable with
 * specified scheduler.
 */

console.log('\n=== observeOn() Examples ===');

of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(value => console.log('observeOn(async):', value));

// ============================================================================
// 11. subscribeOn() - Specify scheduler for subscription
// ============================================================================
/**
 * subscribeOn(): Asynchronously subscribes Observers to this Observable
 * on the specified scheduler.
 */

console.log('\n=== subscribeOn() Examples ===');

of(1, 2, 3).pipe(
  subscribeOn(asapScheduler)
).subscribe(value => console.log('subscribeOn(asap):', value));

// ============================================================================
// 12. Practical Examples
// ============================================================================

/**
 * Example: Request with timeout and retry
 */
function requestWithTimeoutAndRetry<T>(
  request$: Observable<T>,
  timeoutMs: number = 5000,
  maxRetries: number = 3
): Observable<T> {
  return request$.pipe(
    timeout(timeoutMs),
    retry(maxRetries),
    catchError(err => {
      console.error('Request failed after retries:', err);
      return EMPTY;
    }),
    finalize(() => console.log('Request completed'))
  );
}

/**
 * Example: Polling with delay
 */
function createPollingObservable<T>(
  request$: Observable<T>,
  intervalMs: number = 5000
): Observable<T> {
  return request$.pipe(
    delay(intervalMs),
    repeat()
  );
}

/**
 * Example: Debounced search with timeout
 */
function createSearchWithTimeout(
  input$: Observable<string>,
  timeoutMs: number = 3000
): Observable<string[]> {
  return input$.pipe(
    delay(300), // Debounce
    timeout(timeoutMs),
    timeoutWith(timeoutMs, of([])), // Fallback to empty array
    map(term => [`${term} result 1`, `${term} result 2`])
  );
}

/**
 * Example: Resource cleanup with finalize
 */
function createResourceObservable<T>(
  createResource: () => T,
  cleanup: (resource: T) => void
): Observable<T> {
  return new Observable(observer => {
    const resource = createResource();
    observer.next(resource);
    observer.complete();
    
    return () => {
      cleanup(resource);
      console.log('Resource cleaned up');
    };
  }).pipe(
    finalize(() => console.log('Observable finalized'))
  );
}

/**
 * Example: Batch processing with toArray
 */
function batchProcess<T>(
  source: Observable<T>,
  batchSize: number
): Observable<T[]> {
  return source.pipe(
    toArray(),
    map(array => {
      const batches: T[][] = [];
      for (let i = 0; i < array.length; i += batchSize) {
        batches.push(array.slice(i, i + batchSize));
      }
      return batches;
    }),
    mergeAll() // Flatten batches
  );
}

// Export for use in other files
export {
  requestWithTimeoutAndRetry,
  createPollingObservable,
  createSearchWithTimeout,
  createResourceObservable,
  batchProcess
};

