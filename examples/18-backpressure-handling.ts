/**
 * Backpressure Handling Examples
 * 
 * This file demonstrates handling backpressure in RxJS:
 * - What is backpressure
 * - Buffering strategies
 * - Throttling strategies
 * - Debouncing strategies
 * - Dropping strategies
 * - Backpressure in real-world scenarios
 */

import {
  Observable,
  interval,
  of,
  from
} from 'rxjs';
import {
  buffer,
  bufferCount,
  bufferTime,
  throttle,
  throttleTime,
  debounce,
  debounceTime,
  sample,
  sampleTime,
  audit,
  auditTime,
  take,
  map,
  mergeMap
} from 'rxjs/operators';

// ============================================================================
// 1. Understanding Backpressure
// ============================================================================
/**
 * Backpressure: When a producer emits values faster than a consumer can process them.
 * We need strategies to handle this imbalance.
 */

console.log('=== Understanding Backpressure ===');

// Fast producer, slow consumer
const fastProducer = interval(10); // Emits every 10ms
const slowConsumer = (value: number) => {
  // Simulate slow processing (100ms)
  return new Promise(resolve => setTimeout(() => {
    console.log('Processed:', value);
    resolve(value);
  }, 100));
};

// Without backpressure handling - will queue up values
// fastProducer.subscribe(value => slowConsumer(value));

// ============================================================================
// 2. Buffering Strategy
// ============================================================================
/**
 * Buffering: Collect values into buffers and process them in batches.
 */

console.log('\n=== Buffering Strategy ===');

// Buffer by count
interval(50).pipe(
  take(20),
  bufferCount(5) // Buffer every 5 values
).subscribe(buffer => {
  console.log('Buffer (count):', buffer);
  // Process entire buffer at once
});

// Buffer by time
interval(50).pipe(
  take(20),
  bufferTime(500) // Buffer every 500ms
).subscribe(buffer => {
  console.log('Buffer (time):', buffer);
});

// Buffer with max size
interval(50).pipe(
  take(20),
  bufferCount(5, 3) // Buffer 5, start new every 3 (overlapping)
).subscribe(buffer => {
  console.log('Buffer (overlapping):', buffer);
});

// ============================================================================
// 3. Throttling Strategy
// ============================================================================
/**
 * Throttling: Emit the first value, then ignore subsequent values for a duration.
 */

console.log('\n=== Throttling Strategy ===');

// Throttle by time
interval(50).pipe(
  take(20),
  throttleTime(500) // Emit first, ignore for 500ms
).subscribe(value => {
  console.log('Throttled (time):', value);
});

// Throttle with leading and trailing
interval(50).pipe(
  take(20),
  throttleTime(500, undefined, { leading: true, trailing: true })
).subscribe(value => {
  console.log('Throttled (leading+trailing):', value);
});

// ============================================================================
// 4. Debouncing Strategy
// ============================================================================
/**
 * Debouncing: Wait for a period of silence, then emit the latest value.
 */

console.log('\n=== Debouncing Strategy ===');

// Debounce by time
interval(50).pipe(
  take(20),
  debounceTime(300) // Wait 300ms of silence
).subscribe(value => {
  console.log('Debounced (time):', value);
});

// ============================================================================
// 5. Sampling Strategy
// ============================================================================
/**
 * Sampling: Sample the latest value at regular intervals.
 */

console.log('\n=== Sampling Strategy ===');

// Sample by time
interval(50).pipe(
  take(20),
  sampleTime(500) // Sample every 500ms
).subscribe(value => {
  console.log('Sampled (time):', value);
});

// Sample with notifier
interval(50).pipe(
  take(20),
  sample(interval(500)) // Sample when notifier emits
).subscribe(value => {
  console.log('Sampled (notifier):', value);
});

// ============================================================================
// 6. Auditing Strategy
// ============================================================================
/**
 * Auditing: Ignore values for a duration after each emission, then emit latest.
 */

