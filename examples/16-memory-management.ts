/**
 * Memory Management Examples
 * 
 * This file demonstrates memory management patterns in RxJS:
 * - Unsubscription patterns
 * - takeUntil pattern
 * - Automatic unsubscription
 * - Memory leak prevention
 * - Subscription management
 * - Cleanup functions
 */

import {
  Observable,
  Subject,
  Subscription,
  interval,
  timer,
  of
} from 'rxjs';
import {
  takeUntil,
  finalize,
  take,
  tap
} from 'rxjs/operators';

// ============================================================================
// 1. Manual Unsubscription
// ============================================================================
/**
 * Manual unsubscription: Store subscriptions and unsubscribe manually.
 */

console.log('=== Manual Unsubscription ===');

class Component {
  private subscriptions = new Subscription();

  ngOnInit() {
    // Add subscriptions
    const sub1 = interval(1000).subscribe(value => console.log('Sub 1:', value));
    const sub2 = interval(1500).subscribe(value => console.log('Sub 2:', value));

    // Add to subscription collection
    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  ngOnDestroy() {
    // Unsubscribe all at once
    this.subscriptions.unsubscribe();
    console.log('All subscriptions unsubscribed');
  }
}

// ============================================================================
// 2. takeUntil Pattern
// ============================================================================
/**
 * takeUntil pattern: Use a Subject to signal when to unsubscribe.
 * This is the recommended pattern for Angular components.
 */

console.log('\n=== takeUntil Pattern ===');

class ComponentWithTakeUntil {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // All subscriptions will automatically unsubscribe when destroy$ emits
    interval(1000).pipe(
      takeUntil(this.destroy$),
      tap(value => console.log('takeUntil sub 1:', value))
    ).subscribe();

    interval(1500).pipe(
      takeUntil(this.destroy$),
      tap(value => console.log('takeUntil sub 2:', value))
    ).subscribe();
  }

  ngOnDestroy() {
    // Emit to trigger unsubscription
    this.destroy$.next();
    this.destroy$.complete();
    console.log('Component destroyed, subscriptions cleaned up');
  }
}

// ============================================================================
// 3. Automatic Unsubscription with Operators
// ============================================================================
/**
 * Using operators that automatically complete to prevent memory leaks.
 */

console.log('\n=== Automatic Unsubscription ===');

// take() - automatically completes after N values
interval(1000).pipe(
  take(5)
).subscribe({
  next: value => console.log('take(5):', value),
  complete: () => console.log('take(5): completed automatically')
});

// takeWhile() - completes when condition is false
interval(1000).pipe(
  takeWhile(x => x < 5)
).subscribe({
  next: value => console.log('takeWhile(< 5):', value),
  complete: () => console.log('takeWhile: completed automatically')
});

// ============================================================================
// 4. Cleanup Functions
// ============================================================================
/**
 * Cleanup functions in Observable creation prevent memory leaks.
 */

console.log('\n=== Cleanup Functions ===');

function createObservableWithCleanup(): Observable<number> {
  return new Observable(observer => {
    let count = 0;
    const intervalId = setInterval(() => {
      count++;
      observer.next(count);
      if (count >= 5) {
        observer.complete();
      }
    }, 1000);

    // Cleanup function - called on unsubscription or completion
    return () => {
      clearInterval(intervalId);
      console.log('Cleanup: interval cleared');
    };
  });
}

const cleanupSub = createObservableWithCleanup().subscribe({
  next: value => console.log('Cleanup example:', value),
  complete: () => console.log('Cleanup example: completed')
});

// Unsubscribe to trigger cleanup
setTimeout(() => {
  cleanupSub.unsubscribe();
  console.log('Subscription unsubscribed, cleanup executed');
}, 3000);

// ============================================================================
// 5. finalize() for Cleanup
// ============================================================================
/**
 * finalize() operator executes cleanup code regardless of completion or error.
 */

console.log('\n=== finalize() for Cleanup ===');

