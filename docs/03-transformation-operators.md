# Transformation Operators

## Overview

Transformation operators modify the values emitted by Observables. They're some of the most commonly used operators in RxJS.

## Basic Transformation

### map()

Transforms each emitted value by applying a projection function.

**Use Case**: Transforming values, extracting properties

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => x * 2)
).subscribe(console.log);
// Output: 2, 4, 6
```

**Characteristics**:
- One-to-one transformation
- Synchronous
- Pure function (no side effects)

### mapTo()

Maps each value to a constant value.

**Use Case**: Replacing values with constants

```typescript
import { of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

of(1, 2, 3).pipe(
  mapTo('Hello')
).subscribe(console.log);
// Output: 'Hello', 'Hello', 'Hello'
```

### pluck()

Extracts a property from each value. **Note**: Deprecated in RxJS 8+, use `map()` instead.

**Use Case**: Extracting object properties

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of({ name: 'Alice', age: 30 }).pipe(
  map(user => user.name) // Use map instead of pluck
).subscribe(console.log);
```

## Accumulation

### scan()

Accumulates values over time, emitting each intermediate result.

**Use Case**: Running totals, state accumulation

```typescript
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  scan((acc, value) => acc + value, 0)
).subscribe(console.log);
// Output: 1, 3, 6, 10, 15
```

**Characteristics**:
- Emits intermediate results
- Maintains state across emissions
- Similar to `reduce()` but emits each step

### reduce()

Reduces values to a single value when the Observable completes.

**Use Case**: Final aggregation, calculating totals

```typescript
import { of } from 'rxjs';
import { reduce } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  reduce((acc, value) => acc + value, 0)
).subscribe(console.log);
// Output: 15 (only when completes)
```

**Characteristics**:
- Emits only final result
- Waits for completion
- Similar to `scan()` but emits once

## Buffering

### buffer()

Collects values into arrays until a closing Observable emits.

**Use Case**: Batching values, grouping emissions

```typescript
import { interval, timer } from 'rxjs';
import { buffer, take } from 'rxjs/operators';

interval(100).pipe(
  take(10),
  buffer(timer(500))
).subscribe(console.log);
// Output: [0, 1, 2, 3, 4] (after 500ms)
```

### bufferCount()

Buffers a specific number of values.

**Use Case**: Fixed-size batches

```typescript
import { of } from 'rxjs';
import { bufferCount } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe(
  bufferCount(3)
).subscribe(console.log);
// Output: [1, 2, 3], [4, 5, 6], [7, 8, 9]
```

### bufferTime()

Buffers values for a specific time period.

**Use Case**: Time-based batching

```typescript
import { interval } from 'rxjs';
import { bufferTime, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  bufferTime(500)
).subscribe(console.log);
// Output: Arrays every 500ms
```

## Windowing

### window()

Splits the Observable into windows (nested Observables).

**Use Case**: Grouping values into windows

```typescript
import { interval, timer } from 'rxjs';
import { window, take } from 'rxjs/operators';

interval(100).pipe(
  take(10),
  window(timer(500))
).subscribe(window$ => {
  window$.subscribe(value => console.log('Window value:', value));
});
```

### windowCount()

Splits into windows of a specific count.

**Use Case**: Fixed-size windows

```typescript
import { of } from 'rxjs';
import { windowCount } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6).pipe(
  windowCount(3)
).subscribe(window$ => {
  window$.subscribe(console.log);
});
```

### windowTime()

Splits into windows of a specific time period.

**Use Case**: Time-based windows

```typescript
import { interval } from 'rxjs';
import { windowTime, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  windowTime(500)
).subscribe(window$ => {
  window$.subscribe(console.log);
});
```

## Pairwise Operations

### pairwise()

Emits pairs of consecutive values.

**Use Case**: Comparing consecutive values, calculating differences

```typescript
import { of } from 'rxjs';
import { pairwise } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  pairwise()
).subscribe(console.log);
// Output: [1, 2], [2, 3], [3, 4], [4, 5]
```

## Recursive Expansion

### expand()

Recursively projects each value to an Observable.

**Use Case**: Recursive operations, tree traversal

```typescript
import { of, EMPTY } from 'rxjs';
import { expand, take } from 'rxjs/operators';

of(1).pipe(
  expand(x => x < 100 ? of(x * 2) : EMPTY),
  take(10)
).subscribe(console.log);
// Output: 1, 2, 4, 8, 16, 32, 64, 128...
```

## Higher-Order Transformation

### mergeMap() / flatMap()

Maps to inner Observables and merges them concurrently.

**Use Case**: Concurrent operations, parallel processing

```typescript
import { of } from 'rxjs';
import { mergeMap, interval, take } from 'rxjs/operators';

of(1, 2, 3).pipe(
  mergeMap(x => interval(100).pipe(
    take(3),
    map(i => `${x}-${i}`)
  ))
).subscribe(console.log);
// All inner Observables run concurrently
```

### switchMap()

Maps to inner Observables and switches to the latest one.

**Use Case**: Search, autocomplete, canceling previous requests

```typescript
import { of } from 'rxjs';
import { switchMap, timer } from 'rxjs/operators';

of(1, 2, 3).pipe(
  switchMap(x => timer(1000).pipe(mapTo(`Result ${x}`)))
).subscribe(console.log);
// Cancels previous when new value arrives
```

### concatMap()

Maps to inner Observables and concatenates them sequentially.

**Use Case**: Sequential operations, ordered processing

```typescript
import { of } from 'rxjs';
import { concatMap, timer } from 'rxjs/operators';

of(1, 2, 3).pipe(
  concatMap(x => timer(1000).pipe(mapTo(`Result ${x}`)))
).subscribe(console.log);
// Processes one after another
```

### exhaustMap()

Maps to inner Observables and ignores new ones until current completes.

**Use Case**: Preventing double-clicks, ignoring rapid emissions

```typescript
import { of } from 'rxjs';
import { exhaustMap, timer } from 'rxjs/operators';

of(1, 2, 3).pipe(
  exhaustMap(x => timer(2000).pipe(mapTo(`Processed ${x}`)))
).subscribe(console.log);
// Ignores new values until current completes
```

## Best Practices

1. **Use `map()` for simple transformations** - Most common operator
2. **Use `scan()` for running calculations** - When you need intermediate results
3. **Use `reduce()` for final aggregation** - When you only need the final result
4. **Use `switchMap()` for search/autocomplete** - Cancels previous requests
5. **Use `concatMap()` for sequential operations** - Maintains order
6. **Use `mergeMap()` for parallel operations** - When order doesn't matter
7. **Use `exhaustMap()` to prevent rapid triggers** - Like double-clicks

## Common Patterns

### Pattern 1: API Request Transformation

```typescript
import { fromFetch } from 'rxjs/fetch';
import { switchMap } from 'rxjs/operators';

searchTerms$.pipe(
  switchMap(term => fromFetch(`/api/search?q=${term}`))
).subscribe(results => console.log(results));
```

### Pattern 2: Running Total

```typescript
import { scan } from 'rxjs/operators';

purchases$.pipe(
  scan((total, purchase) => total + purchase.amount, 0)
).subscribe(total => console.log('Total:', total));
```

### Pattern 3: Batch Processing

```typescript
import { bufferCount } from 'rxjs/operators';

dataStream$.pipe(
  bufferCount(10)
).subscribe(batch => processBatch(batch));
```

## Related Concepts

- [Filtering Operators](./04-filtering-operators.md)
- [Higher-Order Observables](./09-higher-order-observables.md)
- [Operator Composition](./20-operator-composition-patterns.md)

