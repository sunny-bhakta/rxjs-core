/**
 * Higher-Order Observables Examples
 * 
 * This file demonstrates higher-order operators that work with
 * Observables that emit Observables:
 * - mergeMap() / flatMap()
 * - switchMap()
 * - concatMap()
 * - exhaustMap()
 * - mergeAll()
 * - concatAll()
 * - switchAll()
 * - exhaustAll()
 * - combineAll()
 */

import {
  of,
  from,
  interval,
  timer,
  Observable,
  EMPTY
} from 'rxjs';
import {
  mergeMap,
  switchMap,
  concatMap,
  exhaustMap,
  mergeAll,
  concatAll,
  switchAll,
  exhaustAll,
  combineAll,
  take,
  map,
  delay,
  tap
} from 'rxjs/operators';

// ============================================================================
// 1. Higher-Order Observable Concept
// ============================================================================
/**
 * Higher-Order Observable: An Observable that emits Observables.
 * We need to "flatten" these nested Observables into a single stream.
 */

console.log('=== Higher-Order Observable Concept ===');

// Observable that emits Observables
const higherOrder$ = of(
  of(1, 2, 3),
  of(4, 5, 6),
  of(7, 8, 9)
);

// Without flattening - emits Observables
higherOrder$.subscribe(obs => console.log('Higher-order value:', obs));

// With mergeAll - flattens and merges
higherOrder$.pipe(mergeAll()).subscribe(value => console.log('Flattened:', value));

// ============================================================================
// 2. mergeMap() / flatMap() - Map and merge concurrently
// ============================================================================
/**
 * mergeMap(): Projects each source value to an Observable which is merged
 * in the output Observable. All inner Observables run concurrently.
 */

console.log('\n=== mergeMap() Examples ===');

// Map to inner Observables and merge them concurrently
of(1, 2, 3).pipe(
  mergeMap(x => interval(100).pipe(
    take(3),
    map(i => `${x}-${i}`)
  ))
).subscribe(value => console.log('mergeMap():', value));

// Multiple HTTP requests concurrently
const urls = ['url1', 'url2', 'url3'];
from(urls).pipe(
  mergeMap(url => {
    // Simulate HTTP request with random delay
    const delayTime = Math.random() * 1000;
    return timer(delayTime).pipe(
      mapTo(`Response from ${url} (${delayTime.toFixed(0)}ms)`)
    );
  })
).subscribe(response => console.log('mergeMap(HTTP):', response));

// ============================================================================
// 3. switchMap() - Map and switch to latest
// ============================================================================
/**
 * switchMap(): Projects each source value to an Observable which is merged
 * in the output Observable, emitting values only from the most recently
 * projected Observable. Cancels previous inner Observables.
 */

console.log('\n=== switchMap() Examples ===');

// Switch to latest inner Observable (cancels previous)
of(1, 2, 3).pipe(
  switchMap(x => interval(100).pipe(
    take(5),
    map(i => `${x}-${i}`)
  ))
).subscribe(value => console.log('switchMap():', value));

// Search example: cancel previous search when new one starts
const searchTerms = ['react', 'rxjs', 'typescript'];
from(searchTerms).pipe(
  switchMap(term => {
    // Simulate search API call
    return timer(500).pipe(
      mapTo(`Results for: ${term}`)
    );
  })
).subscribe(results => console.log('switchMap(search):', results));

// Autocomplete example
function createAutocomplete(input$: Observable<string>): Observable<string[]> {
  return input$.pipe(
    switchMap(term => {
      if (term.length < 2) {
        return of([]);
      }
      // Simulate API call
      return timer(300).pipe(
        mapTo([`${term} result 1`, `${term} result 2`, `${term} result 3`])
      );
    })
  );
}

// ============================================================================
// 4. concatMap() - Map and concatenate sequentially
// ============================================================================
/**
 * concatMap(): Projects each source value to an Observable which is merged
 * in the output Observable, in a serialized fashion waiting for each one
 * to complete before moving on to the next.
 */

