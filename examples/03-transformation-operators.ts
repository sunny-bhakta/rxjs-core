/**
 * Transformation Operators Examples
 * 
 * This file demonstrates transformation operators that modify
 * the values emitted by Observables:
 * - map()
 * - mapTo()
 * - pluck()
 * - scan()
 * - reduce()
 * - buffer()
 * - bufferCount()
 * - bufferTime()
 * - window()
 * - pairwise()
 * - expand()
 * - mergeMap()
 * - switchMap()
 * - concatMap()
 * - exhaustMap()
 */

import {
  of,
  from,
  interval,
  range,
  timer,
  Observable,
  EMPTY
} from 'rxjs';
import {
  map,
  mapTo,
  pluck,
  scan,
  reduce,
  buffer,
  bufferCount,
  bufferTime,
  window,
  windowCount,
  windowTime,
  pairwise,
  expand,
  mergeMap,
  switchMap,
  concatMap,
  exhaustMap,
  take,
  tap
} from 'rxjs/operators';

// ============================================================================
// 1. map() - Transform each emitted value
// ============================================================================
/**
 * map(): Applies a projection to each value and emits the projected result.
 */

console.log('=== map() Examples ===');

const numbers = of(1, 2, 3, 4, 5);

// Multiply each value by 2
numbers.pipe(
  map(x => x * 2)
).subscribe(value => console.log('map(x => x * 2):', value));

// Transform to objects
numbers.pipe(
  map(x => ({ value: x, squared: x * x }))
).subscribe(value => console.log('map(to object):', value));

// ============================================================================
// 2. mapTo() - Map each value to a constant
// ============================================================================
/**
 * mapTo(): Emits the given constant value on the output Observable
 * every time the source Observable emits a value.
 */

console.log('\n=== mapTo() Examples ===');

of(1, 2, 3).pipe(
  mapTo('Hello')
).subscribe(value => console.log('mapTo("Hello"):', value));

// ============================================================================
// 3. pluck() - Extract property from objects
// ============================================================================
/**
 * pluck(): Maps each source value to its specified nested property.
 * Note: pluck() is deprecated in RxJS 8+, use map() instead.
 */

console.log('\n=== pluck() Examples ===');

const users = of(
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 }
);

// Extract name property (deprecated, use map instead)
users.pipe(
  pluck('name')
).subscribe(value => console.log('pluck("name"):', value));

// Modern approach using map
users.pipe(
  map(user => user.name)
).subscribe(value => console.log('map(user => user.name):', value));

// ============================================================================
// 4. scan() - Accumulate values over time
// ============================================================================
/**
 * scan(): Applies an accumulator function over the source Observable,
 * and returns each intermediate result.
 */

console.log('\n=== scan() Examples ===');

// Running sum
of(1, 2, 3, 4, 5).pipe(
  scan((acc, value) => acc + value, 0)
).subscribe(value => console.log('scan(sum):', value));

// Running product
of(2, 3, 4).pipe(
  scan((acc, value) => acc * value, 1)
).subscribe(value => console.log('scan(product):', value));

// Accumulate objects
of(1, 2, 3).pipe(
  scan((acc, value) => ({ ...acc, [value]: value * 2 }), {})
).subscribe(value => console.log('scan(object):', value));

// ============================================================================
// 5. reduce() - Reduce to a single value
// ============================================================================
/**
 * reduce(): Applies an accumulator function over the source Observable,
 * and returns the accumulated result when the source completes.
 */

console.log('\n=== reduce() Examples ===');

// Sum all values
of(1, 2, 3, 4, 5).pipe(
  reduce((acc, value) => acc + value, 0)
).subscribe(value => console.log('reduce(sum):', value));

// Find maximum
of(3, 1, 4, 1, 5, 9, 2, 6).pipe(
  reduce((max, value) => value > max ? value : max, 0)
).subscribe(value => console.log('reduce(max):', value));

