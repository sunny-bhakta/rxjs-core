# Observable Creation

## Overview

RxJS provides many ways to create Observables from different sources. Understanding these creation operators is essential for working with RxJS effectively.

## Creation Operators

### of()

Creates an Observable that emits the arguments you provide, then completes.

**Use Case**: Emitting a fixed set of values

```typescript
import { of } from 'rxjs';

of(1, 2, 3, 4, 5).subscribe(console.log);
// Output: 1, 2, 3, 4, 5
```

**Characteristics**:
- Synchronous emission
- Emits all values immediately
- Completes after emitting all values

### from()

Converts various objects and data structures into Observables.

**Use Case**: Converting arrays, promises, iterables to Observables

```typescript
import { from } from 'rxjs';

// From array
from([1, 2, 3]).subscribe(console.log);

// From Promise
from(Promise.resolve('Hello')).subscribe(console.log);

// From string (emits each character)
from('Hello').subscribe(console.log);

// From Set
from(new Set([1, 2, 3])).subscribe(console.log);
```

**Characteristics**:
- Works with arrays, promises, iterables
- Emits each element/item sequentially
- Handles promises automatically

### fromEvent()

Creates an Observable from DOM events or EventEmitter events.

**Use Case**: Converting events to Observables

```typescript
import { fromEvent } from 'rxjs';

// DOM events
const clicks$ = fromEvent(document, 'click');
clicks$.subscribe(event => console.log('Clicked!'));

// Node.js EventEmitter
import { EventEmitter } from 'events';
const emitter = new EventEmitter();
const data$ = fromEvent(emitter, 'data');
```

**Characteristics**:
- Works with DOM events and EventEmitter
- Automatically handles add/remove event listeners
- Hot Observable (shares events)

### fromEventPattern()

Creates an Observable from event handler functions.

**Use Case**: Custom event APIs that use add/remove handler pattern

```typescript
import { fromEventPattern } from 'rxjs';

const event$ = fromEventPattern(
  (handler) => customAPI.addListener(handler),
  (handler) => customAPI.removeListener(handler)
);
```

**Characteristics**:
- Flexible for custom event APIs
- Requires addHandler and removeHandler functions
- Automatically manages event listeners

### interval()

Creates an Observable that emits sequential numbers at specified intervals.

**Use Case**: Periodic emissions, timers, polling

```typescript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000).pipe(take(5)).subscribe(console.log);
// Emits: 0, 1, 2, 3, 4 (every second)
```

**Characteristics**:
- Starts at 0
- Emits at regular intervals
- Never completes (use `take()` to limit)

### timer()

Creates an Observable that emits after a delay, optionally repeating.

**Use Case**: Delayed execution, periodic tasks

```typescript
import { timer } from 'rxjs';

// Emit after 2 seconds, then complete
timer(2000).subscribe(() => console.log('2 seconds passed'));

// Emit after 1 second, then every 500ms
timer(1000, 500).subscribe(console.log);
```

**Characteristics**:
- Can emit once or repeatedly
- First parameter: initial delay
- Second parameter: interval (optional)

### range()

Creates an Observable that emits a sequence of numbers within a range.

**Use Case**: Generating number sequences

```typescript
import { range } from 'rxjs';

range(1, 5).subscribe(console.log);
// Output: 1, 2, 3, 4, 5

range(10, 3).subscribe(console.log);
// Output: 10, 11, 12
```

**Characteristics**:
- First parameter: start value
- Second parameter: count of values
- Synchronous emission

### throwError()

Creates an Observable that immediately errors.

**Use Case**: Error handling, testing error scenarios

```typescript
import { throwError } from 'rxjs';

throwError(() => new Error('Something went wrong')).subscribe({
  next: () => {}, // Never called
  error: err => console.error(err),
  complete: () => {} // Never called
});
```

**Characteristics**:
- Immediately errors
- Never emits values
- Never completes

### EMPTY

Creates an Observable that emits no items and immediately completes.

**Use Case**: Empty sequences, conditional logic

