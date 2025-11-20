/**
 * Combination Operators Examples
 * 
 * This file demonstrates operators that combine multiple Observables:
 * - combineLatest()
 * - merge()
 * - concat()
 * - zip()
 * - withLatestFrom()
 * - race()
 * - startWith()
 * - endWith()
 * - forkJoin()
 */

import {
  of,
  from,
  interval,
  timer,
  range,
  Observable
} from 'rxjs';
import {
  combineLatest,
  merge,
  concat,
  zip,
  withLatestFrom,
  race,
  startWith,
  endWith,
  forkJoin,
  take,
  map,
  delay
} from 'rxjs/operators';

// ============================================================================
// 1. combineLatest() - Combine latest values from multiple Observables
// ============================================================================
/**
 * combineLatest(): Combines multiple Observables to create an Observable
 * whose values are calculated from the latest values of each of its input Observables.
 */

console.log('=== combineLatest() Examples ===');

const source1 = interval(1000).pipe(take(5));
const source2 = interval(1500).pipe(take(5));

// Combine latest values
combineLatest([source1, source2]).subscribe(
  ([val1, val2]) => console.log(`combineLatest: [${val1}, ${val2}]`)
);

// Combine with projection function
combineLatest([source1, source2]).pipe(
  map(([val1, val2]) => val1 + val2)
).subscribe(sum => console.log('combineLatest(sum):', sum));

// Combine multiple Observables
const obs1 = of('A', 'B', 'C');
const obs2 = of(1, 2, 3);
const obs3 = of(true, false, true);

combineLatest([obs1, obs2, obs3]).subscribe(
  ([a, b, c]) => console.log('combineLatest(3 obs):', [a, b, c])
);

// ============================================================================
// 2. merge() - Merge multiple Observables
// ============================================================================
/**
 * merge(): Creates an output Observable which concurrently emits all values
 * from every given input Observable.
 */

console.log('\n=== merge() Examples ===');

const obsA = interval(1000).pipe(
  take(3),
  map(x => `A${x}`)
);
const obsB = interval(1200).pipe(
  take(3),
  map(x => `B${x}`)
);

// Merge two Observables
merge(obsA, obsB).subscribe(value => console.log('merge():', value));

// Merge multiple Observables
const obs1 = of(1, 2, 3);
const obs2 = of(4, 5, 6);
const obs3 = of(7, 8, 9);

merge(obs1, obs2, obs3).subscribe(value => console.log('merge(3 obs):', value));

// ============================================================================
// 3. concat() - Concatenate Observables sequentially
// ============================================================================
/**
 * concat(): Creates an output Observable which sequentially emits all values
 * from the first given Observable and then moves on to the next.
 */

console.log('\n=== concat() Examples ===');

const first = of(1, 2, 3);
const second = of(4, 5, 6);
const third = of(7, 8, 9);

// Concatenate sequentially
concat(first, second, third).subscribe(value => console.log('concat():', value));

// Concatenate with delays
const delayed1 = of(1, 2, 3).pipe(delay(100));
const delayed2 = of(4, 5, 6).pipe(delay(200));

concat(delayed1, delayed2).subscribe(value => console.log('concat(delayed):', value));

// ============================================================================
// 4. zip() - Combine values by index
// ============================================================================
/**
 * zip(): Combines multiple Observables to create an Observable whose values
 * are calculated from the values, in order, of each of its input Observables.
 */

console.log('\n=== zip() Examples ===');

const zip1 = of('A', 'B', 'C');
const zip2 = of(1, 2, 3);
const zip3 = of(true, false, true);

// Zip by index
zip(zip1, zip2, zip3).subscribe(
  ([a, b, c]) => console.log('zip():', [a, b, c])
);

// Zip with projection
zip(zip1, zip2).pipe(
  map(([letter, number]) => `${letter}${number}`)
).subscribe(value => console.log('zip(projection):', value));

// ============================================================================
// 5. withLatestFrom() - Combine with latest from another Observable
// ============================================================================
/**
 * withLatestFrom(): Combines the source Observable with other Observables
 * to create an Observable whose values are calculated from the latest values
 * of each, only when the source emits.
 */

console.log('\n=== withLatestFrom() Examples ===');

const source = interval(1000).pipe(take(5));
const latest = interval(2000).pipe(take(5));

source.pipe(
  withLatestFrom(latest)
).subscribe(([sourceVal, latestVal]) => 
  console.log('withLatestFrom:', [sourceVal, latestVal])
);

