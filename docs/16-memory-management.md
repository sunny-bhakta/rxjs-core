# Memory Management

## Overview

Proper memory management is crucial in RxJS to prevent memory leaks. This guide covers patterns and best practices for managing subscriptions and cleaning up resources.

## The Problem

Without proper cleanup, subscriptions can cause memory leaks:

```typescript
// ❌ Memory leak - subscription never unsubscribed
interval(1000).subscribe(value => {
  // This runs forever, consuming memory
});
```

## Manual Unsubscription

Store subscriptions and unsubscribe manually.

```typescript
class Component {
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = interval(1000).subscribe(console.log);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

## Subscription Collection

Use `Subscription` collection for multiple subscriptions.

```typescript
class Component {
  private subscriptions = new Subscription();

  ngOnInit() {
    this.subscriptions.add(interval(1000).subscribe(...));
    this.subscriptions.add(interval(1500).subscribe(...));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Unsubscribes all
  }
}
```

## takeUntil Pattern

The recommended pattern for Angular components.

```typescript
class Component {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(console.log);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Benefits**:
- Automatic cleanup
- Less boilerplate
- Works with multiple subscriptions

## Operators That Auto-Complete

Some operators automatically complete, preventing leaks:

```typescript
// ✅ Automatically completes
interval(1000).pipe(
  take(5) // Completes after 5 values
).subscribe(console.log);

// ✅ Automatically completes
interval(1000).pipe(
  takeWhile(x => x < 5) // Completes when condition is false
).subscribe(console.log);
```

## Cleanup Functions

Return cleanup functions in Observable creation.

```typescript
const observable = new Observable(observer => {
  const intervalId = setInterval(() => {
    observer.next(Date.now());
  }, 1000);

  // Cleanup function
  return () => {
    clearInterval(intervalId);
  };
});
```

## finalize() Operator

Execute cleanup code regardless of completion or error.

```typescript
interval(1000).pipe(
  take(5),
  finalize(() => {
    console.log('Cleanup executed');
  })
).subscribe(console.log);
```

## Best Practices

1. **Always unsubscribe** - Prevent memory leaks
2. **Use takeUntil pattern** - Recommended for components
3. **Use operators that complete** - take(), takeWhile(), etc.
4. **Return cleanup functions** - In Observable creation
5. **Use finalize()** - For guaranteed cleanup
6. **Share expensive operations** - Use share() to prevent multiple executions

## Common Patterns

### Pattern 1: Component Lifecycle

```typescript
class AngularComponent {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.updateUI(data));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Pattern 2: Service Cleanup

```typescript
class DataService {
  private subscriptions = new Subscription();

  fetchData() {
    const sub = this.api$.subscribe(...);
    this.subscriptions.add(sub);
  }

  cleanup() {
    this.subscriptions.unsubscribe();
  }
}
```

### Pattern 3: Resource Cleanup

```typescript
function createResource() {
  return new Observable(observer => {
    const resource = allocateResource();
    observer.next(resource);

    return () => {
      deallocateResource(resource); // Cleanup
    };
  });
}
```

## Related Concepts

- [Core Concepts](./01-core-concepts.md)
- [Subjects](./06-subjects.md)
- [Utility Operators](./10-utility-operators.md)

