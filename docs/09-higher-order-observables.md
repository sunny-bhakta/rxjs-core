# Higher-Order Observables

## Overview

Higher-order Observables are Observables that emit Observables. Operators like `mergeMap`, `switchMap`, `concatMap`, and `exhaustMap` flatten these nested Observables into a single stream.

## Understanding Higher-Order Observables

A higher-order Observable emits Observables instead of values:

```typescript
const higherOrder$ = of(
  of(1, 2, 3),
  of(4, 5, 6),
  of(7, 8, 9)
);
// This emits Observables, not numbers
```

We need to "flatten" these to get the values.

## mergeMap() / flatMap()

Maps to inner Observables and merges them concurrently.

**Use Case**: Concurrent operations, parallel processing

```typescript
import { of, interval } from 'rxjs';
import { mergeMap, take, map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  mergeMap(x => interval(100).pipe(
    take(3),
    map(i => `${x}-${i}`)
  ))
).subscribe(console.log);
// All inner Observables run concurrently
```

**Characteristics**:
- Concurrent execution
- All inner Observables run simultaneously
- Order not guaranteed

## switchMap()

Maps to inner Observables and switches to the latest one, canceling previous.

**Use Case**: Search, autocomplete, canceling previous requests

```typescript
import { of, timer } from 'rxjs';
import { switchMap, mapTo } from 'rxjs/operators';

of(1, 2, 3).pipe(
  switchMap(x => timer(1000).pipe(mapTo(`Result ${x}`)))
).subscribe(console.log);
// Cancels previous when new value arrives
```

**Characteristics**:
- Cancels previous inner Observable
- Only latest inner Observable runs
- Perfect for search/autocomplete

## concatMap()

Maps to inner Observables and concatenates them sequentially.

**Use Case**: Sequential operations, ordered processing

```typescript
import { of, timer } from 'rxjs';
import { concatMap, mapTo } from 'rxjs/operators';

of(1, 2, 3).pipe(
  concatMap(x => timer(1000).pipe(mapTo(`Result ${x}`)))
).subscribe(console.log);
// Processes one after another
```

**Characteristics**:
- Sequential execution
- Waits for each to complete
- Maintains order

## exhaustMap()

Maps to inner Observables and ignores new ones until current completes.

**Use Case**: Preventing double-clicks, ignoring rapid emissions

```typescript
import { of, timer } from 'rxjs';
import { exhaustMap, mapTo } from 'rxjs/operators';

of(1, 2, 3).pipe(
  exhaustMap(x => timer(2000).pipe(mapTo(`Processed ${x}`)))
).subscribe(console.log);
// Ignores new values until current completes
```

**Characteristics**:
- Ignores new emissions
- Waits for current to complete
- Prevents rapid triggers

## Flattening Strategies Comparison

| Operator | Strategy | Use Case |
|----------|----------|----------|
| `mergeMap` | Concurrent | Parallel operations |
| `switchMap` | Cancel previous | Search, autocomplete |
| `concatMap` | Sequential | Ordered processing |
| `exhaustMap` | Ignore new | Prevent double-clicks |

## Best Practices

1. **Use `switchMap()` for search** - Cancel previous searches
2. **Use `mergeMap()` for parallel requests** - When order doesn't matter
3. **Use `concatMap()` for sequential operations** - When order matters
4. **Use `exhaustMap()` to prevent rapid triggers** - Like form submissions
5. **Understand the difference** - Each has specific use cases

## Common Patterns

### Pattern 1: Search with switchMap

```typescript
searchTerms$.pipe(
  switchMap(term => 
    from(fetch(`/api/search?q=${term}`).then(r => r.json()))
  )
).subscribe(results => console.log(results));
```

### Pattern 2: Sequential File Uploads

```typescript
files$.pipe(
  concatMap(file => uploadFile(file))
).subscribe(result => console.log('Uploaded:', result));
```

### Pattern 3: Prevent Double-Submit

```typescript
clicks$.pipe(
  exhaustMap(() => submitForm())
).subscribe(result => console.log('Submitted:', result));
```

## Related Concepts

- [Transformation Operators](./03-transformation-operators.md)
- [Filtering Operators](./04-filtering-operators.md)
- [Error Handling](./07-error-handling.md)

