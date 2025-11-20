/**
 * Filtering Operators Examples
 * 
 * This file demonstrates filtering operators that select which values
 * to emit from an Observable:
 * - filter()
 * - take()
 * - takeLast()
 * - takeUntil()
 * - takeWhile()
 * - skip()
 * - skipLast()
 * - skipUntil()
 * - skipWhile()
 * - distinct()
 * - distinctUntilChanged()
 * - first()
 * - last()
 * - find()
 * - debounceTime()
 * - throttleTime()
 * - auditTime()
 * - sampleTime()
 */

import {
  of,
  from,
  interval,
  timer,
  range,
  Observable
} from 'rxjs';
import {
  filter,
  take,
  takeLast,
  takeUntil,
  takeWhile,
  skip,
  skipLast,
  skipUntil,
  skipWhile,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  first,
  last,
  find,
  findIndex,
  elementAt,
  ignoreElements,
  audit,
  auditTime,
  debounce,
  debounceTime,
  throttle,
  throttleTime,
  sample,
  sampleTime
} from 'rxjs/operators';

// ============================================================================
// 1. filter() - Filter values based on predicate
// ============================================================================
/**
 * filter(): Filters items emitted by the source Observable by only
 * emitting those that satisfy a specified predicate.
 */

console.log('=== filter() Examples ===');

// Filter even numbers
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  filter(x => x % 2 === 0)
).subscribe(value => console.log('filter(even):', value));

// Filter objects
const users = of(
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
  { id: 4, name: 'David', age: 20 }
);

users.pipe(
  filter(user => user.age >= 30)
).subscribe(user => console.log('filter(age >= 30):', user));

// ============================================================================
// 2. take() - Take first N values
// ============================================================================
/**
 * take(): Emits only the first count values emitted by the source Observable.
 */

console.log('\n=== take() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  take(5)
).subscribe(value => console.log('take(5):', value));

// Take from infinite Observable
interval(100).pipe(
  take(5)
).subscribe(value => console.log('take(5 from interval):', value));

// ============================================================================
// 3. takeLast() - Take last N values
// ============================================================================
/**
 * takeLast(): Emits only the last count values emitted by the source Observable.
 */

console.log('\n=== takeLast() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  takeLast(3)
).subscribe(value => console.log('takeLast(3):', value));

// ============================================================================
// 4. takeUntil() - Take until another Observable emits
// ============================================================================
/**
 * takeUntil(): Emits values from the source Observable until a notifier
 * Observable emits a value.
 */

console.log('\n=== takeUntil() Examples ===');

// Take values until timer emits
interval(100).pipe(
  takeUntil(timer(500))
).subscribe(value => console.log('takeUntil(timer):', value));

// Common pattern: take until component destroy
const componentDestroy$ = timer(1000);
interval(100).pipe(
  takeUntil(componentDestroy$)
).subscribe(value => console.log('takeUntil(componentDestroy):', value));

// ============================================================================
// 5. takeWhile() - Take while condition is true
// ============================================================================
/**
 * takeWhile(): Emits values emitted by the source Observable so long as
 * each value satisfies the given predicate.
 */

console.log('\n=== takeWhile() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  takeWhile(x => x < 6)
).subscribe(value => console.log('takeWhile(x < 6):', value));

// ============================================================================
// 6. skip() - Skip first N values
// ============================================================================
/**
 * skip(): Returns an Observable that skips the first count items emitted
 * by the source Observable.
 */

console.log('\n=== skip() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  skip(5)
).subscribe(value => console.log('skip(5):', value));

// ============================================================================
// 7. skipLast() - Skip last N values
// ============================================================================
/**
 * skipLast(): Skips the last count values emitted by the source Observable.
 */

console.log('\n=== skipLast() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  skipLast(3)
).subscribe(value => console.log('skipLast(3):', value));

// ============================================================================
// 8. skipUntil() - Skip until another Observable emits
// ============================================================================
/**
 * skipUntil(): Returns an Observable that skips items emitted by the source
 * Observable until a second Observable emits an item.
 */

console.log('\n=== skipUntil() Examples ===');

interval(100).pipe(
  take(10),
  skipUntil(timer(500))
).subscribe(value => console.log('skipUntil(timer):', value));

// ============================================================================
// 9. skipWhile() - Skip while condition is true
// ============================================================================
/**
 * skipWhile(): Returns an Observable that skips items emitted by the source
 * Observable as long as a specified condition holds true.
 */

console.log('\n=== skipWhile() Examples ===');

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  skipWhile(x => x < 5)
).subscribe(value => console.log('skipWhile(x < 5):', value));

// ============================================================================
// 10. distinct() - Emit only distinct values
// ============================================================================
/**
 * distinct(): Returns an Observable that emits all items emitted by the source
 * Observable that are distinct by comparison from previous items.
 */

console.log('\n=== distinct() Examples ===');

of(1, 2, 2, 3, 3, 3, 4, 5, 5).pipe(
  distinct()
).subscribe(value => console.log('distinct():', value));

// Distinct with key selector
of(
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
  { id: 3, name: 'Charlie' }
).pipe(
  distinct(user => user.id)
).subscribe(user => console.log('distinct(by id):', user));

// ============================================================================
// 11. distinctUntilChanged() - Emit only when value changes
// ============================================================================
/**
 * distinctUntilChanged(): Returns an Observable that emits all items emitted
 * by the source Observable that are distinct by comparison from the previous item.
 */

console.log('\n=== distinctUntilChanged() Examples ===');

of(1, 1, 2, 2, 2, 3, 3, 4, 4, 5).pipe(
  distinctUntilChanged()
).subscribe(value => console.log('distinctUntilChanged():', value));

