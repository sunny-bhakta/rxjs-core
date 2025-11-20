# Multicasting

## Overview

Multicasting allows multiple subscribers to share a single Observable execution. This is essential for performance and preventing duplicate work.

## Cold vs Hot Observables

### Cold Observable

Each subscription triggers a new execution.

```typescript
const cold$ = new Observable(observer => {
  const random = Math.random();
  console.log('Execution:', random);
  observer.next(random);
});

cold$.subscribe(); // Execution: 0.123
cold$.subscribe(); // Execution: 0.456 (different)
```

### Hot Observable

Shares execution among multiple subscribers.

```typescript
const subject = new Subject();
subject.next(Math.random());
// All subscribers receive the same value
```

## share()

Automatically multicasts using a Subject.

**Use Case**: Simple multicasting, sharing HTTP requests

```typescript
import { interval } from 'rxjs';
import { share, take, tap } from 'rxjs/operators';

const shared$ = interval(1000).pipe(
  take(5),
  tap(x => console.log('Execution:', x)),
  share()
);

shared$.subscribe(); // Execution: 0
shared$.subscribe(); // Shares execution
```

**Characteristics**:
- Automatically connects/disconnects
- Uses Subject internally
- Completes when all subscribers unsubscribe

## shareReplay()

Shares and replays the last N values to new subscribers.

**Use Case**: Caching, late subscribers

```typescript
import { interval } from 'rxjs';
import { shareReplay, take, tap } from 'rxjs/operators';

const shared$ = interval(1000).pipe(
  take(5),
  tap(x => console.log('Execution:', x)),
  shareReplay(2) // Replay last 2 values
);

// Subscribe after values emitted
setTimeout(() => {
  shared$.subscribe(); // Gets last 2 values
}, 3000);
```

**Characteristics**:
- Replays specified number of values
- New subscribers get historical values
- Useful for caching

## multicast()

Uses a Subject to multicast manually.

**Use Case**: Manual control over connection

```typescript
import { interval, Subject } from 'rxjs';
import { multicast, take, tap } from 'rxjs/operators';

const source$ = interval(1000).pipe(
  take(5),
  tap(x => console.log('Execution:', x))
);

const multicasted$ = source$.pipe(
  multicast(() => new Subject())
);

// Subscribers won't receive values until connect()
multicasted$.subscribe();
multicasted$.subscribe();

const connection = multicasted$.connect(); // Start execution

// Later
connection.unsubscribe(); // Stop execution
```

## publish()

Creates a ConnectableObservable (equivalent to multicast with Subject).

```typescript
import { interval } from 'rxjs';
import { publish, take } from 'rxjs/operators';

const published$ = interval(1000).pipe(
  take(5),
  publish()
);

published$.subscribe();
const connection = published$.connect();
```

## refCount()

Automatically connects/disconnects based on subscribers.

**Use Case**: Automatic connection management

```typescript
import { interval } from 'rxjs';
import { publish, refCount, take } from 'rxjs/operators';

const refCounted$ = interval(1000).pipe(
  take(5),
  publish(),
  refCount() // Auto connect/disconnect
);

// First subscriber triggers connection
refCounted$.subscribe();

// Second subscriber (connection already active)
refCounted$.subscribe();

// When all unsubscribe, automatically disconnects
```

## Best Practices

1. **Use `share()` for simple multicasting** - Automatic and easy
2. **Use `shareReplay()` for caching** - Replay values to late subscribers
3. **Use `multicast()` for manual control** - When you need fine control
4. **Use `refCount()` for automatic management** - Best of both worlds
5. **Understand cold vs hot** - Choose the right strategy

## Common Patterns

### Pattern 1: Shared HTTP Request

```typescript
const data$ = fromFetch('/api/data').pipe(
  switchMap(r => r.json()),
  shareReplay(1) // Cache and share
);

// Multiple components can subscribe
data$.subscribe(...);
data$.subscribe(...); // Shares the same request
```

### Pattern 2: Shared Configuration

```typescript
const config$ = fromFetch('/api/config').pipe(
  switchMap(r => r.json()),
  shareReplay(1)
);
```

## Related Concepts

- [Subjects](./06-subjects.md)
- [Core Concepts](./01-core-concepts.md)
- [Memory Management](./16-memory-management.md)

