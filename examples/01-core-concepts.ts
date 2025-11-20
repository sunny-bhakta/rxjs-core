/**
 * RxJS Core Concepts Examples
 * 
 * This file demonstrates the fundamental concepts of RxJS:
 * - Observable
 * - Observer
 * - Subscription
 * - Producer
 * - Observable Lifecycle
 */

import { Observable, Observer, Subscription } from 'rxjs';

// ============================================================================
// 1. OBSERVABLE
// ============================================================================
/**
 * Observable: The foundation of RxJS - a stream of values over time
 * 
 * An Observable is a lazy push-based collection of multiple values.
 * It represents a stream of data that can be observed over time.
 */

// Creating an Observable using the constructor
const observable1 = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

// Creating an Observable with error
const observableWithError = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.error(new Error('Something went wrong'));
});

// ============================================================================
// 2. OBSERVER
// ============================================================================
/**
 * Observer: An object with next, error, and complete methods
 * 
 * An Observer is a consumer of values delivered by an Observable.
 * It has three optional callbacks: next, error, and complete.
 */

// Creating an Observer object
const observer: Observer<number> = {
  next: (value) => console.log('Received value:', value),
  error: (err) => console.error('Error occurred:', err),
  complete: () => console.log('Observable completed')
};

// Using inline Observer
const inlineObserver = {
  next: (value: number) => console.log('Value:', value),
  error: (err: Error) => console.error('Error:', err),
  complete: () => console.log('Done!')
};

// ============================================================================
// 3. SUBSCRIPTION
// ============================================================================
/**
 * Subscription: Represents the execution of an Observable
 * 
 * A Subscription represents a disposable resource, usually the execution
 * of an Observable. You can unsubscribe to cancel the execution.
 */

// Subscribing to an Observable (returns a Subscription)
const subscription: Subscription = observable1.subscribe(observer);

// Unsubscribing to cancel the execution
subscription.unsubscribe();

// Multiple subscriptions
const subscription1 = observable1.subscribe({
  next: (value) => console.log('Subscriber 1:', value)
});

const subscription2 = observable1.subscribe({
  next: (value) => console.log('Subscriber 2:', value)
});

// Unsubscribing multiple subscriptions
subscription1.unsubscribe();
subscription2.unsubscribe();

// Adding subscriptions together
const combinedSubscription = new Subscription();
combinedSubscription.add(subscription1);
combinedSubscription.add(subscription2);
// Unsubscribe all at once
combinedSubscription.unsubscribe();

// ============================================================================
// 4. PRODUCER
// ============================================================================
/**
 * Producer: The source of values for an Observable
 * 
 * The producer is the function passed to the Observable constructor
 * that generates and emits values to subscribers.
 */

// Producer that emits values synchronously
const syncProducer = new Observable<number>((subscriber) => {
  console.log('Producer started');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
  console.log('Producer finished');
});

// Producer that emits values asynchronously
const asyncProducer = new Observable<number>((subscriber) => {
  console.log('Async producer started');
  let count = 0;
  const intervalId = setInterval(() => {
    count++;
    subscriber.next(count);
    if (count >= 5) {
      clearInterval(intervalId);
      subscriber.complete();
      console.log('Async producer finished');
    }
  }, 1000);
  
  // Cleanup function (teardown logic)
  return () => {
    clearInterval(intervalId);
    console.log('Producer cleaned up');
  };
});

// ============================================================================
// 5. OBSERVABLE LIFECYCLE
// ============================================================================
/**
 * Observable Lifecycle:
 * 1. Creation: Observable is created but not executed
 * 2. Subscription: Observable execution starts
 * 3. Execution: Producer function runs and emits values
 * 4. Completion: Observable completes successfully
 * 5. Error: Observable encounters an error
 * 6. Unsubscription: Observable execution is cancelled
 */

// Lifecycle demonstration
const lifecycleDemo = new Observable<string>((subscriber) => {
  console.log('1. Execution started');
  
  // Emit values
  subscriber.next('First value');
  subscriber.next('Second value');
  
  // Complete the Observable
  subscriber.complete();
  console.log('2. Execution completed');
  
  // This won't be emitted after complete()
  subscriber.next('This will not be emitted');
  
  // Cleanup function
  return () => {
    console.log('3. Cleanup executed');
  };
});

// Subscribe to see the lifecycle
const lifecycleSubscription = lifecycleDemo.subscribe({
  next: (value) => console.log('Received:', value),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Observable completed')
});

// Unsubscribe to trigger cleanup
setTimeout(() => {
  lifecycleSubscription.unsubscribe();
}, 1000);

// ============================================================================
// 6. ERROR HANDLING IN OBSERVABLE
// ============================================================================
/**
 * Error handling: When an error occurs, the Observable stops emitting
 * and calls the error callback. After error, no more values are emitted.
 */

const errorDemo = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.error(new Error('An error occurred'));
  // This won't be emitted
  subscriber.next(3);
  subscriber.complete();
});

errorDemo.subscribe({
  next: (value) => console.log('Value:', value),
  error: (err) => console.error('Caught error:', err.message),
  complete: () => console.log('This will not be called after error')
});

// ============================================================================
// 7. COLD OBSERVABLE EXAMPLE
// ============================================================================
/**
 * Cold Observable: Each subscription triggers a new execution
 * Each subscriber gets its own independent execution of the Observable.
 */

const coldObservable = new Observable<number>((subscriber) => {
  const random = Math.random();
  console.log('Cold observable execution, random:', random);
  subscriber.next(random);
  subscriber.complete();
});

// Each subscription gets a different random number
coldObservable.subscribe(value => console.log('Subscriber 1:', value));
coldObservable.subscribe(value => console.log('Subscriber 2:', value));

// ============================================================================
// 8. PRACTICAL EXAMPLE: CUSTOM OBSERVABLE
// ============================================================================
/**
 * Creating a custom Observable for a countdown timer
 */

function createCountdown(seconds: number): Observable<number> {
  return new Observable<number>((subscriber) => {
    let count = seconds;
    
    const intervalId = setInterval(() => {
      if (count > 0) {
        subscriber.next(count);
        count--;
      } else {
        subscriber.complete();
        clearInterval(intervalId);
      }
    }, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      console.log('Countdown cancelled');
    };
  });
}

// Usage
const countdown = createCountdown(5);
const countdownSubscription = countdown.subscribe({
  next: (value) => console.log(`Countdown: ${value}`),
  complete: () => console.log('Countdown finished!')
});

// Cancel after 2 seconds
setTimeout(() => {
  countdownSubscription.unsubscribe();
}, 2000);

// ============================================================================
// EXPORT FOR USE IN OTHER FILES
// ============================================================================
export {
  observable1,
  observer,
  subscription,
  syncProducer,
  asyncProducer,
  lifecycleDemo,
  errorDemo,
  coldObservable,
  createCountdown
};