// With custom comparison
of(
  { value: 1 },
  { value: 1 },
  { value: 2 },
  { value: 2 },
  { value: 3 }
).pipe(
  distinctUntilChanged((prev, curr) => prev.value === curr.value)
).subscribe(obj => console.log('distinctUntilChanged(custom):', obj));

// ============================================================================
// 12. distinctUntilKeyChanged() - Emit when key changes
// ============================================================================
/**
 * distinctUntilKeyChanged(): Returns an Observable that emits all items emitted
 * by the source Observable that are distinct by comparison of the specified key.
 */

console.log('\n=== distinctUntilKeyChanged() Examples ===');

of(
  { id: 1, status: 'active' },
  { id: 1, status: 'active' },
  { id: 1, status: 'inactive' },
  { id: 2, status: 'inactive' }
).pipe(
  distinctUntilKeyChanged('status')
).subscribe(obj => console.log('distinctUntilKeyChanged(status):', obj));

// ============================================================================
// 13. first() - Emit first value that matches
// ============================================================================
/**
 * first(): Emits only the first value (or the first value that meets some condition)
 * emitted by the source Observable.
 */

console.log('\n=== first() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  first()
).subscribe(value => console.log('first():', value));

// First value that matches predicate
of(1, 2, 3, 4, 5).pipe(
  first(x => x > 3)
).subscribe(value => console.log('first(x > 3):', value));

// ============================================================================
// 14. last() - Emit last value that matches
// ============================================================================
/**
 * last(): Emits only the last value (or the last value that meets some condition)
 * emitted by the source Observable.
 */

console.log('\n=== last() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  last()
).subscribe(value => console.log('last():', value));

// Last value that matches predicate
of(1, 2, 3, 4, 5).pipe(
  last(x => x < 4)
).subscribe(value => console.log('last(x < 4):', value));

// ============================================================================
// 15. find() - Find first value that matches
// ============================================================================
/**
 * find(): Emits only the first value emitted by the source Observable that
 * matches some condition.
 */

console.log('\n=== find() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  find(x => x > 3)
).subscribe(value => console.log('find(x > 3):', value));

// Find object
users.pipe(
  find(user => user.age > 30)
).subscribe(user => console.log('find(age > 30):', user));

// ============================================================================
// 16. findIndex() - Find index of first matching value
// ============================================================================
/**
 * findIndex(): Emits only the index of the first value emitted by the source
 * Observable that matches some condition.
 */

console.log('\n=== findIndex() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  findIndex(x => x > 3)
).subscribe(index => console.log('findIndex(x > 3):', index));

// ============================================================================
// 17. elementAt() - Emit value at specific index
// ============================================================================
/**
 * elementAt(): Emits only the value at the given index in a sequence of
 * emissions from the source Observable.
 */

console.log('\n=== elementAt() Examples ===');

of(10, 20, 30, 40, 50).pipe(
  elementAt(2)
).subscribe(value => console.log('elementAt(2):', value));

// ============================================================================
// 18. ignoreElements() - Ignore all values
// ============================================================================
/**
 * ignoreElements(): Ignores all items emitted by the source Observable and
 * only passes calls to complete or error.
 */

console.log('\n=== ignoreElements() Examples ===');

of(1, 2, 3, 4, 5).pipe(
  ignoreElements()
).subscribe({
  next: () => console.log('This will not be called'),
  complete: () => console.log('ignoreElements(): Completed')
});

// ============================================================================
// 19. debounceTime() - Emit after period of silence
// ============================================================================
/**
 * debounceTime(): Emits a value from the source Observable only after a
 * particular time span has passed without another source emission.
 */

console.log('\n=== debounceTime() Examples ===');

// Simulate user typing (emit only after 300ms of no typing)
const typing$ = interval(50).pipe(
  take(10),
  map(i => `Key ${i}`)
);

typing$.pipe(
  debounceTime(200)
).subscribe(value => console.log('debounceTime(200):', value));

// ============================================================================
// 20. throttleTime() - Emit first value, then ignore for duration
// ============================================================================
/**
 * throttleTime(): Emits a value from the source Observable, then ignores
 * subsequent source values for duration milliseconds.
 */

console.log('\n=== throttleTime() Examples ===');

// Throttle clicks (emit first, ignore for 1 second)
interval(100).pipe(
  take(20),
  throttleTime(500)
).subscribe(value => console.log('throttleTime(500):', value));

// ============================================================================
// 21. auditTime() - Ignore values for duration after each emission
// ============================================================================
/**
 * auditTime(): Ignores source values for duration milliseconds, then emits
 * the most recent value from the source Observable.
 */

console.log('\n=== auditTime() Examples ===');

interval(100).pipe(
  take(20),
  auditTime(500)
).subscribe(value => console.log('auditTime(500):', value));

// ============================================================================
// 22. sampleTime() - Sample latest value at intervals
// ============================================================================
/**
 * sampleTime(): Emits the most recently emitted value from the source Observable
 * at periodic time intervals.
 */

console.log('\n=== sampleTime() Examples ===');

interval(100).pipe(
  take(20),
  sampleTime(500)
).subscribe(value => console.log('sampleTime(500):', value));

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

/**
 * Example: Search input with debounce
 */
function createSearchObservable(input$: Observable<string>): Observable<string> {
  return input$.pipe(
    debounceTime(300),
    filter(term => term.length > 2),
    distinctUntilChanged()
  );
}

/**
 * Example: Prevent rapid clicks
 */
function throttleClicks(click$: Observable<Event>): Observable<Event> {
  return click$.pipe(
    throttleTime(1000)
  );
}

/**
 * Example: Get unique values
 */
function getUniqueValues<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    distinct()
  );
}

// Export for use in other files
export {
  users,
  createSearchObservable,
  throttleClicks,
  getUniqueValues
};