console.log('\n=== Auditing Strategy ===');

// Audit by time
interval(50).pipe(
  take(20),
  auditTime(500) // Ignore for 500ms after emission, then emit latest
).subscribe(value => {
  console.log('Audited (time):', value);
});

// ============================================================================
// 7. Dropping Strategy
// ============================================================================
/**
 * Dropping: Simply drop values that arrive too quickly.
 * This is what happens with throttle when leading is false.
 */

console.log('\n=== Dropping Strategy ===');

// Drop values using throttle with leading: false
interval(50).pipe(
  take(20),
  throttleTime(500, undefined, { leading: false, trailing: true })
).subscribe(value => {
  console.log('Dropped (throttle trailing):', value);
});

// ============================================================================
// 8. Practical Examples
// ============================================================================

/**
 * Example: Search input with debounce
 */
function createSearchInput(debounceMs: number = 300) {
  // Simulate user typing
  const typing$ = interval(50).pipe(
    take(20),
    map(i => `search term ${i}`)
  );

  return typing$.pipe(
    debounceTime(debounceMs) // Only search after user stops typing
  );
}

createSearchInput(300).subscribe(term => {
  console.log('Search for:', term);
});

/**
 * Example: Rate limiting API calls
 */
function rateLimitApiCalls<T>(
  source: Observable<T>,
  maxPerSecond: number
): Observable<T> {
  const intervalMs = 1000 / maxPerSecond;
  return source.pipe(
    throttleTime(intervalMs) // Limit to maxPerSecond calls
  );
}

// Simulate API calls
const apiCalls$ = interval(100).pipe(
  take(20),
  map(i => `API call ${i}`)
);

rateLimitApiCalls(apiCalls$, 2).subscribe(call => {
  console.log('Rate limited API call:', call);
});

/**
 * Example: Batch processing with buffer
 */
function batchProcess<T>(
  source: Observable<T>,
  batchSize: number
): Observable<T[]> {
  return source.pipe(
    bufferCount(batchSize)
  );
}

const dataStream$ = interval(10).pipe(
  take(100),
  map(i => `Data ${i}`)
);

batchProcess(dataStream$, 10).subscribe(batch => {
  console.log('Processing batch:', batch.length, 'items');
  // Process entire batch
});

/**
 * Example: Smooth UI updates with sample
 */
function smoothUIUpdates<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    sampleTime(100) // Update UI at most every 100ms
  );
}

const rapidUpdates$ = interval(10).pipe(
  take(100),
  map(i => ({ update: i, timestamp: Date.now() }))
);

smoothUIUpdates(rapidUpdates$).subscribe(update => {
  console.log('UI update:', update);
});

/**
 * Example: Handling fast producer with buffer
 */
function handleFastProducer<T>(
  source: Observable<T>,
  bufferSize: number
): Observable<T> {
  return source.pipe(
    bufferCount(bufferSize), // Buffer values
    mergeMap(buffer => {
      // Process buffer sequentially
      return from(buffer);
    })
  );
}

const fastProducer$ = interval(10).pipe(
  take(100),
  map(i => `Item ${i}`)
);

handleFastProducer(fastProducer$, 5).subscribe(item => {
  // Process items at controlled rate
  console.log('Processed item:', item);
});

/**
 * Example: Adaptive backpressure handling
 */
function adaptiveBackpressure<T>(
  source: Observable<T>,
  processingTime: number
): Observable<T> {
  // If processing is slow, use buffer
  // If processing is fast, use throttle
  if (processingTime > 100) {
    return source.pipe(
      bufferTime(1000) // Buffer for 1 second
    ).pipe(
      mergeMap(buffer => from(buffer))
    );
  } else {
    return source.pipe(
      throttleTime(100) // Throttle to 100ms
    );
  }
}

// Export for use in other files
export {
  createSearchInput,
  rateLimitApiCalls,
  batchProcess,
  smoothUIUpdates,
  handleFastProducer,
  adaptiveBackpressure
};

