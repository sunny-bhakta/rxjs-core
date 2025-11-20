# HTTP & WebSocket Operators

## Overview

RxJS provides operators for working with HTTP requests and WebSocket connections, making it easy to integrate network operations into reactive streams.

## AJAX Requests

### ajax()

Creates an Observable from an AJAX request.

**Use Case**: HTTP requests, API calls

```typescript
import { ajax } from 'rxjs/ajax';

// GET request
ajax.getJSON('https://api.example.com/data')
  .subscribe(data => console.log(data));

// POST request
ajax({
  url: 'https://api.example.com/data',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { name: 'John' }
}).subscribe(response => console.log(response.response));
```

**Characteristics**:
- Works with XMLHttpRequest
- Supports all HTTP methods
- Automatic JSON parsing with `getJSON()`

## Fetch API

### fromFetch()

Creates an Observable from a fetch request.

**Use Case**: Modern fetch API integration

```typescript
import { fromFetch } from 'rxjs/fetch';

fromFetch('https://api.example.com/data', {
  selector: response => response.json()
}).subscribe(data => console.log(data));
```

**Characteristics**:
- Uses modern Fetch API
- Can specify selector for response handling
- Better error handling

## WebSocket

### webSocket()

Creates a WebSocket Subject.

**Use Case**: Real-time communication, WebSocket connections

```typescript
import { webSocket } from 'rxjs/webSocket';

const ws$ = webSocket('ws://localhost:8080');

// Send message
ws$.next({ type: 'message', data: 'Hello' });

// Receive messages
ws$.subscribe({
  next: msg => console.log('Message:', msg),
  error: err => console.error('Error:', err),
  complete: () => console.log('Connection closed')
});

// Close connection
ws$.complete();
```

**Characteristics**:
- Bidirectional communication
- Can send and receive
- Automatic reconnection support

## Event Patterns

### fromEventPattern()

Creates an Observable from event handler functions.

**Use Case**: Custom event APIs, Node.js EventEmitter

```typescript
import { fromEventPattern } from 'rxjs';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

const event$ = fromEventPattern(
  (handler) => emitter.on('data', handler),
  (handler) => emitter.off('data', handler)
);

event$.subscribe(data => console.log('Event:', data));
```

## Observable to Promise

### firstValueFrom()

Converts Observable to Promise, resolving with first value.

**Use Case**: Using Observables with async/await

```typescript
import { firstValueFrom, interval } from 'rxjs';
import { take } from 'rxjs/operators';

async function example() {
  const value = await firstValueFrom(
    interval(1000).pipe(take(5))
  );
  console.log('First value:', value);
}
```

### lastValueFrom()

Converts Observable to Promise, resolving with last value.

**Use Case**: Getting final result

```typescript
import { lastValueFrom, of } from 'rxjs';

async function example() {
  const value = await lastValueFrom(of(1, 2, 3, 4, 5));
  console.log('Last value:', value); // 5
}
```

## Best Practices

1. **Use `ajax()` for simple requests** - Easy to use
2. **Use `fromFetch()` for modern code** - Fetch API integration
3. **Use `webSocket()` for real-time** - WebSocket connections
4. **Use `firstValueFrom()`/`lastValueFrom()`** - Modern Promise conversion
5. **Handle errors appropriately** - Network requests can fail
6. **Use retry for transient errors** - Network issues

## Common Patterns

### Pattern 1: HTTP Request with Retry

```typescript
import { ajax } from 'rxjs/ajax';
import { retry, timeout, catchError } from 'rxjs/operators';

ajax.getJSON('/api/data').pipe(
  timeout(5000),
  retry(3),
  catchError(err => {
    console.error('Request failed:', err);
    return of([]);
  })
).subscribe(data => console.log(data));
```

### Pattern 2: WebSocket with Reconnection

```typescript
import { webSocket } from 'rxjs/webSocket';
import { retry, retryWhen, delay } from 'rxjs/operators';

const ws$ = webSocket({
  url: 'ws://localhost:8080',
  openObserver: {
    next: () => console.log('Connected')
  },
  closeObserver: {
    next: () => console.log('Disconnected')
  }
}).pipe(
  retryWhen(errors => errors.pipe(delay(1000)))
);

ws$.subscribe(msg => console.log('Message:', msg));
```

### Pattern 3: Multiple API Calls

```typescript
import { forkJoin } from 'rxjs';
import { ajax } from 'rxjs/ajax';

forkJoin({
  users: ajax.getJSON('/api/users'),
  posts: ajax.getJSON('/api/posts'),
  comments: ajax.getJSON('/api/comments')
}).subscribe(data => {
  console.log('All data loaded:', data);
});
```

## Related Concepts

- [Error Handling](./07-error-handling.md)
- [Combination Operators](./05-combination-operators.md)
- [RxJS with Promises & Async/Await](./19-rxjs-with-promises-async.md)

