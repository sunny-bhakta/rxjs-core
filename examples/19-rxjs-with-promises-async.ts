/**
 * RxJS with Promises and Async/Await Examples
 * 
 * This file demonstrates integrating RxJS with Promises and async/await:
 * - Converting Observables to Promises
 * - Converting Promises to Observables
 * - Using async/await with Observables
 * - Combining Promises and Observables
 * - Error handling with async/await
 */

import {
  Observable,
  from,
  firstValueFrom,
  lastValueFrom,
  of,
  throwError,
  interval,
  timer
} from 'rxjs';
import {
  map,
  catchError,
  take,
  timeout,
  retry
} from 'rxjs/operators';

// ============================================================================
// 1. Converting Observable to Promise
// ============================================================================
/**
 * Converting Observables to Promises using firstValueFrom and lastValueFrom.
 */

console.log('=== Observable to Promise ===');

// firstValueFrom - Get first value
async function exampleFirstValueFrom() {
  try {
    const value = await firstValueFrom(
      of(1, 2, 3, 4, 5)
    );
    console.log('firstValueFrom():', value); // 1
  } catch (err) {
    console.error('Error:', err);
  }
}

// lastValueFrom - Get last value
async function exampleLastValueFrom() {
  try {
    const value = await lastValueFrom(
      of(1, 2, 3, 4, 5)
    );
    console.log('lastValueFrom():', value); // 5
  } catch (err) {
    console.error('Error:', err);
  }
}

// With timeout
async function exampleWithTimeout() {
  try {
    const value = await firstValueFrom(
      interval(1000).pipe(
        take(5),
        timeout(500) // Will timeout
      )
    );
    console.log('Value:', value);
  } catch (err) {
    console.error('Timeout error:', err);
  }
}

// ============================================================================
// 2. Converting Promise to Observable
// ============================================================================
/**
 * Converting Promises to Observables using from().
 */

console.log('\n=== Promise to Observable ===');

// Simple Promise
const promise = Promise.resolve('Hello from Promise');
const observable$ = from(promise);

observable$.subscribe({
  next: value => console.log('from(Promise):', value),
  error: err => console.error('Error:', err),
  complete: () => console.log('Completed')
});

// Promise that rejects
const rejectingPromise = Promise.reject(new Error('Promise rejected'));
const errorObservable$ = from(rejectingPromise).pipe(
  catchError(err => {
    console.error('Caught error:', err.message);
    return of('Fallback value');
  })
);

errorObservable$.subscribe(value => console.log('Error handled:', value));

// ============================================================================
// 3. Using Async/Await with Observables
// ============================================================================
/**
 * Using async/await with Observables for sequential processing.
 */

console.log('\n=== Async/Await with Observables ===');

async function processSequentially() {
  try {
    // Process first Observable
    const result1 = await firstValueFrom(
      timer(100).pipe(mapTo('Result 1'))
    );
    console.log('Step 1:', result1);

    // Process second Observable
    const result2 = await firstValueFrom(
      timer(100).pipe(mapTo('Result 2'))
    );
    console.log('Step 2:', result2);

    // Process third Observable
    const result3 = await firstValueFrom(
      timer(100).pipe(mapTo('Result 3'))
    );
    console.log('Step 3:', result3);

    return [result1, result2, result3];
  } catch (err) {
    console.error('Error in sequential processing:', err);
    throw err;
  }
}

// Note: mapTo needs to be imported
import { mapTo } from 'rxjs/operators';

// ============================================================================
// 4. Combining Promises and Observables
// ============================================================================
/**
 * Combining Promises and Observables in the same code.
 */

console.log('\n=== Combining Promises and Observables ===');

async function combinePromiseAndObservable() {
  // Start with a Promise
  const promiseResult = await Promise.resolve('Promise result');

  // Convert to Observable and process
  const observableResult = await firstValueFrom(
    of(promiseResult).pipe(
      map(value => `Processed: ${value}`)
    )
  );

  console.log('Combined result:', observableResult);
}

// Observable that uses Promise
function observableWithPromise(): Observable<string> {
  return from(
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json())
      .then(data => data.title)
  ).pipe(
    catchError(err => {
      console.error('Fetch error:', err);
      return of('Default title');
    })
  );
}

