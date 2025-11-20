# Schedulers

## Overview

Schedulers control when a subscription starts and when notifications are delivered. They provide execution context for Observables.

## Scheduler Types

### asyncScheduler

Schedules on the async queue (uses setTimeout).

**Use Case**: Async execution, delays

```typescript
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(console.log);
// Executes asynchronously
```

### asapScheduler

Schedules on the microtask queue (uses Promise).

**Use Case**: High-priority async tasks

```typescript
import { of, asapScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

of(1, 2, 3).pipe(
  observeOn(asapScheduler)
).subscribe(console.log);
// Executes in microtask queue
```

### queueScheduler

Schedules synchronously in a queue.

**Use Case**: Synchronous execution

```typescript
import { of, queueScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

of(1, 2, 3).pipe(
  observeOn(queueScheduler)
).subscribe(console.log);
// Executes synchronously
```

### animationFrameScheduler

Schedules on requestAnimationFrame.

**Use Case**: Smooth animations, UI updates

```typescript
import { of, animationFrameScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

of(1, 2, 3).pipe(
  observeOn(animationFrameScheduler)
).subscribe(console.log);
// Executes on next animation frame
```

## observeOn()

Controls when notifications are delivered.

```typescript
import { observeOn, asyncScheduler } from 'rxjs/operators';

source$.pipe(
  observeOn(asyncScheduler)
).subscribe(console.log);
```

## subscribeOn()

Controls when subscription starts.

```typescript
import { subscribeOn, asyncScheduler } from 'rxjs/operators';

source$.pipe(
  subscribeOn(asyncScheduler)
).subscribe(console.log);
```

## Scheduler Comparison

| Scheduler | Execution | Use Case |
|-----------|-----------|----------|
| `queueScheduler` | Synchronous | Immediate execution |
| `asapScheduler` | Microtask | High priority async |
| `asyncScheduler` | Async | General async tasks |
| `animationFrameScheduler` | Animation frame | Smooth animations |

## Best Practices

1. **Use default scheduler when possible** - Most operators have sensible defaults
2. **Use `observeOn()` for delivery timing** - Control when values are delivered
3. **Use `subscribeOn()` for subscription timing** - Control when subscription starts
4. **Use `animationFrameScheduler` for UI** - Smooth animations

## Related Concepts

- [Core Concepts](./01-core-concepts.md)
- [Utility Operators](./10-utility-operators.md)
- [Testing RxJS](./17-testing-rxjs.md)

