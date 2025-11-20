# Operator Composition Patterns

## Overview

Operator composition is the art of combining multiple operators to create powerful, reusable transformations. This guide covers patterns and best practices for composing operators.

## Basic Pipe Composition

The `pipe()` function is used to compose operators.

```typescript
import { of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  filter(x => x % 2 === 0),
  map(x => x * 10),
  tap(x => console.log('Processed:', x))
).subscribe();
```

## Reusable Operator Chains

Create reusable operator chains as functions.

```typescript
function processNumbers(): OperatorFunction<number, number> {
  return (source: Observable<number>) => {
    return source.pipe(
      filter(x => x > 0),
      map(x => x * 2),
      distinctUntilChanged()
    );
  };
}

// Usage
of(1, 2, 3, -1, 4, 5).pipe(
  processNumbers()
).subscribe(console.log);
```

## Conditional Composition

Conditionally apply operators based on runtime conditions.

```typescript
function conditionalComposition<T>(
  source: Observable<T>,
  enableLogging: boolean,
  enableRetry: boolean
): Observable<T> {
  let result$ = source;

  if (enableLogging) {
    result$ = result$.pipe(tap(value => console.log(value)));
  }

  if (enableRetry) {
    result$ = result$.pipe(retry(3));
  }

  return result$;
}
```

## Dynamic Composition

Dynamically compose operators based on configuration.

```typescript
interface OperatorConfig {
  debounce?: number;
  distinct?: boolean;
  retry?: number;
}

function dynamicComposition<T>(config: OperatorConfig) {
  return (source: Observable<T>) => {
    let result$ = source;

    if (config.debounce) {
      result$ = result$.pipe(debounceTime(config.debounce));
    }

    if (config.distinct) {
      result$ = result$.pipe(distinctUntilChanged());
    }

    if (config.retry) {
      result$ = result$.pipe(retry(config.retry));
    }

    return result$;
  };
}
```

## Common Composition Patterns

### Pattern 1: Request Pipeline

```typescript
function createRequestPipeline<T>(): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      tap(request => console.log('Request:', request)),
      timeout(5000),
      retry(3),
      catchError(err => {
        console.error('Request failed:', err);
        throw err;
      }),
      finalize(() => console.log('Request completed'))
    );
  };
}
```

### Pattern 2: Search Pipeline

```typescript
function createSearchPipeline(): OperatorFunction<string, any[]> {
  return (source: Observable<string>) => {
    return source.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length > 2),
      switchMap(term => fromFetch(`/api/search?q=${term}`)),
      switchMap(response => response.json()),
      catchError(err => {
        console.error('Search failed:', err);
        return of([]);
      })
    );
  };
}
```

### Pattern 3: Form Validation Pipeline

```typescript
function createFormValidationPipeline<T extends Record<string, any>>(
  validators: Record<keyof T, (value: any) => boolean>
): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      ),
      map(form => {
        const errors: string[] = [];
        for (const [key, validator] of Object.entries(validators)) {
          if (!validator(form[key])) {
            errors.push(`Invalid ${key}`);
          }
        }
        if (errors.length > 0) {
          throw new Error(errors.join(', '));
        }
        return form;
      }),
      catchError(err => {
        console.error('Validation error:', err);
        throw err;
      })
    );
  };
}
```

## Best Practices

1. **Compose existing operators** - Don't reinvent the wheel
2. **Keep operators pure** - Avoid side effects when possible
3. **Use proper types** - TypeScript OperatorFunction
4. **Create reusable chains** - DRY principle
5. **Handle errors** - Don't forget error handling
6. **Document your compositions** - Explain purpose
7. **Test thoroughly** - Complex compositions need testing

## Composition Strategies

### Strategy 1: Sequential Composition

Operators applied in sequence, each transforming the result.

```typescript
source$.pipe(
  filter(...),
  map(...),
  reduce(...)
);
```

### Strategy 2: Conditional Composition

Operators applied conditionally based on logic.

```typescript
source$.pipe(
  ...(condition ? [operator1()] : []),
  ...(anotherCondition ? [operator2()] : [])
);
```

### Strategy 3: Parallel Composition

Multiple streams processed in parallel, then combined.

```typescript
combineLatest([
  source1$.pipe(...),
  source2$.pipe(...),
  source3$.pipe(...)
]);
```

## Related Concepts

- [Custom Operators](./15-custom-operators.md)
- [Transformation Operators](./03-transformation-operators.md)
- [Combination Operators](./05-combination-operators.md)

