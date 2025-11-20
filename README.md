# RxJS Core Concepts

A comprehensive guide to RxJS (Reactive Extensions for JavaScript) concepts and operators with detailed documentation and code examples.

## 📚 Documentation & Code Examples

This repository includes comprehensive documentation and working code examples:

### 📖 Documentation
- **[Documentation Index](./docs/README.md)** - Complete documentation for all RxJS concepts
- All concepts are documented in the `docs/` folder with detailed explanations, examples, and best practices

### 💻 Code Examples

All concepts include detailed code examples with documentation:

### Core Concepts
1. **[Core Concepts](./examples/01-core-concepts.ts)** - Observable, Observer, Subscription, Producer, Lifecycle
2. **[Observable Creation](./examples/02-observable-creation.ts)** - of(), from(), interval(), timer(), range(), and more

### Operators
3. **[Transformation Operators](./examples/03-transformation-operators.ts)** - map(), scan(), mergeMap(), switchMap(), concatMap(), and more
4. **[Filtering Operators](./examples/04-filtering-operators.ts)** - filter(), take(), skip(), debounceTime(), throttleTime(), and more
5. **[Combination Operators](./examples/05-combination-operators.ts)** - combineLatest(), merge(), concat(), zip(), forkJoin(), and more
6. **[Utility Operators](./examples/10-utility-operators.ts)** - tap(), delay(), timeout(), repeat(), finalize(), toArray()
7. **[Conditional & Mathematical](./examples/12-conditional-mathematical-operators.ts)** - defaultIfEmpty(), every(), isEmpty(), count(), max(), min()
8. **[Advanced Operators](./examples/14-advanced-operators.ts)** - bufferWhen(), windowTime(), audit(), debounce(), throttle(), sample(), onErrorResumeNext()

### Advanced Topics
9. **[Subjects](./examples/06-subjects.ts)** - Subject, BehaviorSubject, ReplaySubject, AsyncSubject
10. **[Error Handling](./examples/07-error-handling.ts)** - catchError(), retry(), retryWhen(), error patterns
11. **[Multicasting](./examples/08-multicasting.ts)** - share(), shareReplay(), multicast(), publish(), refCount()
12. **[Higher-Order Observables](./examples/09-higher-order-observables.ts)** - mergeMap(), switchMap(), concatMap(), exhaustMap(), and flattening strategies
13. **[Schedulers](./examples/11-schedulers.ts)** - asyncScheduler, asapScheduler, queueScheduler, observeOn(), subscribeOn()

### HTTP & WebSocket
14. **[HTTP & WebSocket Operators](./examples/13-http-websocket-operators.ts)** - ajax(), fromFetch(), webSocket(), fromEventPattern(), firstValueFrom(), lastValueFrom()

### Customization & Patterns
15. **[Custom Operators](./examples/15-custom-operators.ts)** - Creating custom operators, operator composition, reusable patterns
16. **[Operator Composition Patterns](./examples/20-operator-composition-patterns.ts)** - Pipe composition, reusable chains, conditional composition, best practices

### Production Patterns
17. **[Memory Management](./examples/16-memory-management.ts)** - Unsubscription patterns, takeUntil pattern, cleanup functions, leak prevention
18. **[Backpressure Handling](./examples/18-backpressure-handling.ts)** - Buffering, throttling, debouncing, sampling strategies
19. **[RxJS with Promises & Async/Await](./examples/19-rxjs-with-promises-async.ts)** - Converting between Observables and Promises, async/await patterns

