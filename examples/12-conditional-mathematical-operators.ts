/**
 * Conditional and Mathematical Operators Examples
 * 
 * This file demonstrates:
 * - defaultIfEmpty()
 * - every()
 * - isEmpty()
 * - sequenceEqual()
 * - count()
 * - max()
 * - min()
 */

import {
  of,
  EMPTY,
  interval,
  Observable
} from 'rxjs';
import {
  defaultIfEmpty,
  every,
  isEmpty,
  sequenceEqual,
  count,
  max,
  min,
  take,
  map,
  toArray
} from 'rxjs/operators';

// ============================================================================
// 1. defaultIfEmpty() - Emit default if empty
// ============================================================================
/**
 * defaultIfEmpty(): Emits a given value if the source Observable completes
 * without emitting any next value, otherwise mirrors the source Observable.
 */

console.log('=== defaultIfEmpty() Examples ===');

// Empty Observable with default
EMPTY.pipe(
  defaultIfEmpty('No values')
).subscribe(value => console.log('defaultIfEmpty(empty):', value));

// Non-empty Observable (no default used)
of(1, 2, 3).pipe(
  defaultIfEmpty('No values')
).subscribe(value => console.log('defaultIfEmpty(non-empty):', value));

// ============================================================================
// 2. every() - Check if all values match predicate
// ============================================================================
/**
 * every(): Returns an Observable that emits whether or not every item of the
 * source Observable satisfies the condition specified.
 */

console.log('\n=== every() Examples ===');

// All values are even
of(2, 4, 6, 8).pipe(
  every(x => x % 2 === 0)
).subscribe(result => console.log('every(even):', result));

// Not all values are even
of(2, 4, 5, 8).pipe(
  every(x => x % 2 === 0)
).subscribe(result => console.log('every(not all even):', result));

// All values are positive
of(1, 2, 3, 4, 5).pipe(
  every(x => x > 0)
).subscribe(result => console.log('every(positive):', result));

// ============================================================================
// 3. isEmpty() - Check if Observable is empty
// ============================================================================
/**
 * isEmpty(): Emits false if the source Observable emits any values,
 * or true if the source Observable completes without emitting any values.
 */

console.log('\n=== isEmpty() Examples ===');

// Empty Observable
EMPTY.pipe(
  isEmpty()
).subscribe(result => console.log('isEmpty(empty):', result));

// Non-empty Observable
of(1, 2, 3).pipe(
  isEmpty()
).subscribe(result => console.log('isEmpty(non-empty):', result));

// ============================================================================
// 4. sequenceEqual() - Compare two Observables
// ============================================================================
/**
 * sequenceEqual(): Compares all values of two Observables in sequence.
 * Returns true if sequences are equal, false otherwise.
 */

console.log('\n=== sequenceEqual() Examples ===');

const obs1 = of(1, 2, 3);
const obs2 = of(1, 2, 3);
const obs3 = of(1, 2, 4);

// Equal sequences
obs1.pipe(
  sequenceEqual(obs2)
).subscribe(result => console.log('sequenceEqual(equal):', result));

// Different sequences
obs1.pipe(
  sequenceEqual(obs3)
).subscribe(result => console.log('sequenceEqual(different):', result));

// ============================================================================
// 5. count() - Count emissions
// ============================================================================
/**
 * count(): Counts the number of emissions on the source and emits that number
 * when the source completes.
 */

console.log('\n=== count() Examples ===');

// Count all values
of(1, 2, 3, 4, 5).pipe(
  count()
).subscribe(count => console.log('count(all):', count));

// Count values matching predicate
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  count(x => x % 2 === 0)
).subscribe(count => console.log('count(even):', count));

// Count from interval
interval(100).pipe(
  take(10),
  count()
).subscribe(count => console.log('count(interval):', count));

// ============================================================================
// 6. max() - Find maximum value
// ============================================================================
/**
 * max(): The Max operator operates on an Observable that emits numbers
 * (or items that can be compared with a provided function), and when source
 * Observable completes it emits a single item: the item with the largest value.
 */

console.log('\n=== max() Examples ===');

// Find maximum number
of(5, 2, 8, 1, 9, 3).pipe(
  max()
).subscribe(maxValue => console.log('max(numbers):', maxValue));

// Find maximum with comparator
of(
  { value: 5 },
  { value: 2 },
  { value: 8 },
  { value: 1 }
).pipe(
  max((a, b) => a.value - b.value)
).subscribe(maxObj => console.log('max(objects):', maxObj));

// ============================================================================
// 7. min() - Find minimum value
// ============================================================================
/**
 * min(): The Min operator operates on an Observable that emits numbers
 * (or items that can be compared with a provided function), and when source
 * Observable completes it emits a single item: the item with the smallest value.
 */

console.log('\n=== min() Examples ===');

// Find minimum number
of(5, 2, 8, 1, 9, 3).pipe(
  min()
).subscribe(minValue => console.log('min(numbers):', minValue));

// Find minimum with comparator
of(
  { value: 5 },
  { value: 2 },
  { value: 8 },
  { value: 1 }
).pipe(
  min((a, b) => a.value - b.value)
).subscribe(minObj => console.log('min(objects):', minObj));

// ============================================================================
// 8. Practical Examples
// ============================================================================

/**
 * Example: Validate all items
 */
function validateAll<T>(
  source: Observable<T>,
  validator: (value: T) => boolean
): Observable<boolean> {
  return source.pipe(
    every(validator)
  );
}

/**
 * Example: Check if data exists
 */
function hasData<T>(source: Observable<T>): Observable<boolean> {
  return source.pipe(
    isEmpty(),
    map(isEmpty => !isEmpty)
  );
}

/**
 * Example: Get statistics
 */
function getStatistics(source: Observable<number>): Observable<{
  count: number;
  max: number;
  min: number;
}> {
  return source.pipe(
    toArray(),
    map(array => ({
      count: array.length,
      max: Math.max(...array),
      min: Math.min(...array)
    }))
  );
}

// Export for use in other files
export {
  validateAll,
  hasData,
  getStatistics
};