// ============================================================================
// 6. race() - Emit from first Observable to emit
// ============================================================================
/**
 * race(): Returns an Observable that mirrors the first source Observable
 * to emit an item.
 */

console.log('\n=== race() Examples ===');

const fast = timer(100).pipe(mapTo('Fast'));
const slow = timer(200).pipe(mapTo('Slow'));

race(fast, slow).subscribe(value => console.log('race():', value));

// Race with multiple Observables
const obs1 = timer(300).pipe(mapTo('Observable 1'));
const obs2 = timer(100).pipe(mapTo('Observable 2'));
const obs3 = timer(200).pipe(mapTo('Observable 3'));

race(obs1, obs2, obs3).subscribe(value => console.log('race(3 obs):', value));

// ============================================================================
// 7. startWith() - Emit value before Observable starts
// ============================================================================
/**
 * startWith(): Returns an Observable that emits the items you specify as arguments
 * before it begins to emit items emitted by the source Observable.
 */

console.log('\n=== startWith() Examples ===');

of(1, 2, 3).pipe(
  startWith(0)
).subscribe(value => console.log('startWith(0):', value));

// Start with multiple values
of('World').pipe(
  startWith('Hello', 'RxJS')
).subscribe(value => console.log('startWith(multiple):', value));

// ============================================================================
// 8. endWith() - Emit value when Observable completes
// ============================================================================
/**
 * endWith(): Returns an Observable that emits the items you specify as arguments
 * after it finishes emitting items emitted by the source Observable.
 */

console.log('\n=== endWith() Examples ===');

of(1, 2, 3).pipe(
  endWith(4, 5)
).subscribe(value => console.log('endWith(4,5):', value));

// ============================================================================
// 9. forkJoin() - Wait for all Observables to complete
// ============================================================================
/**
 * forkJoin(): Waits for Observables to complete and then combines the last
 * values they emitted.
 */

console.log('\n=== forkJoin() Examples ===');

const fork1 = of(1, 2, 3);
const fork2 = of('A', 'B', 'C');
const fork3 = of(true, false);

// ForkJoin waits for all to complete, then emits last values
forkJoin([fork1, fork2, fork3]).subscribe(
  ([val1, val2, val3]) => console.log('forkJoin():', [val1, val2, val3])
);

// ForkJoin with HTTP requests (simulated)
const request1 = timer(100).pipe(mapTo('Response 1'));
const request2 = timer(200).pipe(mapTo('Response 2'));
const request3 = timer(150).pipe(mapTo('Response 3'));

forkJoin([request1, request2, request3]).subscribe(
  responses => console.log('forkJoin(HTTP):', responses)
);

// ForkJoin with object syntax
forkJoin({
  users: of([{ id: 1, name: 'Alice' }]),
  posts: of([{ id: 1, title: 'Post 1' }]),
  comments: of([{ id: 1, text: 'Comment 1' }])
}).subscribe(result => console.log('forkJoin(object):', result));

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

/**
 * Example: Combine form values
 */
function combineFormValues(
  firstName$: Observable<string>,
  lastName$: Observable<string>,
  email$: Observable<string>
): Observable<{ firstName: string; lastName: string; email: string }> {
  return combineLatest([firstName$, lastName$, email$]).pipe(
    map(([firstName, lastName, email]) => ({
      firstName,
      lastName,
      email
    }))
  );
}

/**
 * Example: Load multiple resources in parallel
 */
function loadResources(): Observable<any> {
  const users$ = timer(100).pipe(mapTo([{ id: 1, name: 'User 1' }]));
  const posts$ = timer(150).pipe(mapTo([{ id: 1, title: 'Post 1' }]));
  const comments$ = timer(200).pipe(mapTo([{ id: 1, text: 'Comment 1' }]));

  return forkJoin({
    users: users$,
    posts: posts$,
    comments: comments$
  });
}

/**
 * Example: Search with debounce and combine with filters
 */
function searchWithFilters(
  searchTerm$: Observable<string>,
  category$: Observable<string>,
  sortBy$: Observable<string>
): Observable<any> {
  return combineLatest([searchTerm$, category$, sortBy$]).pipe(
    map(([term, category, sortBy]) => ({
      term,
      category,
      sortBy
    }))
  );
}

/**
 * Example: Merge multiple data sources
 */
function mergeDataSources(
  localData$: Observable<any>,
  remoteData$: Observable<any>
): Observable<any> {
  return merge(localData$, remoteData$);
}

// Export for use in other files
export {
  combineFormValues,
  loadResources,
  searchWithFilters,
  mergeDataSources
};

