/**
 * Error Handling Examples
 * 
 * This file demonstrates error handling in RxJS:
 * - catchError()
 * - retry()
 * - retryWhen()
 * - throwError()
 * - Error callback in Observer
 * - Error handling patterns
 */

import {
  of,
  throwError,
  interval,
  timer,
  Observable,
  EMPTY
} from 'rxjs';
import {
  catchError,
  retry,
  retryWhen,
  delay,
  take,
  map,
  tap,
  mergeMap
} from 'rxjs/operators';

// ============================================================================
// 1. Error Callback in Observer
// ============================================================================
/**
 * Basic error handling using the error callback in the Observer.
 */

console.log('=== Error Callback Examples ===');

const errorObservable = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.error(new Error('Something went wrong'));
  subscriber.next(3); // Won't be emitted
});

errorObservable.subscribe({
  next: (value) => console.log('Value:', value),
  error: (err) => console.error('Error caught:', err.message),
  complete: () => console.log('This will not be called')
});

// ============================================================================
// 2. catchError() - Catch and handle errors
// ============================================================================
/**
 * catchError(): Catches errors on the observable to be handled by
 * returning a new observable or throwing an error.
 */

console.log('\n=== catchError() Examples ===');

// Catch and replace with default value
of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Error on 2');
    return x;
  }),
  catchError(err => {
    console.error('Caught error:', err.message);
    return of('Default Value');
  })
).subscribe(value => console.log('catchError(replace):', value));

// Catch and return empty Observable
of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Error on 2');
    return x;
  }),
  catchError(() => EMPTY)
).subscribe({
  next: (value) => console.log('catchError(empty):', value),
  complete: () => console.log('Completed (empty after error)')
});

// Catch and switch to another Observable
of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Error on 2');
    return x;
  }),
  catchError(() => of('Fallback', 'Values'))
).subscribe(value => console.log('catchError(switch):', value));

// Catch and rethrow
of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Original error');
    return x;
  }),
  catchError(err => {
    console.error('Logging error:', err.message);
    return throwError(() => new Error('Transformed error'));
  })
).subscribe({
  next: (value) => console.log('Value:', value),
  error: (err) => console.error('Rethrown error:', err.message)
});

// ============================================================================
// 3. retry() - Retry on error
// ============================================================================
/**
 * retry(): Returns an Observable that mirrors the source Observable,
 * resubscribing to it if it calls error.
 */

console.log('\n=== retry() Examples ===');

let attemptCount = 0;

// Retry 3 times
of(1, 2, 3).pipe(
  map(x => {
    attemptCount++;
    if (attemptCount < 3) {
      throw new Error(`Attempt ${attemptCount} failed`);
    }
    return x;
  }),
  retry(3)
).subscribe({
  next: (value) => console.log('retry() success:', value),
  error: (err) => console.error('retry() failed:', err.message)
});

// Retry infinite times (with delay using retryWhen)
attemptCount = 0;
of(1, 2, 3).pipe(
  map(x => {
    attemptCount++;
    if (attemptCount < 5) {
      throw new Error(`Attempt ${attemptCount} failed`);
    }
    return x;
  }),
  retry(10) // Retry up to 10 times
).subscribe({
  next: (value) => console.log('retry(10) success:', value),
  error: (err) => console.error('retry(10) failed:', err.message)
});

// ============================================================================
// 4. retryWhen() - Retry based on Observable
// ============================================================================
/**
 * retryWhen(): Returns an Observable that mirrors the source Observable,
 * resubscribing to it if it calls error and the notifier Observable emits a value.
 */

console.log('\n=== retryWhen() Examples ===');

attemptCount = 0;

// Retry with exponential backoff
of(1, 2, 3).pipe(
  map(x => {
    attemptCount++;
    if (attemptCount < 4) {
      throw new Error(`Attempt ${attemptCount} failed`);
    }
    return x;
  }),
  retryWhen(errors =>
    errors.pipe(
      mergeMap((err, i) => {
        const retryAttempt = i + 1;
        if (retryAttempt > 3) {
          return throwError(() => err);
        }
        console.log(`Retrying after ${retryAttempt} second(s)...`);
        return timer(retryAttempt * 1000);
      })
    )
  )
).subscribe({
  next: (value) => console.log('retryWhen() success:', value),
  error: (err) => console.error('retryWhen() failed:', err.message)
});

