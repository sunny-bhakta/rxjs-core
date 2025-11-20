# Subjects

## Overview

Subjects are special Observables that can multicast values to multiple Observers. They're both Observables and Observers, making them powerful for imperative-to-reactive bridges.

## Subject

A basic Subject that multicasts values to multiple subscribers.

**Use Case**: Event buses, shared state

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

// Subscribe before emitting
subject.subscribe(value => console.log('Subscriber 1:', value));
subject.subscribe(value => console.log('Subscriber 2:', value));

// Emit values
subject.next(1);
subject.next(2);
subject.next(3);

// Both subscribers receive all values
```

**Characteristics**:
- Multicasts to all subscribers
- Late subscribers miss previous values
- Can be used as both Observable and Observer

## BehaviorSubject

A Subject that holds the current value and emits it to new subscribers.

**Use Case**: State management, current value tracking

```typescript
import { BehaviorSubject } from 'rxjs';

const behaviorSubject = new BehaviorSubject<number>(0); // Initial value

// Subscribe immediately
behaviorSubject.subscribe(value => console.log('Sub 1:', value));
// Output: 0 (gets initial value)

behaviorSubject.next(1);
behaviorSubject.next(2);

// Subscribe later
behaviorSubject.subscribe(value => console.log('Sub 2:', value));
// Output: 2 (gets current value)
```

**Characteristics**:
- Requires initial value
- New subscribers get current value immediately
- Always has a current value

## ReplaySubject

A Subject that replays previous values to new subscribers.

**Use Case**: Caching, late subscribers

```typescript
import { ReplaySubject } from 'rxjs';

const replaySubject = new ReplaySubject<number>(3); // Replay last 3

replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);
replaySubject.next(4);
replaySubject.next(5);

// Subscribe after values were emitted
replaySubject.subscribe(value => console.log('Late sub:', value));
// Output: 3, 4, 5 (last 3 values)
```

**Characteristics**:
- Replays specified number of values
- Can replay with time window
- New subscribers get historical values

## AsyncSubject

A Subject that emits only the last value when it completes.

**Use Case**: Final results, completion values

```typescript
import { AsyncSubject } from 'rxjs';

const asyncSubject = new AsyncSubject<number>();

asyncSubject.subscribe(value => console.log('Sub 1:', value));

asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3);

// Complete - only now subscribers receive last value (3)
asyncSubject.complete();
```

**Characteristics**:
- Emits only last value
- Only on completion
- Useful for final results

## Subject as Bridge

Subjects can bridge between imperative and reactive code.

```typescript
import { Subject } from 'rxjs';

const bridge = new Subject<number>();

// Use as Observable
bridge.subscribe(value => console.log('Received:', value));

// Use as Observer (subscribe another Observable to it)
const source$ = interval(1000);
source$.subscribe(bridge);
```

## Best Practices

1. **Use Subject for event buses** - Multicast events
2. **Use BehaviorSubject for state** - Current value tracking
3. **Use ReplaySubject for caching** - Replay previous values
4. **Use AsyncSubject for final results** - Last value on completion
5. **Always complete Subjects** - Prevent memory leaks
6. **Don't expose Subject directly** - Expose as Observable

## Common Patterns

### Pattern 1: State Management

```typescript
class StateService {
  private stateSubject = new BehaviorSubject<{ count: number }>({ count: 0 });
  public state$ = this.stateSubject.asObservable();

  getState() {
    return this.stateSubject.value;
  }

  increment() {
    const current = this.stateSubject.value;
    this.stateSubject.next({ count: current.count + 1 });
  }
}
```

### Pattern 2: Event Bus

```typescript
class EventBus {
  private eventSubject = new Subject<string>();
  public events$ = this.eventSubject.asObservable();

  emit(event: string) {
    this.eventSubject.next(event);
  }
}
```

### Pattern 3: Caching

```typescript
class DataCache<T> {
  private cacheSubject = new ReplaySubject<T>(1);
  public data$ = this.cacheSubject.asObservable();

  setData(data: T) {
    this.cacheSubject.next(data);
  }
}
```

## Related Concepts

- [Core Concepts](./01-core-concepts.md)
- [Multicasting](./08-multicasting.md)
- [Memory Management](./16-memory-management.md)

