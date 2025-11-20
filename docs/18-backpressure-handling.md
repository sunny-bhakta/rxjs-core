# Backpressure Handling

## Overview

Backpressure occurs when a producer emits values faster than a consumer can process them. RxJS provides several strategies to handle this imbalance.

## Understanding Backpressure

Backpressure happens when:
- Producer emits faster than consumer processes
- Consumer can't keep up with the stream
- Memory builds up with unprocessed values

## Buffering Strategy

Collect values into buffers and process them in batches.

### bufferCount()

Buffers a fixed number of values.

```typescript
import { interval } from 'rxjs';
import { bufferCount, take } from 'rxjs/operators';

interval(10).pipe(
  take(100),
  bufferCount(10) // Buffer every 10 values
).subscribe(batch => {
  processBatch(batch); // Process entire batch
});
```

### bufferTime()

Buffers values for a time period.

```typescript
import { interval } from 'rxjs';
import { bufferTime, take } from 'rxjs/operators';

interval(10).pipe(
  take(100),
  bufferTime(500) // Buffer for 500ms
).subscribe(batch => {
  processBatch(batch);
});
```

## Throttling Strategy

Emit the first value, then ignore subsequent values for a duration.

```typescript
import { interval } from 'rxjs';
import { throttleTime, take } from 'rxjs/operators';

interval(10).pipe(
  take(100),
  throttleTime(500) // Emit first, ignore for 500ms
).subscribe(value => {
  processValue(value); // Process at controlled rate
});
```

## Debouncing Strategy

Wait for a period of silence, then emit the latest value.

```typescript
import { interval } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

interval(10).pipe(
  take(100),
  debounceTime(300) // Emit after 300ms of silence
).subscribe(value => {
  processValue(value); // Only latest value
});
```

## Sampling Strategy

Sample the latest value at regular intervals.

```typescript
import { interval } from 'rxjs';
import { sampleTime, take } from 'rxjs/operators';

interval(10).pipe(
  take(100),
  sampleTime(500) // Sample every 500ms
).subscribe(value => {
  processValue(value); // Periodic sampling
});
```

## Dropping Strategy

Simply drop values that arrive too quickly.

```typescript
import { interval } from 'rxjs';
import { throttleTime, take } from 'rxjs/operators';

interval(10).pipe(
  take(100),
  throttleTime(500, undefined, { leading: false, trailing: true })
).subscribe(value => {
  processValue(value); // Drops leading values
});
```

## Strategy Comparison

| Strategy | Use Case | Behavior |
|----------|----------|----------|
| **Buffering** | Batch processing | Collects values |
| **Throttling** | Rate limiting | Emits first, ignores rest |
| **Debouncing** | Search input | Waits for silence |
| **Sampling** | Periodic updates | Samples at intervals |
| **Dropping** | Overload protection | Drops excess values |

## Best Practices

1. **Use buffering for batch processing** - Process in groups
2. **Use throttling for rate limiting** - Control emission rate
3. **Use debouncing for user input** - Wait for user to finish
4. **Use sampling for periodic updates** - Regular intervals
5. **Monitor memory usage** - Buffers can grow large
6. **Choose strategy based on use case** - Each has specific purpose

## Common Patterns

### Pattern 1: Search Input

```typescript
searchInput$.pipe(
  debounceTime(300), // Wait for user to stop typing
  distinctUntilChanged() // Only if value changed
).subscribe(term => performSearch(term));
```

### Pattern 2: Rate Limiting

```typescript
apiCalls$.pipe(
  throttleTime(1000) // Max 1 call per second
).subscribe(call => makeApiCall(call));
```

### Pattern 3: Batch Processing

```typescript
dataStream$.pipe(
  bufferCount(100) // Process 100 items at a time
).subscribe(batch => processBatch(batch));
```

### Pattern 4: Smooth UI Updates

```typescript
rapidUpdates$.pipe(
  sampleTime(100) // Update UI at most every 100ms
).subscribe(update => updateUI(update));
```

## Related Concepts

- [Filtering Operators](./04-filtering-operators.md)
- [Advanced Operators](./14-advanced-operators.md)
- [Utility Operators](./10-utility-operators.md)

