# Filtering Operators

## Overview

Filtering operators select which values to emit from an Observable. They're essential for controlling the flow of data in reactive applications.

## Basic Filtering

### filter()

Filters items based on a predicate function.

**Use Case**: Selecting values that meet a condition

```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log);
// Output: 2, 4, 6, 8, 10
```

**Characteristics**:
- Synchronous filtering
- Pure function
- One-to-one or one-to-zero mapping

## Taking Values

### take()

Takes the first N values, then completes.

**Use Case**: Limiting emissions, preventing infinite streams

```typescript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000).pipe(
  take(5)
).subscribe(console.log);
// Output: 0, 1, 2, 3, 4 (then completes)
```

### takeLast()

Takes the last N values when the Observable completes.

**Use Case**: Getting final values

```typescript
import { of } from 'rxjs';
import { takeLast } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  takeLast(3)
).subscribe(console.log);
// Output: 8, 9, 10
```

### takeUntil()

Takes values until another Observable emits.

**Use Case**: Component lifecycle, cleanup patterns

```typescript
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interval(1000).pipe(
  takeUntil(timer(5000))
).subscribe(console.log);
// Stops after 5 seconds
```

### takeWhile()

Takes values while a condition is true.

**Use Case**: Conditional taking

```typescript
import { of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  takeWhile(x => x < 6)
).subscribe(console.log);
// Output: 1, 2, 3, 4, 5
```

## Skipping Values

### skip()

Skips the first N values.

**Use Case**: Ignoring initial values

```typescript
import { of } from 'rxjs';
import { skip } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  skip(5)
).subscribe(console.log);
// Output: 6, 7, 8, 9, 10
```

### skipLast()

Skips the last N values.

**Use Case**: Ignoring final values

```typescript
import { of } from 'rxjs';
import { skipLast } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  skipLast(3)
).subscribe(console.log);
// Output: 1, 2, 3, 4, 5, 6, 7
```

### skipUntil()

Skips values until another Observable emits.

**Use Case**: Waiting for a signal

```typescript
import { interval, timer } from 'rxjs';
import { skipUntil, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  skipUntil(timer(500))
).subscribe(console.log);
// Skips values until 500ms passes
```

### skipWhile()

Skips values while a condition is true.

**Use Case**: Conditional skipping

```typescript
import { of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  skipWhile(x => x < 5)
).subscribe(console.log);
// Output: 5, 6, 7, 8, 9, 10
```

## Distinct Values

### distinct()

Emits only distinct values.

**Use Case**: Removing duplicates

```typescript
import { of } from 'rxjs';
import { distinct } from 'rxjs/operators';

of(1, 2, 2, 3, 3, 3, 4, 5, 5).pipe(
  distinct()
).subscribe(console.log);
// Output: 1, 2, 3, 4, 5
```

### distinctUntilChanged()

Emits only when the value changes from the previous.

**Use Case**: Ignoring consecutive duplicates

```typescript
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

of(1, 1, 2, 2, 2, 3, 3, 4, 4, 5).pipe(
  distinctUntilChanged()
).subscribe(console.log);
// Output: 1, 2, 3, 4, 5
```

### distinctUntilKeyChanged()

Emits only when a specific key changes.

**Use Case**: Object comparison

```typescript
import { of } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';

of(
  { id: 1, status: 'active' },
  { id: 1, status: 'active' },
  { id: 1, status: 'inactive' },
  { id: 2, status: 'inactive' }
).pipe(
  distinctUntilKeyChanged('status')
).subscribe(console.log);
```

## Finding Values

### first()

Emits the first value (or first matching value).

**Use Case**: Getting the first item

```typescript
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  first()
).subscribe(console.log);
// Output: 1

of(1, 2, 3, 4, 5).pipe(
  first(x => x > 3)
).subscribe(console.log);
// Output: 4
```

### last()

Emits the last value (or last matching value).

**Use Case**: Getting the final item

```typescript
import { of } from 'rxjs';
import { last } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  last()
).subscribe(console.log);
// Output: 5
```

### find()

Finds the first value that matches a predicate.

**Use Case**: Finding a specific item

```typescript
import { of } from 'rxjs';
import { find } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  find(x => x > 3)
).subscribe(console.log);
// Output: 4
```

### findIndex()

Finds the index of the first matching value.

**Use Case**: Finding position

```typescript
import { of } from 'rxjs';
import { findIndex } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  findIndex(x => x > 3)
).subscribe(console.log);
// Output: 3
```

### elementAt()

Emits the value at a specific index.

**Use Case**: Getting value by position

```typescript
import { of } from 'rxjs';
import { elementAt } from 'rxjs/operators';

of(10, 20, 30, 40, 50).pipe(
  elementAt(2)
).subscribe(console.log);
// Output: 30
```

## Time-Based Filtering

### debounceTime()

Emits after a period of silence.

**Use Case**: Search input, preventing rapid calls

```typescript
import { interval } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

interval(50).pipe(
  take(20),
  debounceTime(300)
).subscribe(console.log);
// Only emits after 300ms of no emissions
```

### throttleTime()

Emits the first value, then ignores for a duration.

**Use Case**: Rate limiting, preventing rapid clicks

```typescript
import { interval } from 'rxjs';
import { throttleTime, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  throttleTime(500)
).subscribe(console.log);
// Emits first, then ignores for 500ms
```

### auditTime()

Ignores values for a duration after each emission, then emits latest.

**Use Case**: Sampling with delay

```typescript
import { interval } from 'rxjs';
import { auditTime, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  auditTime(500)
).subscribe(console.log);
// Ignores for 500ms, then emits latest
```

### sampleTime()

Samples the latest value at regular intervals.

**Use Case**: Periodic sampling

```typescript
import { interval } from 'rxjs';
import { sampleTime, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  sampleTime(500)
).subscribe(console.log);
// Samples every 500ms
```

## Special Cases

### ignoreElements()

Ignores all values, only emits completion/error.

**Use Case**: Waiting for completion only

```typescript
import { of } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  ignoreElements()
).subscribe({
  complete: () => console.log('Completed')
});
```

## Best Practices

1. **Use `filter()` for conditional logic** - Most common filtering
2. **Use `take()` with infinite Observables** - Prevent memory leaks
3. **Use `takeUntil()` for cleanup** - Component lifecycle pattern
4. **Use `debounceTime()` for search** - Prevent excessive API calls
5. **Use `throttleTime()` for rate limiting** - Prevent rapid actions
6. **Use `distinctUntilChanged()` for state** - Avoid unnecessary updates

## Common Patterns

### Pattern 1: Search with Debounce

```typescript
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

searchInput$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  filter(term => term.length > 2)
).subscribe(term => performSearch(term));
```

### Pattern 2: Component Cleanup

```typescript
import { takeUntil } from 'rxjs/operators';

data$.pipe(
  takeUntil(destroy$)
).subscribe(data => updateUI(data));
```

### Pattern 3: Rate Limiting

```typescript
import { throttleTime } from 'rxjs/operators';

clicks$.pipe(
  throttleTime(1000)
).subscribe(() => handleClick());
```

## Related Concepts

- [Transformation Operators](./03-transformation-operators.md)
- [Backpressure Handling](./18-backpressure-handling.md)
- [Memory Management](./16-memory-management.md)

