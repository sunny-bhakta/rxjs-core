/**
 * Custom Operators Examples
 * 
 * This file demonstrates how to create custom RxJS operators:
 * - Basic custom operator
 * - Operator with parameters
 * - Operator composition
 * - Pipeable operators
 * - Higher-order custom operators
 */

import {
  Observable,
  OperatorFunction,
  UnaryFunction
} from 'rxjs';
import {
  map,
  filter,
  tap,
  catchError,
  retry
} from 'rxjs/operators';

// ============================================================================
// 1. Basic Custom Operator
// ============================================================================
/**
 * Custom operators are functions that return OperatorFunction.
 * They take a source Observable and return a new Observable.
 */

console.log('=== Basic Custom Operator ===');

// Custom operator: multiply by a factor
function multiplyBy(factor: number): OperatorFunction<number, number> {
  return (source: Observable<number>) => {
    return new Observable(observer => {
      return source.subscribe({
        next: value => observer.next(value * factor),
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  };
}

// Usage
import { of } from 'rxjs';
of(1, 2, 3, 4, 5).pipe(
  multiplyBy(10)
).subscribe(value => console.log('multiplyBy(10):', value));

// ============================================================================
// 2. Custom Operator Using Existing Operators
// ============================================================================
/**
 * The easiest way to create custom operators is to compose existing ones.
 */

console.log('\n=== Custom Operator with Composition ===');

// Custom operator: filter and map
function filterAndMap<T, R>(
  predicate: (value: T) => boolean,
  mapper: (value: T) => R
): OperatorFunction<T, R> {
  return (source: Observable<T>) => {
    return source.pipe(
      filter(predicate),
      map(mapper)
    );
  };
}

// Usage
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  filterAndMap(
    x => x % 2 === 0,
    x => x * 10
  )
).subscribe(value => console.log('filterAndMap():', value));

// ============================================================================
// 3. Custom Operator with Side Effects
// ============================================================================
/**
 * Custom operator that performs side effects while maintaining the stream.
 */

console.log('\n=== Custom Operator with Side Effects ===');

// Custom operator: log values
function log<T>(label: string = 'Value'): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      tap({
        next: value => console.log(`${label}:`, value),
        error: err => console.error(`${label} error:`, err),
        complete: () => console.log(`${label}: completed`)
      })
    );
  };
}

// Usage
of(1, 2, 3).pipe(
  log('Number')
).subscribe();

// ============================================================================
// 4. Custom Operator with Error Handling
// ============================================================================
/**
 * Custom operator that handles errors gracefully.
 */

console.log('\n=== Custom Operator with Error Handling ===');

// Custom operator: retry with exponential backoff
function retryWithBackoff<T>(
  maxRetries: number = 3,
  initialDelay: number = 1000
): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          const delay = initialDelay * Math.pow(2, retryCount - 1);
          console.log(`Retrying after ${delay}ms (attempt ${retryCount})`);
          return new Observable(observer => {
            setTimeout(() => observer.complete(), delay);
          });
        }
      }),
      catchError(err => {
        console.error('Max retries exceeded:', err);
        throw err;
      })
    );
  };
}

// ============================================================================
// 5. Custom Operator with State
// ============================================================================
/**
 * Custom operator that maintains state across emissions.
 */

console.log('\n=== Custom Operator with State ===');

// Custom operator: running average
function runningAverage(): OperatorFunction<number, number> {
  return (source: Observable<number>) => {
    return new Observable(observer => {
      let sum = 0;
      let count = 0;

      return source.subscribe({
        next: value => {
          sum += value;
          count++;
          observer.next(sum / count);
        },
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  };
}

// Usage
of(10, 20, 30, 40, 50).pipe(
  runningAverage()
).subscribe(avg => console.log('runningAverage():', avg));

// ============================================================================
// 6. Custom Operator: Debounce with Validation
// ============================================================================
/**
 * Custom operator that combines debounce with validation.
 */

console.log('\n=== Custom Operator: Debounce with Validation ===');

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

function debounceAndValidate<T>(
  debounceMs: number,
  validator: (value: T) => boolean
): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      filter(validator)
    );
  };
}

// Usage
import { interval } from 'rxjs';
interval(100).pipe(
  take(20),
  map(x => x * 10),
  debounceAndValidate(500, x => x > 50)
).subscribe(value => console.log('debounceAndValidate():', value));

// Note: take needs to be imported
import { take } from 'rxjs/operators';

// ============================================================================
// 7. Custom Operator: Batch Processing
// ============================================================================
/**
 * Custom operator that batches values.
 */

console.log('\n=== Custom Operator: Batch Processing ===');

import { bufferCount } from 'rxjs/operators';

function batch<T>(size: number): OperatorFunction<T, T[]> {
  return (source: Observable<T>) => {
    return source.pipe(
      bufferCount(size)
    );
  };
}

// Usage
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  batch(3)
).subscribe(batch => console.log('batch(3):', batch));

