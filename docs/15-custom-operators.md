# Custom Operators

## Overview

Creating custom operators allows you to encapsulate reusable logic and create domain-specific transformations. Custom operators are functions that return OperatorFunctions.

## Basic Custom Operator

A custom operator is a function that returns an `OperatorFunction`.

```typescript
import { Observable, OperatorFunction } from 'rxjs';

function multiplyBy(factor: number): OperatorFunction<number, number> {
  return (source: Observable<number>) => {
    return new Observable(observer => {
      return source.subscribe({
        next: value => observer.next(value * factor),
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  };
}

// Usage
of(1, 2, 3).pipe(multiplyBy(10)).subscribe(console.log);
```

## Composing Existing Operators

The easiest way to create custom operators is to compose existing ones.

```typescript
import { filter, map } from 'rxjs/operators';

function filterAndMap<T, R>(
  predicate: (value: T) => boolean,
  mapper: (value: T) => R
): OperatorFunction<T, R> {
  return (source: Observable<T>) => {
    return source.pipe(
      filter(predicate),
      map(mapper)
    );
  };
}
```

## Custom Operator with Side Effects

```typescript
import { tap } from 'rxjs/operators';

function log<T>(label: string = 'Value'): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      tap({
        next: value => console.log(`${label}:`, value),
        error: err => console.error(`${label} error:`, err),
        complete: () => console.log(`${label}: completed`)
      })
    );
  };
}
```

## Stateful Custom Operators

Custom operators can maintain state across emissions.

```typescript
function runningAverage(): OperatorFunction<number, number> {
  return (source: Observable<number>) => {
    return new Observable(observer => {
      let sum = 0;
      let count = 0;

      return source.subscribe({
        next: value => {
          sum += value;
          count++;
          observer.next(sum / count);
        },
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  };
}
```

## Custom Operator with Error Handling

```typescript
import { retry, catchError } from 'rxjs/operators';

function retryWithBackoff<T>(
  maxRetries: number = 3,
  initialDelay: number = 1000
): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          const delay = initialDelay * Math.pow(2, retryCount - 1);
          return timer(delay);
        }
      }),
      catchError(err => {
        console.error('Max retries exceeded:', err);
        throw err;
      })
    );
  };
}
```

## Best Practices

1. **Compose existing operators** - Easier and more maintainable
2. **Keep operators pure** - Avoid side effects when possible
3. **Use proper types** - TypeScript OperatorFunction
4. **Document your operators** - Explain purpose and usage
5. **Test thoroughly** - Custom operators need testing
6. **Handle errors** - Don't forget error handling

## Common Patterns

### Pattern 1: Domain-Specific Operator

```typescript
function validateEmail(): OperatorFunction<string, string> {
  return (source: Observable<string>) => {
    return source.pipe(
      filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
      distinctUntilChanged()
    );
  };
}
```

### Pattern 2: Reusable Pipeline

```typescript
function apiRequestPipeline<T>(): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      timeout(5000),
      retry(3),
      catchError(err => {
        console.error('Request failed:', err);
        throw err;
      })
    );
  };
}
```

### Pattern 3: Conditional Operator

```typescript
function conditionalMap<T, R>(
  condition: (value: T) => boolean,
  trueMapper: (value: T) => R,
  falseMapper: (value: T) => R
): OperatorFunction<T, R> {
  return (source: Observable<T>) => {
    return source.pipe(
      map(value => condition(value) ? trueMapper(value) : falseMapper(value))
    );
  };
}
```

## Related Concepts

- [Transformation Operators](./03-transformation-operators.md)
- [Operator Composition Patterns](./20-operator-composition-patterns.md)
- [Error Handling](./07-error-handling.md)

