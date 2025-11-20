/**
 * Operator Composition Patterns Examples
 * 
 * This file demonstrates operator composition patterns in RxJS:
 * - Pipe function usage
 * - Composing multiple operators
 * - Reusable operator chains
 * - Conditional operator composition
 * - Dynamic operator composition
 * - Best practices
 */

import {
  Observable,
  of,
  interval,
  from,
  throwError
} from 'rxjs';
import {
  map,
  filter,
  tap,
  catchError,
  retry,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  take,
  takeWhile,
  finalize,
  share,
  shareReplay
} from 'rxjs/operators';

// ============================================================================
// 1. Basic Pipe Composition
// ============================================================================
/**
 * Using pipe() to compose multiple operators.
 */

console.log('=== Basic Pipe Composition ===');

// Simple composition
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  filter(x => x % 2 === 0),
  map(x => x * 10),
  tap(x => console.log('Processed:', x))
).subscribe();

// ============================================================================
// 2. Reusable Operator Chains
// ============================================================================
/**
 * Creating reusable operator chains as functions.
 */

console.log('\n=== Reusable Operator Chains ===');

// Reusable chain for processing numbers
function processNumbers() {
  return (source: Observable<number>) => {
    return source.pipe(
      filter(x => x > 0),
      map(x => x * 2),
      tap(x => console.log('Processed number:', x))
    );
  };
}

// Usage
of(1, 2, 3, -1, 4, 5).pipe(
  processNumbers()
).subscribe();

// Reusable chain for API requests
function handleApiRequest<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      retry(3),
      timeout(5000),
      catchError(err => {
        console.error('API request failed:', err);
        return throwError(() => err);
      })
    );
  };
}

// ============================================================================
// 3. Conditional Operator Composition
// ============================================================================
/**
 * Conditionally applying operators based on runtime conditions.
 */

console.log('\n=== Conditional Operator Composition ===');

function conditionalComposition<T>(
  source: Observable<T>,
  enableLogging: boolean,
  enableRetry: boolean
): Observable<T> {
  let result$ = source;

  if (enableLogging) {
    result$ = result$.pipe(
      tap(value => console.log('Logging:', value))
    );
  }

  if (enableRetry) {
    result$ = result$ = result$.pipe(
      retry(3)
    );
  }

  return result$;
}

// Usage
const source$ = of(1, 2, 3);
conditionalComposition(source$, true, false).subscribe();

// ============================================================================
// 4. Dynamic Operator Composition
// ============================================================================
/**
 * Dynamically composing operators based on configuration.
 */

console.log('\n=== Dynamic Operator Composition ===');

interface OperatorConfig {
  debounce?: number;
  distinct?: boolean;
  retry?: number;
  timeout?: number;
}

function dynamicComposition<T>(config: OperatorConfig) {
  return (source: Observable<T>) => {
    let result$ = source;

    if (config.debounce) {
      result$ = result$.pipe(debounceTime(config.debounce));
    }

    if (config.distinct) {
      result$ = result$.pipe(distinctUntilChanged());
    }

    if (config.retry) {
      result$ = result$.pipe(retry(config.retry));
    }

    if (config.timeout) {
      result$ = result$.pipe(timeout(config.timeout));
    }

    return result$;
  };
}

// Usage
const config: OperatorConfig = {
  debounce: 300,
  distinct: true,
  retry: 3
};

of(1, 1, 2, 2, 3, 3).pipe(
  dynamicComposition(config)
).subscribe(value => console.log('Dynamic composition:', value));

// Note: timeout needs to be imported
import { timeout } from 'rxjs/operators';

// ============================================================================
// 5. Composing Higher-Order Operators
// ============================================================================
/**
 * Composing operators that work with inner Observables.
 */

console.log('\n=== Composing Higher-Order Operators ===');

// Search with debounce and switchMap
function createSearchObservable(searchTerms$: Observable<string>) {
  return searchTerms$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length > 2),
    switchMap(term => {
      // Simulate API call
      return from(fetch(`/api/search?q=${term}`).then(r => r.json()));
    }),
    catchError(err => {
      console.error('Search error:', err);
      return of([]);
    })
  );
}

// ============================================================================
// 6. Error Handling Composition
// ============================================================================
/**
 * Composing error handling operators.
 */

console.log('\n=== Error Handling Composition ===');

function errorHandlingChain<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      retry(3),
      catchError(err => {
        console.error('Error after retries:', err);
        return of(null as T); // Fallback value
      }),
      finalize(() => {
        console.log('Operation completed');
      })
    );
  };
}