interval(1000).pipe(
  take(3),
  tap(value => console.log('finalize example:', value)),
  finalize(() => {
    console.log('finalize: Cleanup executed (always runs)');
  })
).subscribe();

// finalize on error
of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Error on 2');
    return x;
  }),
  finalize(() => {
    console.log('finalize: Cleanup executed even on error');
  })
).subscribe({
  next: value => console.log('Value:', value),
  error: err => console.error('Error:', err.message)
});

// Note: map needs to be imported
import { map } from 'rxjs/operators';

// ============================================================================
// 6. Subscription Management Utility
// ============================================================================
/**
 * Utility class for managing multiple subscriptions.
 */

console.log('\n=== Subscription Management Utility ===');

class SubscriptionManager {
  private subscriptions = new Set<Subscription>();

  add(subscription: Subscription): void {
    this.subscriptions.add(subscription);
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    console.log('All subscriptions unsubscribed');
  }

  remove(subscription: Subscription): void {
    subscription.unsubscribe();
    this.subscriptions.delete(subscription);
  }

  get count(): number {
    return this.subscriptions.size;
  }
}

// Usage
const manager = new SubscriptionManager();
const sub1 = interval(1000).subscribe();
const sub2 = interval(1500).subscribe();

manager.add(sub1);
manager.add(sub2);
console.log('Active subscriptions:', manager.count);

// Later...
manager.unsubscribeAll();

// ============================================================================
// 7. Memory Leak Prevention Patterns
// ============================================================================
/**
 * Common patterns to prevent memory leaks.
 */

console.log('\n=== Memory Leak Prevention Patterns ===');

// Pattern 1: Always unsubscribe
class LeakPrevention1 {
  private subscription?: Subscription;

  start() {
    this.subscription = interval(1000).subscribe();
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}

// Pattern 2: Use takeUntil
class LeakPrevention2 {
  private destroy$ = new Subject<void>();

  start() {
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  stop() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Pattern 3: Use operators that complete
class LeakPrevention3 {
  start() {
    interval(1000).pipe(
      take(10) // Automatically completes
    ).subscribe();
  }
}

// ============================================================================
// 8. Shared Subscriptions
// ============================================================================
/**
 * Sharing subscriptions to prevent multiple executions.
 */

console.log('\n=== Shared Subscriptions ===');

import { share } from 'rxjs/operators';

// Without share - each subscription triggers new execution
const source1 = interval(1000).pipe(
  take(5),
  tap(x => console.log('Source execution:', x))
);

console.log('Without share:');
source1.subscribe();
setTimeout(() => source1.subscribe(), 2000);

// With share - execution is shared
const sharedSource = interval(1000).pipe(
  take(5),
  tap(x => console.log('Shared execution:', x)),
  share()
);

setTimeout(() => {
  console.log('With share:');
  sharedSource.subscribe();
  setTimeout(() => sharedSource.subscribe(), 2000);
}, 6000);

// ============================================================================
// 9. Practical Examples
// ============================================================================

/**
 * Example: Angular Component with proper cleanup
 */
class AngularComponent {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // All subscriptions use takeUntil
    this.loadData();
    this.setupEventListeners();
  }

  loadData() {
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Process data
    });
  }

  setupEventListeners() {
    // Event listeners with takeUntil
    fromEvent(document, 'click').pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      // Handle click
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Note: fromEvent needs to be imported
import { fromEvent } from 'rxjs';

/**
 * Example: Service with subscription management
 */
class DataService {
  private subscriptions = new Subscription();

  fetchData() {
    const sub = interval(1000).pipe(
      take(5)
    ).subscribe(data => {
      // Process data
    });

    this.subscriptions.add(sub);
  }

  cleanup() {
    this.subscriptions.unsubscribe();
  }
}

// Export for use in other files
export {
  Component,
  ComponentWithTakeUntil,
  SubscriptionManager,
  LeakPrevention1,
  LeakPrevention2,
  LeakPrevention3,
  AngularComponent,
  DataService
};

