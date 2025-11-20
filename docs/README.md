# RxJS Documentation

Welcome to the comprehensive RxJS documentation. This documentation covers all major concepts, operators, and patterns in RxJS.

## 📚 Documentation Index

### Core Concepts
1. **[Core Concepts](./01-core-concepts.md)** - Observable, Observer, Subscription, Producer, Lifecycle
2. **[Observable Creation](./02-observable-creation.md)** - Creation operators (of, from, interval, etc.)

### Operators
3. **[Transformation Operators](./03-transformation-operators.md)** - map, scan, mergeMap, switchMap, etc.
4. **[Filtering Operators](./04-filtering-operators.md)** - filter, take, skip, debounceTime, etc.
5. **[Combination Operators](./05-combination-operators.md)** - combineLatest, merge, concat, zip, etc.
6. **[Utility Operators](./10-utility-operators.md)** - tap, delay, timeout, repeat, finalize, etc.
7. **[Conditional & Mathematical](./12-conditional-mathematical-operators.md)** - defaultIfEmpty, every, count, max, min
8. **[Advanced Operators](./14-advanced-operators.md)** - bufferWhen, windowTime, audit, debounce, throttle
9. **[Custom Operators](./15-custom-operators.md)** - Creating custom operators

### Advanced Topics
9. **[Subjects](./06-subjects.md)** - Subject, BehaviorSubject, ReplaySubject, AsyncSubject
10. **[Error Handling](./07-error-handling.md)** - catchError, retry, retryWhen, error patterns
11. **[Multicasting](./08-multicasting.md)** - share, shareReplay, multicast, publish, refCount
12. **[Higher-Order Observables](./09-higher-order-observables.md)** - mergeMap, switchMap, concatMap, exhaustMap
13. **[Schedulers](./11-schedulers.md)** - asyncScheduler, asapScheduler, queueScheduler

### HTTP & Network
10. **[HTTP & WebSocket Operators](./13-http-websocket-operators.md)** - ajax, fromFetch, webSocket, fromEventPattern

### Customization & Patterns
11. **[Custom Operators](./15-custom-operators.md)** - Creating custom operators
12. **[Operator Composition Patterns](./20-operator-composition-patterns.md)** - Pipe composition, reusable chains

### Production Patterns
13. **[Memory Management](./16-memory-management.md)** - Unsubscription patterns, cleanup, leak prevention
14. **[Backpressure Handling](./18-backpressure-handling.md)** - Buffering, throttling, debouncing strategies
15. **[RxJS with Promises & Async/Await](./19-rxjs-with-promises-async.md)** - Observable/Promise conversion

### Testing
16. **[Testing RxJS](./17-testing-rxjs.md)** - TestScheduler, marble testing, testing operators

## 🚀 Getting Started

1. **Start with Core Concepts** - Understand Observable, Observer, and Subscription
2. **Learn Creation Operators** - How to create Observables
3. **Master Transformation** - Transform data with map, scan, etc.
4. **Understand Filtering** - Control data flow with filter, take, etc.
5. **Explore Advanced Topics** - Subjects, Error Handling, Multicasting

## 📖 How to Use This Documentation

- Each document is self-contained with examples
- Code examples use TypeScript
- Concepts build upon each other
- Cross-references link related topics
- Best practices included for each concept

## 🔗 Related Resources

- [Code Examples](../examples/) - Working code examples for each concept
- [RxJS Official Docs](https://rxjs.dev/)
- [RxJS Operators Reference](https://rxjs.dev/api)
- [RxJS Marble Diagrams](https://rxmarbles.com/)

## 📝 Documentation Structure

Each documentation file includes:
- **Overview** - What the concept is
- **Detailed Explanation** - How it works
- **Code Examples** - Practical usage
- **Use Cases** - When to use it
- **Best Practices** - Recommended patterns
- **Common Patterns** - Real-world examples
- **Related Concepts** - Links to related topics

## 💡 Tips

- Read documentation alongside code examples
- Try examples in your own environment
- Experiment with variations
- Refer to official RxJS docs for API details
- Use marble diagrams to visualize streams

---

**Note**: This documentation complements the code examples in the `examples/` directory. For hands-on learning, refer to both the documentation and the corresponding example files.

