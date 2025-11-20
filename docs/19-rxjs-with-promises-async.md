# RxJS with Promises & Async/Await

## Overview

RxJS can work seamlessly with Promises and async/await. This guide covers converting between Observables and Promises, and using them together.

## Observable to Promise

### firstValueFrom()

Converts Observable to Promise, resolving with first value.

**Use Case**: Using Observables with async/await

```typescript
import { firstValueFrom, of } from 'rxjs';

async function example() {
  const value = await firstValueFrom(of(1, 2, 3));
  console.log(value); // 1
}
```

### lastValueFrom()

Converts Observable to Promise, resolving with last value.

**Use Case**: Getting final result

```typescript
import { lastValueFrom, of } from 'rxjs';

async function example() {
  const value = await lastValueFrom(of(1, 2, 3, 4, 5));
  console.log(value); // 5
}
```

### With Timeout

```typescript
import { firstValueFrom, interval } from 'rxjs';
import { timeout, take } from 'rxjs/operators';

async function example() {
  try {
    const value = await firstValueFrom(
      interval(1000).pipe(
        take(5),
        timeout(500) // Will timeout
      )
    );
  } catch (err) {
    console.error('Timeout:', err);
  }
}
```

## Promise to Observable

### from()

Converts Promise to Observable.

**Use Case**: Using Promises in reactive streams

```typescript
import { from } from 'rxjs';

const promise = Promise.resolve('Hello');
const observable$ = from(promise);

observable$.subscribe(value => console.log(value));
```

### Error Handling

```typescript
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';

const rejectingPromise = Promise.reject(new Error('Failed'));

from(rejectingPromise).pipe(
  catchError(err => {
    console.error('Error:', err);
    return of('Fallback value');
  })
).subscribe(value => console.log(value));
```

## Using Async/Await with Observables

### Sequential Processing

```typescript
async function processSequentially() {
  const result1 = await firstValueFrom(timer(100).pipe(mapTo('Result 1')));
  console.log('Step 1:', result1);

  const result2 = await firstValueFrom(timer(100).pipe(mapTo('Result 2')));
  console.log('Step 2:', result2);

  return [result1, result2];
}
```

### Parallel Processing

```typescript
async function processParallel() {
  const [result1, result2, result3] = await Promise.all([
    firstValueFrom(obs1$),
    firstValueFrom(obs2$),
    firstValueFrom(obs3$)
  ]);

  return { result1, result2, result3 };
}
```

## Combining Promises and Observables

### Observable with Promise Processing

```typescript
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

data$.pipe(
  mergeMap(value => from(processAsync(value)))
).subscribe(result => console.log(result));
```

### Promise with Observable

```typescript
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  
  return from(data.items); // Convert to Observable
}
```

## Best Practices

1. **Use `firstValueFrom()` for single values** - First emission
2. **Use `lastValueFrom()` for final values** - Last emission
3. **Use `from()` for Promise integration** - Easy conversion
4. **Handle errors appropriately** - Both can throw
5. **Use async/await for sequential logic** - Cleaner code
6. **Use Observables for streams** - Multiple values over time
7. **Use Promises for single async operations** - One-time results

## Common Patterns

### Pattern 1: HTTP Request

```typescript
async function fetchData(url: string): Promise<any> {
  try {
    const data = await firstValueFrom(
      fromFetch(url).pipe(
        switchMap(response => response.json()),
        timeout(5000),
        retry(3)
      )
    );
    return data;
  } catch (err) {
    console.error('Failed:', err);
    throw err;
  }
}
```

### Pattern 2: Sequential API Calls

```typescript
async function sequentialCalls(urls: string[]): Promise<any[]> {
  const results: any[] = [];
  
  for (const url of urls) {
    try {
      const data = await firstValueFrom(
        fromFetch(url).pipe(switchMap(r => r.json()))
      );
      results.push(data);
    } catch (err) {
      results.push(null);
    }
  }
  
  return results;
}
```

### Pattern 3: Observable in Async Function

```typescript
async function useObservable() {
  const data$ = interval(100).pipe(take(5), map(i => `Data ${i}`));
  const allData = await firstValueFrom(data$.pipe(toArray()));
  return allData;
}
```

## Related Concepts

- [HTTP & WebSocket Operators](./13-http-websocket-operators.md)
- [Utility Operators](./10-utility-operators.md)
- [Error Handling](./07-error-handling.md)