// ============================================================================
// 8. Custom Operator: Time-based Sampling
// ============================================================================
/**
 * Custom operator that samples values at intervals.
 */

console.log('\n=== Custom Operator: Time-based Sampling ===');

import { sampleTime } from 'rxjs/operators';

function sampleEvery<T>(intervalMs: number): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      sampleTime(intervalMs)
    );
  };
}

// ============================================================================
// 9. Custom Operator: Conditional Mapping
// ============================================================================
/**
 * Custom operator that conditionally maps values.
 */

console.log('\n=== Custom Operator: Conditional Mapping ===');

function mapIf<T, R>(
  condition: (value: T) => boolean,
  trueMapper: (value: T) => R,
  falseMapper: (value: T) => R
): OperatorFunction<T, R> {
  return (source: Observable<T>) => {
    return source.pipe(
      map(value => condition(value) ? trueMapper(value) : falseMapper(value))
    );
  };
}

// Usage
of(1, 2, 3, 4, 5).pipe(
  mapIf(
    x => x % 2 === 0,
    x => `Even: ${x}`,
    x => `Odd: ${x}`
  )
).subscribe(value => console.log('mapIf():', value));

// ============================================================================
// 10. Custom Operator: Rate Limiting
// ============================================================================
/**
 * Custom operator that limits the rate of emissions.
 */

console.log('\n=== Custom Operator: Rate Limiting ===');

import { throttleTime } from 'rxjs/operators';

function rateLimit<T>(maxPerSecond: number): OperatorFunction<T, T> {
  const intervalMs = 1000 / maxPerSecond;
  return (source: Observable<T>) => {
    return source.pipe(
      throttleTime(intervalMs)
    );
  };
}

// Usage
interval(50).pipe(
  take(20),
  rateLimit(2) // Max 2 per second
).subscribe(value => console.log('rateLimit(2/sec):', value));

// ============================================================================
// 11. Custom Operator: Accumulate with Reset
// ============================================================================
/**
 * Custom operator that accumulates values and resets on condition.
 */

console.log('\n=== Custom Operator: Accumulate with Reset ===');

import { scan } from 'rxjs/operators';

function accumulateUntil<T>(
  resetCondition: (acc: T[], value: T) => boolean,
  initialValue: T[] = []
): OperatorFunction<T, T[]> {
  return (source: Observable<T>) => {
    return source.pipe(
      scan((acc, value) => {
        if (resetCondition(acc, value)) {
          return [value]; // Reset
        }
        return [...acc, value]; // Accumulate
      }, initialValue)
    );
  };
}

// Usage
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  accumulateUntil((acc, value) => acc.length >= 3)
).subscribe(accumulated => console.log('accumulateUntil():', accumulated));

// ============================================================================
// 12. Practical Examples
// ============================================================================

/**
 * Example: Custom operator for API requests
 */
function apiRequest<T>(
  url: string,
  options?: RequestInit
): OperatorFunction<void, T> {
  return (source: Observable<void>) => {
    return source.pipe(
      mergeMap(() => fetch(url, options)),
      mergeMap(response => response.json() as Promise<T>),
      retry(3),
      catchError(err => {
        console.error('API request failed:', err);
        throw err;
      })
    );
  };
}

// Note: mergeMap needs to be imported
import { mergeMap } from 'rxjs/operators';

/**
 * Example: Custom operator for form validation
 */
function validateForm<T extends Record<string, any>>(
  validators: Record<keyof T, (value: any) => boolean>
): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return source.pipe(
      map(form => {
        const errors: string[] = [];
        for (const [key, validator] of Object.entries(validators)) {
          if (!validator(form[key])) {
            errors.push(`Validation failed for ${key}`);
          }
        }
        if (errors.length > 0) {
          throw new Error(errors.join(', '));
        }
        return form;
      }),
      catchError(err => {
        console.error('Form validation error:', err);
        throw err;
      })
    );
  };
}

// Export for use in other files
export {
  multiplyBy,
  filterAndMap,
  log,
  retryWithBackoff,
  runningAverage,
  debounceAndValidate,
  batch,
  sampleEvery,
  mapIf,
  rateLimit,
  accumulateUntil,
  apiRequest,
  validateForm
};