// ============================================================================
// 5. Error Handling with Async/Await
// ============================================================================
/**
 * Error handling when using async/await with Observables.
 */

console.log('\n=== Error Handling with Async/Await ===');

async function errorHandlingExample() {
  try {
    const value = await firstValueFrom(
      throwError(() => new Error('Observable error'))
    );
    console.log('Value:', value);
  } catch (err) {
    console.error('Caught error:', err.message);
  }
}

// With retry
async function errorHandlingWithRetry() {
  try {
    const value = await firstValueFrom(
      throwError(() => new Error('Temporary error')).pipe(
        retry(3)
      )
    );
    console.log('Value:', value);
  } catch (err) {
    console.error('Failed after retries:', err.message);
  }
}

// ============================================================================
// 6. Practical Examples
// ============================================================================

/**
 * Example: HTTP request with async/await
 */
async function fetchData(url: string): Promise<any> {
  try {
    const response = await firstValueFrom(
      from(fetch(url)).pipe(
        timeout(5000),
        map(response => response.json()),
        retry(3),
        catchError(err => {
          console.error('Fetch failed:', err);
          throw err;
        })
      )
    );
    return response;
  } catch (err) {
    console.error('Failed to fetch data:', err);
    throw err;
  }
}

/**
 * Example: Sequential API calls
 */
async function sequentialApiCalls(urls: string[]): Promise<any[]> {
  const results: any[] = [];

  for (const url of urls) {
    try {
      const data = await firstValueFrom(
        from(fetch(url)).pipe(
          map(response => response.json()),
          timeout(5000)
        )
      );
      results.push(data);
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
      results.push(null);
    }
  }

  return results;
}

/**
 * Example: Parallel API calls with Observable
 */
function parallelApiCalls(urls: string[]): Observable<any[]> {
  const requests = urls.map(url =>
    from(fetch(url)).pipe(
      map(response => response.json()),
      catchError(err => {
        console.error(`Error fetching ${url}:`, err);
        return of(null);
      })
    )
  );

  return from(Promise.all(requests.map(req => firstValueFrom(req))));
}

/**
 * Example: Observable with Promise-based processing
 */
function observableWithPromiseProcessing<T, R>(
  source: Observable<T>,
  processor: (value: T) => Promise<R>
): Observable<R> {
  return source.pipe(
    mergeMap(value =>
      from(processor(value)).pipe(
        catchError(err => {
          console.error('Processing error:', err);
          return throwError(() => err);
        })
      )
    )
  );
}

// Note: mergeMap needs to be imported
import { mergeMap } from 'rxjs/operators';

/**
 * Example: Async function that returns Observable
 */
function createObservableFromAsync<T>(
  asyncFn: () => Promise<T>
): Observable<T> {
  return from(asyncFn()).pipe(
    catchError(err => {
      console.error('Async function error:', err);
      return throwError(() => err);
    })
  );
}

// Usage
async function exampleAsyncFunction(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return 'Async result';
}

const observableFromAsync = createObservableFromAsync(exampleAsyncFunction);
observableFromAsync.subscribe({
  next: value => console.log('From async function:', value),
  error: err => console.error('Error:', err)
});

/**
 * Example: Using Observable in async function
 */
async function useObservableInAsync() {
  // Create Observable
  const data$ = interval(100).pipe(
    take(5),
    map(i => `Data ${i}`)
  );

  // Convert to array using toArray and await
  const data = await firstValueFrom(
    data$.pipe(toArray())
  );

  console.log('All data:', data);
  return data;
}

// Note: toArray needs to be imported
import { toArray } from 'rxjs/operators';

// Export for use in other files
export {
  exampleFirstValueFrom,
  exampleLastValueFrom,
  exampleWithTimeout,
  processSequentially,
  combinePromiseAndObservable,
  errorHandlingExample,
  errorHandlingWithRetry,
  fetchData,
  sequentialApiCalls,
  parallelApiCalls,
  observableWithPromiseProcessing,
  createObservableFromAsync,
  useObservableInAsync
};

