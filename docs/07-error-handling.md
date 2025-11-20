# Error Handling

## Overview

Error handling is crucial in reactive programming. RxJS provides several operators and patterns for handling errors gracefully.

## Error Callback

The most basic way to handle errors is using the error callback in the Observer.

```typescript
observable.subscribe({
  next: value => console.log(value),
  error: err => console.error('Error:', err),
  complete: () => console.log('Done')
});
```

## catchError()

Catches errors and handles them by returning a new Observable.

**Use Case**: Error recovery, fallback values

```typescript
import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Error on 2');
    return x;
  }),
  catchError(err => {
    console.error('Caught:', err);
    return of('Default Value');
  })
).subscribe(console.log);
```

**Patterns**:
- **Catch and Replace**: Return a default value
- **Catch and Switch**: Switch to another Observable
- **Catch and Rethrow**: Transform and rethrow error

## retry()

Retries the Observable on error.

**Use Case**: Transient errors, network retries

```typescript
import { throwError } from 'rxjs';
import { retry } from 'rxjs/operators';

let attempt = 0;
source$.pipe(
  map(x => {
    attempt++;
    if (attempt < 3) throw new Error('Retry');
    return x;
  }),
  retry(3)
).subscribe(console.log);
```

## retryWhen()

Retries based on an Observable.

**Use Case**: Exponential backoff, conditional retries

```typescript
import { timer, throwError } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';

source$.pipe(
  retryWhen(errors =>
    errors.pipe(
      mergeMap((err, i) => {
        if (i >= 3) return throwError(() => err);
        return timer(1000 * Math.pow(2, i)); // Exponential backoff
      })
    )
  )
).subscribe(console.log);
```

## throwError()

Creates an Observable that immediately errors.

**Use Case**: Error scenarios, testing

```typescript
import { throwError } from 'rxjs';

throwError(() => new Error('Something went wrong')).subscribe({
  error: err => console.error(err)
});
```

## Error Handling Patterns

### Pattern 1: Catch and Replace

```typescript
source$.pipe(
  catchError(() => of('Default Value'))
).subscribe(console.log);
```

### Pattern 2: Catch and Switch

```typescript
source$.pipe(
  catchError(() => fallback$)
).subscribe(console.log);
```

### Pattern 3: Catch and Rethrow

```typescript
source$.pipe(
  catchError(err => {
    console.error('Logged:', err);
    return throwError(() => new Error('Transformed error'));
  })
).subscribe(console.log);
```

### Pattern 4: Retry with Backoff

```typescript
source$.pipe(
  retryWhen(errors =>
    errors.pipe(
      mergeMap((err, i) => {
        if (i >= maxRetries) return throwError(() => err);
        return timer(1000 * Math.pow(2, i));
      })
    )
  )
).subscribe(console.log);
```

## Best Practices

1. **Always handle errors** - Never ignore errors
2. **Use catchError for recovery** - Graceful degradation
3. **Use retry for transient errors** - Network issues
4. **Use retryWhen for complex logic** - Exponential backoff
5. **Log errors appropriately** - Debugging and monitoring
6. **Provide fallback values** - Better user experience

## Common Patterns

### Pattern 1: HTTP Request with Retry

```typescript
httpRequest$.pipe(
  retry(3),
  catchError(err => {
    console.error('Request failed:', err);
    return of({ error: 'Request failed' });
  })
).subscribe(console.log);
```

### Pattern 2: Error Recovery Chain

```typescript
source$.pipe(
  catchError(() => fallback1$),
  catchError(() => fallback2$),
  catchError(() => of('Final fallback'))
).subscribe(console.log);
```

## Related Concepts

- [Utility Operators](./10-utility-operators.md)
- [HTTP & WebSocket Operators](./13-http-websocket-operators.md)
- [Testing RxJS](./17-testing-rxjs.md)

