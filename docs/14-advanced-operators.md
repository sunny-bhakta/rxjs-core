# Advanced Operators

## Overview

Advanced operators provide sophisticated control over Observable streams, including dynamic buffering, advanced time-based operations, and error recovery.

## Dynamic Buffering

### bufferWhen()

Collects values into arrays based on a closing Observable.

**Use Case**: Dynamic batching, conditional grouping

```typescript
import { interval, timer } from 'rxjs';
import { bufferWhen, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  bufferWhen(() => timer(500)) // Close buffer every 500ms
).subscribe(buffer => console.log('Buffer:', buffer));
```

**Characteristics**:
- Dynamic closing condition
- Factory function for closing Observable
- Flexible buffering strategy

## Advanced Windowing

### windowTime()

Splits Observable into time-based windows.

**Use Case**: Time-based grouping, periodic analysis

```typescript
import { interval } from 'rxjs';
import { windowTime, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  windowTime(500) // New window every 500ms
).subscribe(window$ => {
  window$.subscribe(value => console.log('Window value:', value));
});
```

## Advanced Time Control

### audit()

Ignores values for a duration after each emission, then emits latest.

**Use Case**: Sampling with delay, reducing rapid emissions

```typescript
import { interval } from 'rxjs';
import { audit, timer, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  audit(() => timer(500)) // Ignore for 500ms, then emit latest
).subscribe(value => console.log('Audited:', value));
```

### debounce()

Emits after period of silence determined by an Observable.

**Use Case**: Dynamic debouncing, value-based delays

```typescript
import { interval } from 'rxjs';
import { debounce, timer, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  debounce(() => timer(300)) // Emit after 300ms of silence
).subscribe(value => console.log('Debounced:', value));
```

### throttle()

Emits first value, then ignores for duration determined by Observable.

**Use Case**: Dynamic throttling, adaptive rate limiting

```typescript
import { interval } from 'rxjs';
import { throttle, timer, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  throttle(() => timer(500)) // Emit first, ignore for 500ms
).subscribe(value => console.log('Throttled:', value));
```

### sample()

Samples the latest value when a notifier Observable emits.

**Use Case**: Periodic sampling, event-based sampling

```typescript
import { interval } from 'rxjs';
import { sample, timer, take } from 'rxjs/operators';

interval(100).pipe(
  take(20),
  sample(timer(0, 500)) // Sample every 500ms
).subscribe(value => console.log('Sampled:', value));
```

## Error Recovery

### onErrorResumeNext()

Continues with another Observable on error.

**Use Case**: Error recovery chains, fallback strategies

```typescript
import { throwError, of } from 'rxjs';
import { onErrorResumeNext } from 'rxjs/operators';

throwError(() => new Error('Error')).pipe(
  onErrorResumeNext(of('Fallback value'))
).subscribe(value => console.log(value));
// Output: 'Fallback value'
```

**Characteristics**:
- Continues execution
- Switches to fallback Observable
- Doesn't propagate error

## Best Practices

1. **Use `bufferWhen()` for dynamic batching** - Flexible grouping
2. **Use `windowTime()` for time-based analysis** - Periodic windows
3. **Use `audit()` for delayed sampling** - Reduce rapid emissions
4. **Use `debounce()` for dynamic delays** - Value-based debouncing
5. **Use `throttle()` for adaptive rate limiting** - Dynamic throttling
6. **Use `sample()` for periodic sampling** - Regular intervals
7. **Use `onErrorResumeNext()` for graceful degradation** - Error recovery

## Common Patterns

### Pattern 1: Dynamic Debouncing

```typescript
searchTerms$.pipe(
  debounce(term => timer(term.length * 100)) // Longer terms = longer debounce
).subscribe(term => performSearch(term));
```

### Pattern 2: Adaptive Throttling

```typescript
events$.pipe(
  throttle(event => timer(getThrottleTime(event)))
).subscribe(event => handleEvent(event));
```

### Pattern 3: Error Recovery Chain

```typescript
primarySource$.pipe(
  onErrorResumeNext(
    fallbackSource1$,
    fallbackSource2$,
    defaultSource$
  )
).subscribe(data => processData(data));
```

## Related Concepts

- [Filtering Operators](./04-filtering-operators.md)
- [Error Handling](./07-error-handling.md)
- [Backpressure Handling](./18-backpressure-handling.md)

