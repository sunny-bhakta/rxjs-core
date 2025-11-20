/**
 * Testing RxJS Examples
 * 
 * This file demonstrates testing RxJS Observables:
 * - TestScheduler
 * - Marble testing
 * - Testing hot and cold Observables
 * - Testing operators
 * - Testing error scenarios
 */

import {
  TestScheduler,
  Observable,
  of,
  throwError,
  interval
} from 'rxjs';
import {
  map,
  filter,
  debounceTime,
  take,
  catchError
} from 'rxjs/operators';

// ============================================================================
// 1. TestScheduler Basics
// ============================================================================
/**
 * TestScheduler: Virtual time scheduler for testing Observables.
 * Allows testing time-based operators without waiting for real time.
 */

console.log('=== TestScheduler Basics ===');

// Create a test scheduler
const testScheduler = new TestScheduler((actual, expected) => {
  // Custom assertion
  expect(actual).toEqual(expected);
});

// Note: In real tests, you'd use a testing framework like Jest
function expect(actual: any) {
  return {
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
      console.log('✓ Test passed:', actual);
    }
  };
}

// ============================================================================
// 2. Marble Testing Syntax
// ============================================================================
/**
 * Marble Testing: Visual representation of Observable streams.
 * 
 * Syntax:
 * - '-' : 10 frames (time unit)
 * - 'a', 'b', 'c' : values
 * - '|' : completion
 * - '#' : error
 * - '^' : subscription point
 * - '!' : unsubscription point
 */

console.log('\n=== Marble Testing Syntax ===');

// Example marble diagrams:
// '-a-b-c|' : emits a, b, c, then completes
// '--a--b--c|' : emits a after 20ms, b after 40ms, c after 60ms, then completes
// '-a-b-#' : emits a, b, then errors
// '^--a--b!' : subscribes, emits a after 20ms, b after 40ms, then unsubscribes

// ============================================================================
// 3. Testing Simple Observable
// ============================================================================
/**
 * Testing a simple Observable with marble testing.
 */

console.log('\n=== Testing Simple Observable ===');

function testSimpleObservable() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ expectObservable }) => {
    const source$ = of(1, 2, 3);
    const expected = '(abc|)'; // a=1, b=2, c=3, then complete

    expectObservable(source$).toBe(expected, {
      a: 1,
      b: 2,
      c: 3
    });
  });
}

// ============================================================================
// 4. Testing Time-based Operators
// ============================================================================
/**
 * Testing operators that involve time using virtual time.
 */

console.log('\n=== Testing Time-based Operators ===');

function testDebounceTime() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable, flush }) => {
    // Create a cold Observable with marble string
    const source$ = cold('a-b-c-d-e-f|', {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6
    });

    // Apply debounceTime
    const result$ = source$.pipe(debounceTime(20));

    // Expected: only last value after debounce period
    const expected = '------(f|)'; // f after 60ms (debounce time)

    expectObservable(result$).toBe(expected, {
      f: 6
    });
  });
}

// ============================================================================
// 5. Testing Operators
// ============================================================================
/**
 * Testing custom operators and operator chains.
 */

console.log('\n=== Testing Operators ===');

function testMapOperator() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable }) => {
    const source$ = cold('a-b-c|', { a: 1, b: 2, c: 3 });
    const result$ = source$.pipe(map(x => x * 2));
    const expected = 'a-b-c|';

    expectObservable(result$).toBe(expected, {
      a: 2,
      b: 4,
      c: 6
    });
  });
}

function testFilterOperator() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable }) => {
    const source$ = cold('a-b-c-d|', { a: 1, b: 2, c: 3, d: 4 });
    const result$ = source$.pipe(filter(x => x % 2 === 0));
    const expected = '-b---d|';

    expectObservable(result$).toBe(expected, {
      b: 2,
      d: 4
    });
  });
}

// ============================================================================
// 6. Testing Error Scenarios
// ============================================================================
/**
 * Testing Observables that emit errors.
 */

console.log('\n=== Testing Error Scenarios ===');

function testErrorHandling() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable }) => {
    const source$ = cold('a-b-#', { a: 1, b: 2 }, new Error('Test error'));
    const result$ = source$.pipe(
      catchError(err => of('Error handled'))
    );
    const expected = 'a-b-(c|)';

    expectObservable(result$).toBe(expected, {
      a: 1,
      b: 2,
      c: 'Error handled'
    });
  });
}

// ============================================================================
// 7. Testing Hot Observables
// ============================================================================
/**
 * Testing hot Observables with marble testing.
 */

console.log('\n=== Testing Hot Observables ===');

function testHotObservable() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ hot, expectObservable }) => {
    // Hot Observable: values emitted regardless of subscription
    const hot$ = hot('--a--b--c|', { a: 1, b: 2, c: 3 });

    // Subscribe after some time
    const subscription = '^------!'; // Subscribe at start, unsubscribe after 60ms
    const expected = '------b--'; // Only get values after subscription

    expectObservable(hot$, subscription).toBe(expected, {
      b: 2
    });
  });
}

// ============================================================================
// 8. Testing Subscription Timing
// ============================================================================
/**
 * Testing when subscriptions occur and how they affect the stream.
 */

console.log('\n=== Testing Subscription Timing ===');

function testSubscriptionTiming() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable }) => {
    const source$ = cold('a-b-c|', { a: 1, b: 2, c: 3 });

    // Subscribe after 20ms
    const subscription = '--^--!';
    const expected = '--b-c|'; // Miss 'a', get 'b' and 'c'

    expectObservable(source$, subscription).toBe(expected, {
      b: 2,
      c: 3
    });
  });
}

// ============================================================================
// 9. Practical Testing Examples
// ============================================================================

/**
 * Example: Testing a search service
 */
class SearchService {
  search(term: string): Observable<string[]> {
    if (!term) {
      return of([]);
    }
    // Simulate API call
    return of([`${term} result 1`, `${term} result 2`]).pipe(
      debounceTime(300)
    );
  }
}

function testSearchService() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable }) => {
    const service = new SearchService();
    const searchTerms$ = cold('a-b-c|', {
      a: 'react',
      b: 'rxjs',
      c: 'typescript'
    });

    const result$ = searchTerms$.pipe(
      map(term => service.search(term)),
      // Flatten inner Observables
      mergeAll()
    );

    // Note: This is a simplified example
    // In real tests, you'd mock the service or use more complex marble strings
  });
}

// Note: mergeAll needs to be imported
import { mergeAll } from 'rxjs/operators';

/**
 * Example: Testing operator composition
 */
function testOperatorComposition() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ cold, expectObservable }) => {
    const source$ = cold('a-b-c-d-e|', {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5
    });

    // Compose multiple operators
    const result$ = source$.pipe(
      filter(x => x % 2 === 0),
      map(x => x * 10),
      take(2)
    );

    const expected = '-b---d|';

    expectObservable(result$).toBe(expected, {
      b: 20, // 2 * 10
      d: 40  // 4 * 10
    });
  });
}

// Export for use in other files
export {
  testSimpleObservable,
  testDebounceTime,
  testMapOperator,
  testFilterOperator,
  testErrorHandling,
  testHotObservable,
  testSubscriptionTiming,
  testSearchService,
  testOperatorComposition
};