```typescript
import { EMPTY } from 'rxjs';

EMPTY.subscribe({
  next: () => {}, // Never called
  complete: () => console.log('Completed immediately')
});
```

**Characteristics**:
- Emits nothing
- Completes immediately
- Useful in conditional logic

### NEVER

Creates an Observable that never emits anything and never completes.

**Use Case**: Testing, infinite waiting

```typescript
import { NEVER } from 'rxjs';

NEVER.subscribe({
  next: () => {}, // Never called
  complete: () => {} // Never called
});
```

**Characteristics**:
- Never emits
- Never completes
- Never errors (unless unsubscribed)

### defer()

Creates an Observable lazily using an Observable factory function.

**Use Case**: Lazy evaluation, conditional creation

```typescript
import { defer, of } from 'rxjs';

const deferred$ = defer(() => {
  const random = Math.random();
  return of(random);
});

// Each subscription gets a new random number
deferred$.subscribe(console.log);
deferred$.subscribe(console.log);
```

**Characteristics**:
- Lazy creation
- Factory function called on subscription
- Each subscription gets a new Observable

### generate()

Creates an Observable by generating values based on an initial state.

**Use Case**: Complex sequences, iterative generation

```typescript
import { generate } from 'rxjs';

generate(
  1,                    // initial state
  x => x <= 5,          // condition
  x => x + 1,           // iterate
  x => x                // result selector
).subscribe(console.log);
// Output: 1, 2, 3, 4, 5
```

**Characteristics**:
- Similar to a for loop
- Flexible generation logic
- Can generate complex sequences

### iif()

Creates an Observable conditionally based on a boolean.

**Use Case**: Conditional Observable creation

```typescript
import { iif, of } from 'rxjs';

const condition = true;
const true$ = of('Condition is true');
const false$ = of('Condition is false');

iif(() => condition, true$, false$).subscribe(console.log);
```

**Characteristics**:
- Conditional creation
- Takes a condition function
- Returns one of two Observables

## HTTP & Network Creation

### ajax()

Creates an Observable from an AJAX request.

**Use Case**: HTTP requests

```typescript
import { ajax } from 'rxjs/ajax';

ajax.getJSON('https://api.example.com/data')
  .subscribe(data => console.log(data));
```

### fromFetch()

Creates an Observable from a fetch request.

**Use Case**: Modern fetch API integration

```typescript
import { fromFetch } from 'rxjs/fetch';

fromFetch('https://api.example.com/data', {
  selector: response => response.json()
}).subscribe(data => console.log(data));
```

### webSocket()

Creates a WebSocket Subject.

**Use Case**: WebSocket connections

```typescript
import { webSocket } from 'rxjs/webSocket';

const ws$ = webSocket('ws://localhost:8080');
ws$.subscribe(msg => console.log('Message:', msg));
```

## Best Practices

1. **Use `of()` for fixed values** - Simple and synchronous
2. **Use `from()` for arrays/promises** - Handles conversion automatically
3. **Use `interval()` with `take()`** - Prevents infinite streams
4. **Use `defer()` for lazy evaluation** - Better performance
5. **Use `timer()` for delays** - More flexible than setTimeout

## Common Patterns

### Pattern 1: Polling

```typescript
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interval(5000).pipe(
  switchMap(() => fetch('/api/data').then(r => r.json()))
).subscribe(data => console.log(data));
```

### Pattern 2: Conditional Creation

```typescript
import { iif, of, EMPTY } from 'rxjs';

iif(
  () => shouldLoadData,
  from(fetch('/api/data')),
  EMPTY
).subscribe(...);
```

### Pattern 3: Lazy API Calls

```typescript
import { defer } from 'rxjs';

const apiCall$ = defer(() => 
  fetch('/api/data').then(r => r.json())
);
// Only executes when subscribed
```

## Related Concepts

- [Core Concepts](./01-core-concepts.md)
- [HTTP & WebSocket Operators](./13-http-websocket-operators.md)
- [Error Handling](./07-error-handling.md)