### Testing
20. **[Testing RxJS](./examples/17-testing-rxjs.ts)** - TestScheduler, marble testing, testing operators, error scenarios

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run examples (using ts-node)
npx ts-node examples/01-core-concepts.ts
npx ts-node examples/02-observable-creation.ts
# ... and so on
```

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Observables](#observables)
3. [Operators](#operators)
4. [Subjects](#subjects)
5. [Schedulers](#schedulers)
6. [Error Handling](#error-handling)
7. [Multicasting](#multicasting)
8. [Higher-Order Observables](#higher-order-observables)

---

## Core Concepts

### Observable
- **Observable**: The foundation of RxJS - a stream of values over time
- **Observer**: An object with `next`, `error`, and `complete` methods
- **Subscription**: Represents the execution of an Observable
- **Producer**: The source of values for an Observable

### Observable Lifecycle
- **Creation**: Creating an Observable from various sources
- **Subscription**: Starting the Observable execution
- **Execution**: The Observable producing values
- **Completion**: Observable completes successfully
- **Error**: Observable encounters an error
- **Unsubscription**: Canceling the Observable execution

---

## Observables

### Creation Operators
- **`of()`**: Creates an Observable from a list of values
- **`from()`**: Creates an Observable from an array, promise, or iterable
- **`fromEvent()`**: Creates an Observable from DOM events
- **`fromEventPattern()`**: Creates an Observable from event handler functions
- **`interval()`**: Creates an Observable that emits sequential numbers at intervals
- **`timer()`**: Creates an Observable that emits after a delay
- **`range()`**: Creates an Observable that emits a range of numbers
- **`throwError()`**: Creates an Observable that immediately errors
- **`empty()`**: Creates an Observable that completes immediately
- **`never()`**: Creates an Observable that never emits or completes
- **`defer()`**: Creates an Observable lazily
- **`generate()`**: Creates an Observable by generating values
- **`iif()`**: Creates an Observable conditionally
- **`ajax()`**: Creates an Observable from an AJAX request
- **`fetch()`**: Creates an Observable from a fetch request
- **`webSocket()`**: Creates an Observable from a WebSocket connection

### Cold vs Hot Observables
- **Cold Observable**: Each subscription triggers a new execution
- **Hot Observable**: Shares execution among multiple subscribers

---

## Operators

### Transformation Operators
- **`map()`**: Transforms each emitted value
- **`mapTo()`**: Maps each value to a constant
- **`pluck()`**: Extracts a property from each value
- **`scan()`**: Accumulates values over time
- **`reduce()`**: Reduces values to a single value
- **`buffer()`**: Collects values into arrays
- **`bufferCount()`**: Buffers a specific number of values
- **`bufferTime()`**: Buffers values for a specific time period
- **`bufferWhen()`**: Buffers values based on a closing Observable
- **`window()`**: Splits the Observable into windows
- **`windowCount()`**: Splits into windows of a specific count
- **`windowTime()`**: Splits into windows of a specific time
- **`pairwise()`**: Emits pairs of consecutive values
- **`expand()`**: Recursively expands values
- **`mergeMap()` / `flatMap()`**: Maps and merges inner Observables
- **`switchMap()`**: Maps and switches to the latest inner Observable
- **`concatMap()`**: Maps and concatenates inner Observables
- **`exhaustMap()`**: Maps and ignores new inner Observables until current completes

### Filtering Operators
- **`filter()`**: Filters values based on a predicate
- **`take()`**: Takes the first N values
- **`takeLast()`**: Takes the last N values
- **`takeUntil()`**: Takes values until another Observable emits
- **`takeWhile()`**: Takes values while a condition is true
- **`skip()`**: Skips the first N values
- **`skipLast()`**: Skips the last N values
- **`skipUntil()`**: Skips values until another Observable emits
- **`skipWhile()`**: Skips values while a condition is true
- **`distinct()`**: Emits only distinct values
- **`distinctUntilChanged()`**: Emits only when the value changes
- **`distinctUntilKeyChanged()`**: Emits only when a key changes
- **`first()`**: Emits the first value that matches
- **`last()`**: Emits the last value that matches
- **`find()`**: Finds the first value that matches
- **`findIndex()`**: Finds the index of the first matching value
- **`elementAt()`**: Emits the value at a specific index
- **`ignoreElements()`**: Ignores all values, only emits completion/error
- **`audit()`**: Ignores values for a duration after each emission
- **`auditTime()`**: Ignores values for a specific time period
- **`debounce()`**: Emits after a period of silence
- **`debounceTime()`**: Emits after a specific time of silence
- **`throttle()`**: Emits the first value, then ignores for a duration
- **`throttleTime()`**: Emits the first value, then ignores for a specific time
- **`sample()`**: Samples the latest value at intervals
- **`sampleTime()`**: Samples the latest value at time intervals

### Combination Operators
- **`combineLatest()`**: Combines the latest values from multiple Observables
- **`merge()`**: Merges multiple Observables into one
- **`concat()`**: Concatenates multiple Observables sequentially
- **`zip()`**: Combines values by index
- **`withLatestFrom()`**: Combines with the latest value from another Observable
- **`race()`**: Emits from the first Observable to emit
- **`startWith()`**: Emits a value before the Observable starts
- **`endWith()`**: Emits a value when the Observable completes
- **`forkJoin()`**: Waits for all Observables to complete and emits their last values

### Utility Operators
- **`tap()`**: Performs side effects without modifying the stream
- **`delay()`**: Delays each emission
- **`delayWhen()`**: Delays based on another Observable
- **`timeout()`**: Errors if no value is emitted within a time period
- **`timeoutWith()`**: Switches to another Observable on timeout
- **`repeat()`**: Repeats the Observable a number of times
- **`retry()`**: Retries the Observable on error
- **`retryWhen()`**: Retries based on an Observable
- **`finalize()`**: Executes a callback when the Observable terminates
- **`toArray()`**: Collects all values into an array
- **`toPromise()`**: Converts an Observable to a Promise
- **`share()`**: Shares the Observable execution among subscribers
- **`shareReplay()`**: Shares and replays the last N values
- **`observeOn()`**: Specifies a scheduler for notifications
- **`subscribeOn()`**: Specifies a scheduler for subscription

### Conditional Operators
- **`defaultIfEmpty()`**: Emits a default value if the Observable is empty
- **`every()`**: Checks if all values match a predicate
- **`isEmpty()`**: Checks if the Observable is empty
- **`sequenceEqual()`**: Compares two Observables for equality

### Mathematical Operators
- **`count()`**: Counts the number of emissions
- **`max()`**: Emits the maximum value
- **`min()`**: Emits the minimum value
- **`sum()`**: Sums all numeric values (deprecated, use `reduce()`)

---

## Subjects

### Subject Types
- **`Subject`**: A multicast Observable that can emit values
- **`BehaviorSubject`**: Subject that holds the current value
- **`ReplaySubject`**: Subject that replays previous values to new subscribers
- **`AsyncSubject`**: Subject that emits only the last value on completion

### Subject Characteristics
- **Multicasting**: Shares execution among multiple subscribers
- **Imperative**: Can be used to imperatively push values
- **Bridge**: Can bridge between imperative and reactive code

---

## Schedulers

### Scheduler Types
- **`asyncScheduler`**: Schedules on the async queue (setTimeout)
- **`asapScheduler`**: Schedules on the microtask queue (Promise)
- **`queueScheduler`**: Schedules synchronously in a queue
- **`animationFrameScheduler`**: Schedules on requestAnimationFrame
- **`virtualTimeScheduler`**: Virtual time scheduler for testing

### Scheduler Usage
- **`observeOn()`**: Controls when notifications are delivered
- **`subscribeOn()`**: Controls when subscription starts
- **`delay()`**: Uses scheduler for timing
- **`throttleTime()`**: Uses scheduler for throttling
- **`debounceTime()`**: Uses scheduler for debouncing

---

## Error Handling

### Error Operators
- **`catchError()`**: Catches errors and handles them
- **`retry()`**: Retries the Observable on error
- **`retryWhen()`**: Retries based on an Observable
- **`throwError()`**: Creates an Observable that errors
- **`onErrorResumeNext()`**: Continues with another Observable on error

### Error Handling Patterns
- **Error Callback**: Handle errors in the Observer's error callback
- **Catch and Replace**: Use `catchError()` to replace the error
- **Catch and Rethrow**: Use `catchError()` to transform and rethrow
- **Catch and Switch**: Use `catchError()` to switch to another Observable
- **Retry Logic**: Use `retry()` or `retryWhen()` for retry logic

---

## Multicasting

### Multicasting Operators
- **`multicast()`**: Uses a Subject to multicast
- **`share()`**: Automatically multicasts using a Subject
- **`shareReplay()`**: Multicasts and replays the last N values
- **`publish()`**: Creates a ConnectableObservable
- **`publishBehavior()`**: Creates a ConnectableObservable with BehaviorSubject
- **`publishReplay()`**: Creates a ConnectableObservable with ReplaySubject
- **`publishLast()`**: Creates a ConnectableObservable with AsyncSubject
- **`refCount()`**: Automatically connects/disconnects based on subscribers

### Multicasting Patterns
- **Manual Connection**: Use `connect()` to manually control connection
- **Automatic Connection**: Use `refCount()` for automatic connection
- **Share Pattern**: Use `share()` for simple multicasting
- **Replay Pattern**: Use `shareReplay()` to replay values to late subscribers

---

## Higher-Order Observables

### Higher-Order Operators
- **`mergeMap()` / `flatMap()`**: Maps to inner Observables and merges them
- **`switchMap()`**: Maps to inner Observables and switches to the latest
- **`concatMap()`**: Maps to inner Observables and concatenates them
- **`exhaustMap()`**: Maps to inner Observables and ignores new ones
- **`combineAll()`**: Combines all inner Observables when the outer completes
- **`mergeAll()`**: Merges all inner Observables
- **`concatAll()`**: Concatenates all inner Observables
- **`switchAll()`**: Switches to the latest inner Observable
- **`exhaustAll()`**: Ignores new inner Observables until current completes

### Flattening Strategies
- **Merge**: Concurrent execution of inner Observables
- **Switch**: Cancel previous, execute latest
- **Concat**: Sequential execution of inner Observables
- **Exhaust**: Ignore new until current completes

---

## Advanced Concepts

### Backpressure
- **Backpressure Handling**: Managing fast producers and slow consumers
- **Buffering**: Using buffer operators to handle backpressure
- **Throttling**: Using throttle operators to limit emissions
- **Debouncing**: Using debounce operators to reduce emissions

### Testing
- **Marble Testing**: Testing Observables with marble diagrams
- **TestScheduler**: Virtual time scheduler for testing
- **Hot vs Cold Testing**: Testing hot and cold Observables

### Memory Management
- **Unsubscription**: Properly unsubscribing to prevent memory leaks
- **takeUntil Pattern**: Using `takeUntil()` for automatic unsubscription
- **Async Pipe**: Using Angular's async pipe for automatic unsubscription

### Best Practices
- **Operator Chaining**: Composing operators for complex transformations
- **Pipe Function**: Using `pipe()` for operator composition
- **Pure Functions**: Keeping operators pure when possible
- **Error Handling**: Always handle errors appropriately
- **Memory Leaks**: Always unsubscribe to prevent memory leaks

---

## 📖 Resources

- [RxJS Official Documentation](https://rxjs.dev/)
- [RxJS Operators Reference](https://rxjs.dev/api)
- [RxJS Marble Diagrams](https://rxmarbles.com/)
- [Learn RxJS](https://www.learnrxjs.io/)

## 📖 Documentation Structure

```
docs/
├── README.md                              # Documentation index
├── 01-core-concepts.md                   # Observable, Observer, Subscription
├── 02-observable-creation.md              # Creation operators
├── 03-transformation-operators.md         # Transformation operators
├── 04-filtering-operators.md              # Filtering operators
├── 05-combination-operators.md            # Combination operators
├── 06-subjects.md                         # Subjects
├── 07-error-handling.md                   # Error handling
├── 08-multicasting.md                     # Multicasting
├── 09-higher-order-observables.md         # Higher-order operators
├── 11-schedulers.md                       # Schedulers
└── 16-memory-management.md                # Memory management
```

Each documentation file includes:
- ✅ Detailed explanations
- ✅ Code examples
- ✅ Use cases
- ✅ Best practices
- ✅ Common patterns
- ✅ Related concepts

## 📝 Example Files Structure

```
examples/
├── 01-core-concepts.ts                    # Observable, Observer, Subscription basics
├── 02-observable-creation.ts              # Creation operators (of, from, interval, etc.)
├── 03-transformation-operators.ts         # Transformation operators (map, scan, etc.)
├── 04-filtering-operators.ts              # Filtering operators (filter, take, skip, etc.)
├── 05-combination-operators.ts            # Combination operators (combineLatest, merge, etc.)
├── 06-subjects.ts                          # Subjects (Subject, BehaviorSubject, etc.)
├── 07-error-handling.ts                    # Error handling (catchError, retry, etc.)
├── 08-multicasting.ts                      # Multicasting (share, multicast, etc.)
├── 09-higher-order-observables.ts         # Higher-order operators (mergeMap, switchMap, etc.)
├── 10-utility-operators.ts                 # Utility operators (tap, delay, timeout, etc.)
├── 11-schedulers.ts                        # Schedulers (asyncScheduler, asapScheduler, etc.)
├── 12-conditional-mathematical-operators.ts # Conditional and mathematical operators
├── 13-http-websocket-operators.ts         # HTTP & WebSocket (ajax, fetch, webSocket, etc.)
├── 14-advanced-operators.ts                # Advanced operators (bufferWhen, windowTime, etc.)
├── 15-custom-operators.ts                 # Creating custom operators
├── 16-memory-management.ts                # Memory management patterns
├── 17-testing-rxjs.ts                     # Testing with TestScheduler and marble testing
├── 18-backpressure-handling.ts            # Backpressure handling strategies
├── 19-rxjs-with-promises-async.ts         # RxJS with Promises and async/await
└── 20-operator-composition-patterns.ts    # Operator composition patterns
```

Each example file includes:
- ✅ Detailed documentation for each concept
- ✅ Multiple code examples demonstrating usage
- ✅ Practical real-world examples
- ✅ Best practices and patterns
- ✅ Exportable utility functions

## 🎯 How to Use This Repository

1. **Start with Core Concepts**: Begin with `01-core-concepts.ts` to understand the fundamentals
2. **Explore Creation**: Learn how to create Observables in `02-observable-creation.ts`
3. **Master Operators**: Study transformation, filtering, and combination operators
4. **Understand Advanced Topics**: Dive into Subjects, Error Handling, and Multicasting
5. **Practice**: Run examples and modify them to see how they work

## 💡 Tips

- Each example file is self-contained and can be run independently
- Examples include both simple demonstrations and practical use cases
- All code is well-commented and documented
- Export functions can be imported and reused in your projects

---

## License

This is a learning resource for RxJS concepts.