// ============================================================================
// 6. buffer() - Collect values into arrays
// ============================================================================
/**
 * buffer(): Collects output values until the provided Observable emits,
 * then emits that array and repeats.
 */

console.log('\n=== buffer() Examples ===');

// Buffer values until timer emits
interval(100).pipe(
  take(10),
  buffer(timer(500))
).subscribe(value => console.log('buffer(timer):', value));

// Buffer until another Observable emits
const source = interval(100).pipe(take(20));
const closer = interval(500);
source.pipe(
  buffer(closer),
  take(5)
).subscribe(value => console.log('buffer(interval):', value));

// ============================================================================
// 7. bufferCount() - Buffer specific number of values
// ============================================================================
/**
 * bufferCount(): Collects values from the past as an array, and emits
 * that array when its size reaches the specified buffer size.
 */

console.log('\n=== bufferCount() Examples ===');

// Buffer every 3 values
of(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe(
  bufferCount(3)
).subscribe(value => console.log('bufferCount(3):', value));

// Buffer every 3 values, start new buffer every 2 values (overlapping)
of(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe(
  bufferCount(3, 2)
).subscribe(value => console.log('bufferCount(3, 2):', value));

// ============================================================================
// 8. bufferTime() - Buffer for specific time period
// ============================================================================
/**
 * bufferTime(): Collects values from the past as an array, and emits
 * those arrays periodically in time.
 */

console.log('\n=== bufferTime() Examples ===');

// Buffer values every 500ms
interval(100).pipe(
  take(20),
  bufferTime(500),
  take(5)
).subscribe(value => console.log('bufferTime(500):', value));

// ============================================================================
// 9. window() - Split Observable into windows
// ============================================================================
/**
 * window(): Branch out the source Observable values as a nested Observable
 * whenever the windowBoundaries Observable emits.
 */

console.log('\n=== window() Examples ===');

// Window values until timer emits
interval(100).pipe(
  take(10),
  window(timer(500))
).subscribe(window$ => {
  console.log('New window opened');
  window$.subscribe(value => console.log('Window value:', value));
});

// ============================================================================
// 10. windowCount() - Window by count
// ============================================================================
/**
 * windowCount(): Branch out the source Observable values as a nested Observable
 * whenever the count of values reaches the specified window size.
 */

console.log('\n=== windowCount() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe(
  windowCount(3)
).subscribe(window$ => {
  window$.subscribe(value => console.log('WindowCount value:', value));
});

// ============================================================================
// 11. pairwise() - Emit pairs of consecutive values
// ============================================================================
/**
 * pairwise(): Groups pairs of consecutive emissions together.
 */

console.log('\n=== pairwise() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  pairwise()
).subscribe(pair => console.log('pairwise():', pair));

// Calculate differences
of(10, 15, 20, 25, 30).pipe(
  pairwise(),
  map(([prev, curr]) => curr - prev)
).subscribe(diff => console.log('pairwise(diff):', diff));

// ============================================================================
// 12. expand() - Recursively expand values
// ============================================================================
/**
 * expand(): Recursively projects each source value to an Observable which
 * is merged in the output Observable.
 */

console.log('\n=== expand() Examples ===');

// Expand numbers (multiply by 2 until > 100)
of(1).pipe(
  expand(x => x < 100 ? of(x * 2) : EMPTY),
  take(10)
).subscribe(value => console.log('expand():', value));

// ============================================================================
// 13. mergeMap() / flatMap() - Map and merge inner Observables
// ============================================================================
/**
 * mergeMap(): Projects each source value to an Observable which is merged
 * in the output Observable. All inner Observables run concurrently.
 */

console.log('\n=== mergeMap() Examples ===');

// Map to inner Observables and merge them
of(1, 2, 3).pipe(
  mergeMap(x => interval(100).pipe(
    take(3),
    map(i => `Value ${x}-${i}`)
  ))
).subscribe(value => console.log('mergeMap():', value));

// Fetch multiple URLs concurrently
const urls = ['url1', 'url2', 'url3'];
from(urls).pipe(
  mergeMap(url => {
    // Simulate HTTP request
    return timer(Math.random() * 1000).pipe(
      mapTo(`Response from ${url}`)
    );
  })
).subscribe(response => console.log('mergeMap(HTTP):', response));

// ============================================================================
// 14. switchMap() - Map and switch to latest inner Observable
// ============================================================================
/**
 * switchMap(): Projects each source value to an Observable which is merged
 * in the output Observable, emitting values only from the most recently
 * projected Observable.
 */

console.log('\n=== switchMap() Examples ===');

// Switch to latest inner Observable (cancels previous)
of(1, 2, 3).pipe(
  switchMap(x => interval(100).pipe(
    take(5),
    map(i => `Value ${x}-${i}`)
  ))
).subscribe(value => console.log('switchMap():', value));

// Search example: cancel previous search when new one starts
const searchTerms = ['react', 'rxjs', 'typescript'];
from(searchTerms).pipe(
  switchMap(term => {
    // Simulate search API call
    return timer(500).pipe(
      mapTo(`Results for: ${term}`)
    );
  })
).subscribe(results => console.log('switchMap(search):', results));

// ============================================================================
// 15. concatMap() - Map and concatenate inner Observables
// ============================================================================
/**
 * concatMap(): Projects each source value to an Observable which is merged
 * in the output Observable, in a serialized fashion waiting for each one
 * to complete before moving on to the next.
 */

console.log('\n=== concatMap() Examples ===');

// Concatenate inner Observables sequentially
of(1, 2, 3).pipe(
  concatMap(x => interval(100).pipe(
    take(3),
    map(i => `Value ${x}-${i}`)
  ))
).subscribe(value => console.log('concatMap():', value));

// Sequential HTTP requests
from(['user1', 'user2', 'user3']).pipe(
  concatMap(userId => {
    // Simulate sequential API calls
    return timer(200).pipe(
      mapTo(`User data for ${userId}`)
    );
  })
).subscribe(data => console.log('concatMap(HTTP):', data));

// ============================================================================
// 16. exhaustMap() - Ignore new inner Observables until current completes
// ============================================================================
/**
 * exhaustMap(): Projects each source value to an Observable which is merged
 * in the output Observable only if the previous projected Observable has completed.
 */

console.log('\n=== exhaustMap() Examples ===');

// Ignore new emissions until current completes
of(1, 2, 3).pipe(
  exhaustMap(x => interval(100).pipe(
    take(5),
    map(i => `Value ${x}-${i}`)
  ))
).subscribe(value => console.log('exhaustMap():', value));

// Prevent multiple clicks (ignore new clicks until current action completes)
from(['click1', 'click2', 'click3']).pipe(
  exhaustMap(click => {
    // Simulate long-running action
    return timer(1000).pipe(
      mapTo(`Action completed for ${click}`)
    );
  })
).subscribe(result => console.log('exhaustMap(click):', result));

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

/**
 * Example: Transform API response
 */
function transformApiResponse<T, R>(
  source: Observable<T>,
  transformer: (value: T) => R
): Observable<R> {
  return source.pipe(
    map(transformer),
    tap(value => console.log('Transformed:', value))
  );
}

/**
 * Example: Running total
 */
function runningTotal(source: Observable<number>): Observable<number> {
  return source.pipe(
    scan((acc, value) => acc + value, 0)
  );
}

/**
 * Example: Batch processing
 */
function batchProcess<T>(
  source: Observable<T>,
  batchSize: number
): Observable<T[]> {
  return source.pipe(
    bufferCount(batchSize)
  );
}

// Export for use in other files
export {
  numbers,
  users,
  transformApiResponse,
  runningTotal,
  batchProcess
};

