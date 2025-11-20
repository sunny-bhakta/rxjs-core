# Combination Operators

## Overview

Combination operators combine multiple Observables into a single Observable. They're essential for working with multiple data sources.

## Combining Latest Values

### combineLatest()

Combines the latest values from multiple Observables.

**Use Case**: Combining form values, multiple data sources

```typescript
import { combineLatest, interval } from 'rxjs';
import { take } from 'rxjs/operators';

const source1 = interval(1000).pipe(take(5));
const source2 = interval(1500).pipe(take(5));

combineLatest([source1, source2]).subscribe(
  ([val1, val2]) => console.log([val1, val2])
);
```

**Characteristics**:
- Emits when any source emits
- Uses latest value from each source
- Waits for all sources to emit at least once

## Merging Observables

### merge()

Merges multiple Observables into one, emitting values as they arrive.

**Use Case**: Combining multiple event streams

```typescript
import { merge, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

const obs1 = interval(1000).pipe(map(x => `A${x}`), take(3));
const obs2 = interval(1200).pipe(map(x => `B${x}`), take(3));

merge(obs1, obs2).subscribe(console.log);
// Output: A0, B0, A1, B1, A2, B2 (interleaved)
```

**Characteristics**:
- Concurrent execution
- Values arrive as they're emitted
- Order not guaranteed

## Concatenating Observables

### concat()

Concatenates Observables sequentially, one after another.

**Use Case**: Sequential operations, ordered processing

```typescript
import { concat, of } from 'rxjs';

const first = of(1, 2, 3);
const second = of(4, 5, 6);

concat(first, second).subscribe(console.log);
// Output: 1, 2, 3, 4, 5, 6
```

**Characteristics**:
- Sequential execution
- Waits for first to complete
- Maintains order

## Zipping Observables

### zip()

Combines values by index from multiple Observables.

**Use Case**: Pairing related values

```typescript
import { zip, of } from 'rxjs';

const letters = of('A', 'B', 'C');
const numbers = of(1, 2, 3);

zip(letters, numbers).subscribe(
  ([letter, number]) => console.log(`${letter}${number}`)
);
// Output: A1, B2, C3
```

**Characteristics**:
- Combines by index
- Waits for all sources
- Emits when all have values at same index

## Combining with Latest

### withLatestFrom()

Combines source Observable with latest value from another Observable.

**Use Case**: Enriching data with latest context

```typescript
import { interval, of } from 'rxjs';
import { withLatestFrom, take } from 'rxjs/operators';

const source = interval(1000).pipe(take(5));
const latest = of('Context');

source.pipe(
  withLatestFrom(latest)
).subscribe(([sourceVal, latestVal]) => 
  console.log([sourceVal, latestVal])
);
```

**Characteristics**:
- Only source triggers emission
- Uses latest value from other Observable
- Waits for other Observable to emit

## Racing Observables

### race()

Emits from the first Observable to emit.

**Use Case**: Timeout patterns, fastest response

```typescript
import { race, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const fast = timer(100).pipe(mapTo('Fast'));
const slow = timer(200).pipe(mapTo('Slow'));

race(fast, slow).subscribe(console.log);
// Output: 'Fast'
```

## Adding Values

### startWith()

Emits a value before the Observable starts.

**Use Case**: Initial values, default states

```typescript
import { of } from 'rxjs';
import { startWith } from 'rxjs/operators';

of(1, 2, 3).pipe(
  startWith(0)
).subscribe(console.log);
// Output: 0, 1, 2, 3
```

### endWith()

Emits a value when the Observable completes.

**Use Case**: Final values, cleanup signals

```typescript
import { of } from 'rxjs';
import { endWith } from 'rxjs/operators';

of(1, 2, 3).pipe(
  endWith(4, 5)
).subscribe(console.log);
// Output: 1, 2, 3, 4, 5
```

## Waiting for All

### forkJoin()

Waits for all Observables to complete and emits their last values.

**Use Case**: Parallel API calls, loading multiple resources

```typescript
import { forkJoin, of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const request1 = timer(100).pipe(mapTo('Response 1'));
const request2 = timer(200).pipe(mapTo('Response 2'));
const request3 = timer(150).pipe(mapTo('Response 3'));

forkJoin([request1, request2, request3]).subscribe(
  responses => console.log(responses)
);
// Output: ['Response 1', 'Response 2', 'Response 3']
```

**Characteristics**:
- Waits for all to complete
- Emits last values from each
- Fails if any fails

## Best Practices

1. **Use `combineLatest()` for form values** - React to any change
2. **Use `merge()` for event streams** - When order doesn't matter
3. **Use `concat()` for sequential operations** - When order matters
4. **Use `forkJoin()` for parallel requests** - When you need all results
5. **Use `race()` for timeout patterns** - Fastest response wins
6. **Use `withLatestFrom()` for enrichment** - Add context to events

## Common Patterns

### Pattern 1: Form Values

```typescript
import { combineLatest } from 'rxjs';

combineLatest([firstName$, lastName$, email$]).pipe(
  map(([first, last, email]) => ({ first, last, email }))
).subscribe(formData => validateForm(formData));
```

### Pattern 2: Parallel Requests

```typescript
import { forkJoin } from 'rxjs';

forkJoin({
  users: fetchUsers(),
  posts: fetchPosts(),
  comments: fetchComments()
}).subscribe(data => {
  // All data loaded
});
```

### Pattern 3: Search with Filters

```typescript
import { combineLatest } from 'rxjs';

combineLatest([searchTerm$, category$, sortBy$]).pipe(
  map(([term, category, sort]) => ({ term, category, sort }))
).subscribe(params => performSearch(params));
```

## Related Concepts

- [Transformation Operators](./03-transformation-operators.md)
- [Higher-Order Observables](./09-higher-order-observables.md)
- [Error Handling](./07-error-handling.md)

