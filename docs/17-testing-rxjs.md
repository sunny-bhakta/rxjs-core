# Testing RxJS

## Overview

Testing RxJS Observables requires special tools and techniques. The TestScheduler and marble testing make it possible to test time-based and complex Observable streams.

## TestScheduler

TestScheduler is a virtual time scheduler for testing Observables.

**Use Case**: Testing time-based operators, complex streams

```typescript
import { TestScheduler } from 'rxjs/testing';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});
```

## Marble Testing Syntax

Marble diagrams visually represent Observable streams.

### Syntax

- `-` : 10 frames (time unit)
- `a`, `b`, `c` : values
- `|` : completion
- `#` : error
- `^` : subscription point
- `!` : unsubscription point

### Examples

- `-a-b-c|` : emits a, b, c, then completes
- `--a--b--c|` : emits a after 20ms, b after 40ms, c after 60ms
- `-a-b-#` : emits a, b, then errors
- `^--a--b!` : subscribes, emits a after 20ms, b after 40ms, unsubscribes

## Testing Simple Observables

```typescript
testScheduler.run(({ expectObservable }) => {
  const source$ = of(1, 2, 3);
  const expected = '(abc|)';

  expectObservable(source$).toBe(expected, {
    a: 1,
    b: 2,
    c: 3
  });
});
```

## Testing Time-Based Operators

```typescript
testScheduler.run(({ cold, expectObservable }) => {
  const source$ = cold('a-b-c-d-e-f|', {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6
  });

  const result$ = source$.pipe(debounceTime(20));

  const expected = '------(f|)';

  expectObservable(result$).toBe(expected, {
    f: 6
  });
});
```

## Testing Operators

```typescript
testScheduler.run(({ cold, expectObservable }) => {
  const source$ = cold('a-b-c|', { a: 1, b: 2, c: 3 });
  const result$ = source$.pipe(map(x => x * 2));
  const expected = 'a-b-c|';

  expectObservable(result$).toBe(expected, {
    a: 2,
    b: 4,
    c: 6
  });
});
```

## Testing Error Scenarios

```typescript
testScheduler.run(({ cold, expectObservable }) => {
  const source$ = cold('a-b-#', { a: 1, b: 2 }, new Error('Test error'));
  const result$ = source$.pipe(
    catchError(err => of('Error handled'))
  );
  const expected = 'a-b-(c|)';

  expectObservable(result$).toBe(expected, {
    a: 1,
    b: 2,
    c: 'Error handled'
  });
});
```

## Testing Hot Observables

```typescript
testScheduler.run(({ hot, expectObservable }) => {
  const hot$ = hot('--a--b--c|', { a: 1, b: 2, c: 3 });
  const subscription = '^------!';
  const expected = '------b--';

  expectObservable(hot$, subscription).toBe(expected, {
    b: 2
  });
});
```

## Best Practices

1. **Use TestScheduler for time-based operators** - Virtual time
2. **Use marble diagrams** - Visual representation
3. **Test error scenarios** - Important edge cases
4. **Test subscription timing** - Hot vs cold
5. **Test operator composition** - Complex chains
6. **Use cold() for cold Observables** - Independent execution
7. **Use hot() for hot Observables** - Shared execution

## Common Patterns

### Pattern 1: Testing Search

```typescript
testScheduler.run(({ cold, expectObservable }) => {
  const searchTerms$ = cold('a-b-c|', {
    a: 'react',
    b: 'rxjs',
    c: 'typescript'
  });

  const result$ = searchTerms$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => of(`Results for ${term}`))
  );

  const expected = '--a---b---c|';

  expectObservable(result$).toBe(expected, {
    a: 'Results for react',
    b: 'Results for rxjs',
    c: 'Results for typescript'
  });
});
```

### Pattern 2: Testing Retry Logic

```typescript
testScheduler.run(({ cold, expectObservable }) => {
  const source$ = cold('-#', {}, new Error('Retry'));
  const result$ = source$.pipe(retry(3));

  const expected = '-#-#-#-#';

  expectObservable(result$).toBe(expected);
});
```

## Related Concepts

- [Schedulers](./11-schedulers.md)
- [Error Handling](./07-error-handling.md)
- [Utility Operators](./10-utility-operators.md)