// Retry with max attempts
attemptCount = 0;
of(1, 2, 3).pipe(
  map(x => {
    attemptCount++;
    if (attemptCount < 5) {
      throw new Error(`Attempt ${attemptCount} failed`);
    }
    return x;
  }),
  retryWhen(errors =>
    errors.pipe(
      mergeMap((err, i) => {
        if (i >= 4) {
          return throwError(() => new Error('Max retries exceeded'));
        }
        return timer(1000);
      })
    )
  )
).subscribe({
  next: (value) => console.log('retryWhen(max) success:', value),
  error: (err) => console.error('retryWhen(max) failed:', err.message)
});

// ============================================================================
// 5. throwError() - Create Observable that errors
// ============================================================================
/**
 * throwError(): Creates an Observable that immediately errors with the
 * specified error.
 */

console.log('\n=== throwError() Examples ===');

throwError(() => new Error('Immediate error')).subscribe({
  next: () => console.log('This will not be called'),
  error: (err) => console.error('throwError():', err.message)
});

// ============================================================================
// 6. Error Handling Patterns
// ============================================================================

/**
 * Pattern 1: Catch and Replace
 * Replace the error with a default value
 */
function catchAndReplace<T>(source: Observable<T>, defaultValue: T): Observable<T> {
  return source.pipe(
    catchError(() => of(defaultValue))
  );
}

/**
 * Pattern 2: Catch and Switch
 * Switch to a fallback Observable on error
 */
function catchAndSwitch<T>(
  source: Observable<T>,
  fallback: Observable<T>
): Observable<T> {
  return source.pipe(
    catchError(() => fallback)
  );
}

/**
 * Pattern 3: Retry with Backoff
 * Retry with exponential backoff
 */
function retryWithBackoff<T>(
  source: Observable<T>,
  maxRetries: number = 3
): Observable<T> {
  return source.pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((err, i) => {
          if (i >= maxRetries) {
            return throwError(() => err);
          }
          const delay = Math.pow(2, i) * 1000; // Exponential backoff
          return timer(delay);
        })
      )
    )
  );
}

/**
 * Pattern 4: Retry with Condition
 * Retry only if error matches a condition
 */
function retryOnCondition<T>(
  source: Observable<T>,
  condition: (error: any) => boolean,
  maxRetries: number = 3
): Observable<T> {
  return source.pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((err, i) => {
          if (i >= maxRetries || !condition(err)) {
            return throwError(() => err);
          }
          return timer(1000);
        })
      )
    )
  );
}

/**
 * Pattern 5: Error Recovery Chain
 * Try multiple fallback strategies
 */
function errorRecoveryChain<T>(
  source: Observable<T>,
  fallbacks: Observable<T>[]
): Observable<T> {
  return source.pipe(
    catchError((err, caught) => {
      if (fallbacks.length === 0) {
        return throwError(() => err);
      }
      const [first, ...rest] = fallbacks;
      return first.pipe(
        catchError(() => errorRecoveryChain(EMPTY, rest))
      );
    })
  );
}

// ============================================================================
// 7. Practical Examples
// ============================================================================

/**
 * Example: HTTP Request with Retry
 */
function httpRequestWithRetry(url: string): Observable<any> {
  // Simulate HTTP request
  const request$ = new Observable(observer => {
    const shouldFail = Math.random() > 0.7;
    if (shouldFail) {
      observer.error(new Error(`Request to ${url} failed`));
    } else {
      observer.next({ data: `Response from ${url}` });
      observer.complete();
    }
  });

  return request$.pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((err, i) => {
          if (i >= 2) {
            return throwError(() => err);
          }
          console.log(`Retrying ${url}... (attempt ${i + 1})`);
          return timer(1000);
        })
      )
    ),
    catchError(err => {
      console.error('All retries failed:', err.message);
      return of({ error: 'Request failed after retries' });
    })
  );
}

// Usage
httpRequestWithRetry('/api/users').subscribe({
  next: (response) => console.log('HTTP success:', response),
  error: (err) => console.error('HTTP error:', err)
});

/**
 * Example: Data Loading with Fallback
 */
function loadDataWithFallback(): Observable<any> {
  const primary$ = new Observable(observer => {
    const shouldFail = Math.random() > 0.5;
    if (shouldFail) {
      observer.error(new Error('Primary source failed'));
    } else {
      observer.next({ source: 'primary', data: 'Primary Data' });
      observer.complete();
    }
  });

  const fallback$ = of({ source: 'fallback', data: 'Fallback Data' });

  return primary$.pipe(
    catchError(() => {
      console.log('Using fallback data source');
      return fallback$;
    })
  );
}

loadDataWithFallback().subscribe(data => console.log('Data loaded:', data));

// Export for use in other files
export {
  catchAndReplace,
  catchAndSwitch,
  retryWithBackoff,
  retryOnCondition,
  errorRecoveryChain,
  httpRequestWithRetry,
  loadDataWithFallback
};

