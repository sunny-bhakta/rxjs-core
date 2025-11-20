# Core Concepts

## Overview

RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables. Understanding the core concepts is essential for working effectively with RxJS.

## Observable

An **Observable** is the foundation of RxJS - a stream of values over time. It represents a lazy push-based collection of multiple values.

### Characteristics

- **Lazy**: Observables don't execute until subscribed
- **Push-based**: Values are pushed to subscribers
- **Multiple values**: Can emit zero or more values over time
- **Asynchronous or Synchronous**: Can work with both

### Creating an Observable

```typescript
import { Observable } from 'rxjs';

const observable = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});
```

### Key Points

- Observables are lazy - they don't execute until someone subscribes
- Each subscription creates a new execution (for cold Observables)
- Observables can emit values, errors, or completion signals

## Observer

An **Observer** is a consumer of values delivered by an Observable. It's an object with three optional callbacks:

- `next(value)`: Called when the Observable emits a value
- `error(err)`: Called when the Observable encounters an error
- `complete()`: Called when the Observable completes

### Observer Interface

```typescript
interface Observer<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}
```

### Usage

```typescript
const observer = {
  next: (value) => console.log('Received:', value),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Completed')
};

observable.subscribe(observer);
```

## Subscription

A **Subscription** represents the execution of an Observable. It's a disposable resource that can be used to cancel the execution.

### Key Features

- Represents an ongoing execution
- Has an `unsubscribe()` method to cancel execution
- Can be added to a `Subscription` collection for batch management
- Automatically cleans up when unsubscribed

### Usage

```typescript
const subscription = observable.subscribe({
  next: (value) => console.log(value)
});

// Later, unsubscribe
subscription.unsubscribe();
```

### Subscription Management

```typescript
import { Subscription } from 'rxjs';

const subscriptions = new Subscription();
subscriptions.add(sub1);
subscriptions.add(sub2);

// Unsubscribe all at once
subscriptions.unsubscribe();
```

## Producer

The **Producer** is the function passed to the Observable constructor that generates and emits values to subscribers. It's the source of values for an Observable.

### Producer Function

```typescript
const observable = new Observable((subscriber) => {
  // This is the producer function
  subscriber.next(1);
  subscriber.next(2);
  subscriber.complete();
  
  // Optional cleanup function
  return () => {
    console.log('Cleanup');
  };
});
```

### Cleanup Function

The producer can return a cleanup function that runs when:
- The Observable completes
- The Observable errors
- The subscription is unsubscribed

## Observable Lifecycle

### 1. Creation

Observables are created but not executed. They're lazy and wait for a subscription.

```typescript
const observable = new Observable(...); // Created but not executed
```

### 2. Subscription

When you subscribe, the Observable execution starts.

```typescript
observable.subscribe(...); // Execution starts
```

### 3. Execution

The producer function runs and emits values.

```typescript
// Producer function executes
subscriber.next(1);
subscriber.next(2);
```

### 4. Completion

The Observable completes successfully.

```typescript
subscriber.complete(); // Observable completes
```

### 5. Error

The Observable encounters an error.

```typescript
subscriber.error(new Error('Something went wrong')); // Observable errors
```

### 6. Unsubscription

The Observable execution is cancelled.

```typescript
subscription.unsubscribe(); // Execution stops, cleanup runs
```

## Cold vs Hot Observables

### Cold Observable

- Each subscription triggers a new execution
- Each subscriber gets its own independent execution
- Values are produced for each subscriber

```typescript
const cold$ = new Observable(observer => {
  const random = Math.random();
  observer.next(random);
});
// Each subscription gets a different random number
```

### Hot Observable

- Shares execution among multiple subscribers
- Values are produced once and shared
- Late subscribers may miss earlier values

```typescript
const subject = new Subject();
subject.next(1);
// All subscribers receive the same value
```

## Best Practices

1. **Always unsubscribe** to prevent memory leaks
2. **Use cleanup functions** for resources like intervals, timers
3. **Handle errors** appropriately in observers
4. **Understand cold vs hot** for performance optimization
5. **Use Subjects** when you need to share execution

## Common Patterns

### Pattern 1: Automatic Cleanup

```typescript
const observable = new Observable(observer => {
  const intervalId = setInterval(() => {
    observer.next(Date.now());
  }, 1000);
  
  return () => clearInterval(intervalId); // Cleanup
});
```

### Pattern 2: Error Handling

```typescript
observable.subscribe({
  next: value => console.log(value),
  error: err => console.error('Error:', err),
  complete: () => console.log('Done')
});
```

### Pattern 3: Multiple Subscriptions

```typescript
const sub1 = observable.subscribe(...);
const sub2 = observable.subscribe(...);

// Manage together
const allSubs = new Subscription();
allSubs.add(sub1);
allSubs.add(sub2);
allSubs.unsubscribe(); // Unsubscribe all
```

## Related Concepts

- [Observable Creation](./02-observable-creation.md)
- [Subjects](./06-subjects.md)
- [Memory Management](./16-memory-management.md)