// Usage
throwError(() => new Error('Test error')).pipe(
  errorHandlingChain()
).subscribe(value => console.log('Error handled:', value));

// ============================================================================
// 7. Performance Optimization Composition
// ============================================================================
/**
 * Composing operators for performance optimization.
 */

console.log('\n=== Performance Optimization Composition ===');

function optimizePerformance<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      shareReplay(1), // Share and replay last value
      distinctUntilChanged(), // Only emit when value changes
      debounceTime(100) // Debounce rapid changes
    );
  };
}

// ============================================================================
// 8. Practical Composition Patterns
// ============================================================================

/**
 * Pattern 1: Request Pipeline
 */
function createRequestPipeline<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      tap(request => console.log('Request:', request)),
      timeout(5000),
      retry(3),
      catchError(err => {
        console.error('Request failed:', err);
        return throwError(() => err);
      }),
      finalize(() => console.log('Request completed'))
    );
  };
}

/**
 * Pattern 2: Data Processing Pipeline
 */
function createDataProcessingPipeline<T, R>(
  transformer: (value: T) => R,
  validator: (value: R) => boolean
) {
  return (source: Observable<T>) => {
    return source.pipe(
      map(transformer),
      filter(validator),
      distinctUntilChanged(),
      shareReplay(1)
    );
  };
}

/**
 * Pattern 3: Search Pipeline
 */
function createSearchPipeline() {
  return (source: Observable<string>) => {
    return source.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length > 2),
      switchMap(term => {
        // API call
        return from(fetch(`/api/search?q=${term}`).then(r => r.json()));
      }),
      catchError(err => {
        console.error('Search failed:', err);
        return of([]);
      })
    );
  };
}

/**
 * Pattern 4: Form Validation Pipeline
 */
function createFormValidationPipeline<T extends Record<string, any>>(
  validators: Record<keyof T, (value: any) => boolean>
) {
  return (source: Observable<T>) => {
    return source.pipe(
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) === JSON.stringify(curr);
      }),
      map(form => {
        const errors: string[] = [];
        for (const [key, validator] of Object.entries(validators)) {
          if (!validator(form[key])) {
            errors.push(`Invalid ${key}`);
          }
        }
        if (errors.length > 0) {
          throw new Error(errors.join(', '));
        }
        return form;
      }),
      catchError(err => {
        console.error('Validation error:', err);
        return throwError(() => err);
      })
    );
  };
}

/**
 * Pattern 5: Polling Pipeline
 */
function createPollingPipeline<T>(
  pollInterval: number,
  condition: (value: T) => boolean
) {
  return (source: Observable<T>) => {
    return source.pipe(
      switchMap(() => interval(pollInterval)),
      map(() => source),
      takeWhile(() => condition),
      finalize(() => console.log('Polling stopped'))
    );
  };
}

/**
 * Pattern 6: Caching Pipeline
 */
function createCachingPipeline<T>(
  cacheKey: string,
  ttl: number = 60000
) {
  const cache = new Map<string, { data: T; timestamp: number }>();

  return (source: Observable<T>) => {
    return source.pipe(
      map(data => {
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }),
      shareReplay(1)
    );
  };
}

// ============================================================================
// 9. Best Practices
// ============================================================================

/**
 * Best Practice 1: Keep operators pure when possible
 */
function pureOperator<T, R>(mapper: (value: T) => R) {
  return (source: Observable<T>) => {
    return source.pipe(
      map(mapper) // Pure function
    );
  };
}

/**
 * Best Practice 2: Handle errors at the right level
 */
function errorHandlingAtRightLevel<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      catchError(err => {
        // Handle at appropriate level
        console.error('Handled error:', err);
        return throwError(() => err);
      })
    );
  };
}

/**
 * Best Practice 3: Use share() for expensive operations
 */
function shareExpensiveOperation<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      share() // Share expensive computation
    );
  };
}

// Export for use in other files
export {
  processNumbers,
  handleApiRequest,
  conditionalComposition,
  dynamicComposition,
  createSearchObservable,
  errorHandlingChain,
  optimizePerformance,
  createRequestPipeline,
  createDataProcessingPipeline,
  createSearchPipeline,
  createFormValidationPipeline,
  createPollingPipeline,
  createCachingPipeline,
  pureOperator,
  errorHandlingAtRightLevel,
  shareExpensiveOperation
};