console.log('\n=== concatMap() Examples ===');

// Concatenate inner Observables sequentially
of(1, 2, 3).pipe(
  concatMap(x => interval(100).pipe(
    take(3),
    map(i => `${x}-${i}`)
  ))
).subscribe(value => console.log('concatMap():', value));

// Sequential HTTP requests
from(['user1', 'user2', 'user3']).pipe(
  concatMap(userId => {
    // Simulate sequential API calls
    return timer(200).pipe(
      mapTo(`User data for ${userId}`)
    );
  })
).subscribe(data => console.log('concatMap(HTTP):', data));

// ============================================================================
// 5. exhaustMap() - Ignore new until current completes
// ============================================================================
/**
 * exhaustMap(): Projects each source value to an Observable which is merged
 * in the output Observable only if the previous projected Observable has completed.
 */

console.log('\n=== exhaustMap() Examples ===');

// Ignore new emissions until current completes
of(1, 2, 3).pipe(
  exhaustMap(x => interval(100).pipe(
    take(5),
    map(i => `${x}-${i}`)
  ))
).subscribe(value => console.log('exhaustMap():', value));

// Prevent multiple clicks (ignore new clicks until current action completes)
from(['click1', 'click2', 'click3']).pipe(
  exhaustMap(click => {
    // Simulate long-running action
    return timer(1000).pipe(
      mapTo(`Action completed for ${click}`)
    );
  })
).subscribe(result => console.log('exhaustMap(click):', result));

// ============================================================================
// 6. mergeAll() - Merge all inner Observables
// ============================================================================
/**
 * mergeAll(): Converts a higher-order Observable into a first-order Observable
 * by merging the inner Observables.
 */

console.log('\n=== mergeAll() Examples ===');

// Create higher-order Observable
const higherOrder1 = interval(1000).pipe(
  take(3),
  map(x => interval(200).pipe(
    take(3),
    map(i => `${x}-${i}`)
  ))
);

// Merge all inner Observables
higherOrder1.pipe(mergeAll()).subscribe(value => console.log('mergeAll():', value));

// ============================================================================
// 7. concatAll() - Concatenate all inner Observables
// ============================================================================
/**
 * concatAll(): Converts a higher-order Observable into a first-order Observable
 * by concatenating the inner Observables in order.
 */

console.log('\n=== concatAll() Examples ===');

const higherOrder2 = of(
  of(1, 2, 3),
  of(4, 5, 6),
  of(7, 8, 9)
);

higherOrder2.pipe(concatAll()).subscribe(value => console.log('concatAll():', value));

// ============================================================================
// 8. switchAll() - Switch to latest inner Observable
// ============================================================================
/**
 * switchAll(): Converts a higher-order Observable into a first-order Observable
 * by switching to the latest inner Observable.
 */

console.log('\n=== switchAll() Examples ===');

const higherOrder3 = interval(1000).pipe(
  take(3),
  map(x => interval(200).pipe(
    take(5),
    map(i => `${x}-${i}`)
  ))
);

higherOrder3.pipe(switchAll()).subscribe(value => console.log('switchAll():', value));

// ============================================================================
// 9. exhaustAll() - Ignore new until current completes
// ============================================================================
/**
 * exhaustAll(): Converts a higher-order Observable into a first-order Observable
 * by dropping inner Observables while the previous inner Observable has not completed.
 */

console.log('\n=== exhaustAll() Examples ===');

const higherOrder4 = interval(500).pipe(
  take(5),
  map(x => interval(200).pipe(
    take(3),
    map(i => `${x}-${i}`)
  ))
);

higherOrder4.pipe(exhaustAll()).subscribe(value => console.log('exhaustAll():', value));

