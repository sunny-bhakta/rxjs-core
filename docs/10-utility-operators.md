# Utility Operators

## Overview

Utility operators provide side effects, timing control, and utility functions for Observables. They're essential for debugging, timing, and resource management.

## Side Effects

### tap()

Performs side effects without modifying the stream.

**Use Case**: Logging, debugging, side effects

```typescript
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  tap(value => console.log('Before map:', value)),
  map(x => x * 2),
  tap(value => console.log('After map:', value))
).subscribe();
```

**Characteristics**:
- Doesn't modify the stream
- Useful for debugging
- Can access all three callbacks (next, error, complete)

## Timing Control

### delay()

Delays each emission by a specified amount of time.

**Use Case**: Delaying emissions, time-shifting

```typescript
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

of(1, 2, 3).pipe(
  delay(1000)
).subscribe(console.log);
// Each value delayed by 1 second
```

### delayWhen()

Delays based on another Observable.

**Use Case**: Dynamic delays

```typescript
import { of, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

of(1, 2, 3).pipe(
  delayWhen(value => timer(value * 1000))
).subscribe(console.log);
// Each value delayed by its own amount
```

## Timeout

### timeout()

Errors if no value is emitted within the specified time.

**Use Case**: Request timeouts, preventing hanging

```typescript
import { interval } from 'rxjs';
import { timeout, take } from 'rxjs/operators';

interval(500).pipe(
  take(3),
  timeout(1000)
).subscribe({
  next: console.log,
  error: err => console.error('Timeout:', err)
});
```

### timeoutWith()

Switches to another Observable on timeout.

**Use Case**: Fallback on timeout

```typescript
import { timer, of } from 'rxjs';
import { timeoutWith } from 'rxjs/operators';

timer(2000).pipe(
  timeoutWith(1000, of('Timeout fallback'))
).subscribe(console.log);
```

## Repetition

### repeat()

Repeats the Observable a specified number of times.

**Use Case**: Retrying, repeating operations

```typescript
import { of } from 'rxjs';
import { repeat } from 'rxjs/operators';

of(1, 2, 3).pipe(
  repeat(2)
).subscribe(console.log);
// Output: 1, 2, 3, 1, 2, 3
```

## Cleanup

### finalize()

Executes a callback when the Observable terminates.

**Use Case**: Cleanup, logging completion

```typescript
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';

of(1, 2, 3).pipe(
  finalize(() => console.log('Cleanup executed'))
).subscribe(console.log);
// Always executes, even on error
```

## Conversion

### toArray()

Collects all values into an array when the Observable completes.

**Use Case**: Collecting all values, batch processing

```typescript
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  toArray()
).subscribe(console.log);
// Output: [1, 2, 3, 4, 5]
```

### firstValueFrom() / lastValueFrom()

Converts Observable to Promise (modern approach).

**Use Case**: Using Observables with async/await

```typescript
import { of, firstValueFrom, lastValueFrom } from 'rxjs';

// Get first value
const first = await firstValueFrom(of(1, 2, 3));
console.log(first); // 1

// Get last value
const last = await lastValueFrom(of(1, 2, 3));
console.log(last); // 3
```

## Scheduler Control

### observeOn()

Specifies a scheduler for notifications.

**Use Case**: Controlling when values are delivered

```typescript
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(console.log);
// Values delivered asynchronously
```

### subscribeOn()

Specifies a scheduler for subscription.

**Use Case**: Controlling when subscription starts

```typescript
import { of, asapScheduler } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

of(1, 2, 3).pipe(
  subscribeOn(asapScheduler)
).subscribe(console.log);
```

## Best Practices

1. **Use `tap()` for debugging** - Don't modify the stream
2. **Use `delay()` for timing** - Simple time-shifting
3. **Use `timeout()` for requests** - Prevent hanging
4. **Use `finalize()` for cleanup** - Always executes
5. **Use `toArray()` for collection** - When you need all values
6. **Use `firstValueFrom()`/`lastValueFrom()`** - Modern Promise conversion

## Common Patterns

### Pattern 1: Request with Timeout

```typescript
httpRequest$.pipe(
  timeout(5000),
  catchError(err => {
    if (err.name === 'TimeoutError') {
      return of({ error: 'Request timeout' });
    }
    throw err;
  })
).subscribe(console.log);
```

### Pattern 2: Cleanup with finalize

```typescript
resource$.pipe(
  finalize(() => {
    cleanup();
    console.log('Resource cleaned up');
  })
).subscribe(console.log);
```

### Pattern 3: Debugging with tap

```typescript
data$.pipe(
  tap(value => console.log('Received:', value)),
  map(transform),
  tap(value => console.log('Transformed:', value)),
  catchError(err => {
    console.error('Error:', err);
    throw err;
  })
).subscribe(console.log);
```

## Related Concepts

- [Schedulers](./11-schedulers.md)
- [Error Handling](./07-error-handling.md)
- [Memory Management](./16-memory-management.md)