// ============================================================================
// 10. combineAll() - Combine all inner Observables
// ============================================================================
/**
 * combineAll(): Flattens an Observable of Observables by applying combineLatest
 * when the Observable-of-Observables completes.
 */

console.log('\n=== combineAll() Examples ===');

const higherOrder5 = of(
  of(1, 2),
  of('a', 'b'),
  of(true, false)
);

higherOrder5.pipe(combineAll()).subscribe(values => console.log('combineAll():', values));

// ============================================================================
// 11. Comparison of Flattening Strategies
// ============================================================================
/**
 * Different flattening strategies for different use cases:
 * - mergeMap: Concurrent execution (all at once)
 * - switchMap: Cancel previous, execute latest (search, autocomplete)
 * - concatMap: Sequential execution (one after another)
 * - exhaustMap: Ignore new until current completes (prevent double-clicks)
 */

console.log('\n=== Flattening Strategy Comparison ===');

const source = interval(500).pipe(take(3));

// mergeMap - all run concurrently
console.log('mergeMap (concurrent):');
source.pipe(
  mergeMap(x => timer(1000).pipe(mapTo(`merge-${x}`)))
).subscribe(value => console.log('  ', value));

// switchMap - cancel previous
setTimeout(() => {
  console.log('switchMap (cancel previous):');
  source.pipe(
    switchMap(x => timer(1000).pipe(mapTo(`switch-${x}`)))
  ).subscribe(value => console.log('  ', value));
}, 5000);

// concatMap - sequential
setTimeout(() => {
  console.log('concatMap (sequential):');
  source.pipe(
    concatMap(x => timer(1000).pipe(mapTo(`concat-${x}`)))
  ).subscribe(value => console.log('  ', value));
}, 10000);

// exhaustMap - ignore new
setTimeout(() => {
  console.log('exhaustMap (ignore new):');
  source.pipe(
    exhaustMap(x => timer(2000).pipe(mapTo(`exhaust-${x}`)))
  ).subscribe(value => console.log('  ', value));
}, 15000);

// ============================================================================
// 12. Practical Examples
// ============================================================================

/**
 * Example: Search with debounce and switchMap
 */
function createSearchObservable(input$: Observable<string>): Observable<string[]> {
  return input$.pipe(
    switchMap(term => {
      if (term.length < 2) {
        return of([]);
      }
      // Cancel previous search, start new one
      return timer(300).pipe(
        mapTo([`${term} result 1`, `${term} result 2`])
      );
    })
  );
}

/**
 * Example: Sequential file uploads
 */
function uploadFilesSequentially(files: File[]): Observable<{ file: string; status: string }> {
  return from(files).pipe(
    concatMap(file => {
      // Simulate upload
      return timer(1000).pipe(
        mapTo({ file: file.toString(), status: 'uploaded' })
      );
    })
  );
}

/**
 * Example: Prevent double-submit with exhaustMap
 */
function preventDoubleSubmit(click$: Observable<Event>): Observable<any> {
  return click$.pipe(
    exhaustMap(() => {
      // Simulate form submission
      return timer(2000).pipe(
        mapTo({ status: 'submitted' })
      );
    })
  );
}

/**
 * Example: Load related data concurrently
 */
function loadRelatedData(userId: string): Observable<any> {
  const user$ = timer(100).pipe(mapTo({ id: userId, name: 'User' }));
  const posts$ = timer(150).pipe(mapTo([{ id: 1, title: 'Post' }]));
  const comments$ = timer(200).pipe(mapTo([{ id: 1, text: 'Comment' }]));

  return of(userId).pipe(
    mergeMap(() => {
      return combineLatest([user$, posts$, comments$]).pipe(
        map(([user, posts, comments]) => ({ user, posts, comments }))
      );
    })
  );
}

// Export for use in other files
export {
  createAutocomplete,
  createSearchObservable,
  uploadFilesSequentially,
  preventDoubleSubmit,
  loadRelatedData
};

