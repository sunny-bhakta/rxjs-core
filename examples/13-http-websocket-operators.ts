/**
 * HTTP and WebSocket Operators Examples
 * 
 * This file demonstrates RxJS operators for HTTP and WebSocket:
 * - ajax()
 * - fromFetch() / fetch()
 * - webSocket()
 * - fromEventPattern()
 * - toPromise() / firstValueFrom() / lastValueFrom()
 */

import {
  ajax,
  AjaxResponse,
  fromFetch,
  webSocket,
  fromEventPattern,
  Observable,
  firstValueFrom,
  lastValueFrom
} from 'rxjs';
import {
  map,
  catchError,
  retry,
  timeout,
  take,
  filter
} from 'rxjs/operators';

// ============================================================================
// 1. ajax() - Create Observable from AJAX request
// ============================================================================
/**
 * ajax(): Creates an Observable for an Ajax request with either a request
 * object with url, headers, etc or a string for a URL.
 */

console.log('=== ajax() Examples ===');

// Simple GET request
const getRequest$ = ajax({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

getRequest$.subscribe({
  next: (response: AjaxResponse<any>) => {
    console.log('ajax(GET) response:', response.response);
  },
  error: (err) => console.error('ajax(GET) error:', err)
});

// POST request with body
const postRequest$ = ajax({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    title: 'New Post',
    body: 'Post content',
    userId: 1
  }
});

postRequest$.subscribe({
  next: (response: AjaxResponse<any>) => {
    console.log('ajax(POST) response:', response.response);
  },
  error: (err) => console.error('ajax(POST) error:', err)
});

// GET JSON directly
const getJson$ = ajax.getJSON('https://jsonplaceholder.typicode.com/posts/1');
getJson$.subscribe({
  next: (data) => console.log('ajax.getJSON():', data),
  error: (err) => console.error('ajax.getJSON() error:', err)
});

// ============================================================================
// 2. fromFetch() - Create Observable from fetch API
// ============================================================================
/**
 * fromFetch(): Creates an Observable from a fetch request.
 * Uses the Fetch API under the hood.
 */

console.log('\n=== fromFetch() Examples ===');

// Simple fetch request
const fetchRequest$ = fromFetch('https://jsonplaceholder.typicode.com/posts/1', {
  selector: response => response.json() // Automatically parse JSON
});

fetchRequest$.subscribe({
  next: (data) => console.log('fromFetch() response:', data),
  error: (err) => console.error('fromFetch() error:', err)
});

// Fetch with custom selector
const fetchWithSelector$ = fromFetch('https://jsonplaceholder.typicode.com/posts/1', {
  selector: response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
});

fetchWithSelector$.subscribe({
  next: (data) => console.log('fromFetch(selector):', data),
  error: (err) => console.error('fromFetch(selector) error:', err)
});

// Fetch with retry and timeout
const fetchWithRetry$ = fromFetch('https://jsonplaceholder.typicode.com/posts/1', {
  selector: response => response.json()
}).pipe(
  timeout(5000),
  retry(3),
  catchError(err => {
    console.error('Fetch failed after retries:', err);
    return [];
  })
);

fetchWithRetry$.subscribe({
  next: (data) => console.log('fromFetch(with retry):', data)
});

// ============================================================================
// 3. webSocket() - Create Observable from WebSocket
// ============================================================================
/**
 * webSocket(): Creates a WebSocket Subject that wraps a WebSocket instance.
 * It can both send and receive messages.
 */

console.log('\n=== webSocket() Examples ===');

// Note: WebSocket requires a WebSocket server
// This is a conceptual example

function createWebSocketObservable(url: string): Observable<any> {
  const ws$ = webSocket({
    url: url,
    openObserver: {
      next: () => console.log('WebSocket connection opened')
    },
    closeObserver: {
      next: () => console.log('WebSocket connection closed')
    }
  });

  return ws$.asObservable();
}

// Usage example (commented out as it requires a WebSocket server)
/*
const ws$ = webSocket('ws://localhost:8080');

// Send message
ws$.next({ type: 'message', data: 'Hello Server' });

// Receive messages
ws$.subscribe({
  next: (msg) => console.log('WebSocket message:', msg),
  error: (err) => console.error('WebSocket error:', err),
  complete: () => console.log('WebSocket closed')
});

// Close connection
ws$.complete();
*/

// ============================================================================
// 4. fromEventPattern() - Create Observable from event handler functions
// ============================================================================
/**
 * fromEventPattern(): Creates an Observable from an API based on addHandler/removeHandler
 * functions. Useful for converting event-based APIs to Observables.
 */

console.log('\n=== fromEventPattern() Examples ===');

// Example with Node.js EventEmitter
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Convert EventEmitter to Observable
const eventPattern$ = fromEventPattern(
  (handler) => emitter.on('data', handler),      // addHandler
  (handler) => emitter.off('data', handler)      // removeHandler
);

eventPattern$.subscribe({
  next: (data) => console.log('fromEventPattern() event:', data)
});

// Emit some events
setTimeout(() => emitter.emit('data', 'Event 1'), 100);
setTimeout(() => emitter.emit('data', 'Event 2'), 200);
setTimeout(() => emitter.emit('data', 'Event 3'), 300);

// Example with DOM events (conceptual)
/*
const button = document.querySelector('button');
const click$ = fromEventPattern(
  (handler) => button.addEventListener('click', handler),
  (handler) => button.removeEventListener('click', handler)
);
*/

// Example with custom event API
class CustomEventSource {
  private handlers: Array<(data: any) => void> = [];

  addListener(handler: (data: any) => void) {
    this.handlers.push(handler);
  }

  removeListener(handler: (data: any) => void) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  emit(data: any) {
    this.handlers.forEach(handler => handler(data));
  }
}

const customSource = new CustomEventSource();
const customEvent$ = fromEventPattern(
  (handler) => customSource.addListener(handler),
  (handler) => customSource.removeListener(handler)
);

customEvent$.subscribe({
  next: (data) => console.log('Custom event:', data)
});

setTimeout(() => customSource.emit('Custom Event 1'), 400);
setTimeout(() => customSource.emit('Custom Event 2'), 500);

// ============================================================================
// 5. toPromise() / firstValueFrom() / lastValueFrom() - Convert to Promise
// ============================================================================
/**
 * Converting Observables to Promises:
 * - toPromise() (deprecated): Converts Observable to Promise
 * - firstValueFrom(): Returns a Promise that resolves with first value
 * - lastValueFrom(): Returns a Promise that resolves with last value
 */

console.log('\n=== Observable to Promise Examples ===');

import { of, interval } from 'rxjs';

// firstValueFrom - Get first value as Promise
async function exampleFirstValueFrom() {
  try {
    const firstValue = await firstValueFrom(
      interval(1000).pipe(take(5))
    );
    console.log('firstValueFrom():', firstValue);
  } catch (err) {
    console.error('firstValueFrom() error:', err);
  }
}

// lastValueFrom - Get last value as Promise
async function exampleLastValueFrom() {
  try {
    const lastValue = await lastValueFrom(
      of(1, 2, 3, 4, 5)
    );
    console.log('lastValueFrom():', lastValue);
  } catch (err) {
    console.error('lastValueFrom() error:', err);
  }
}

// Using with HTTP requests
async function fetchDataAsPromise() {
  try {
    const data = await firstValueFrom(
      fromFetch('https://jsonplaceholder.typicode.com/posts/1', {
        selector: response => response.json()
      }).pipe(
        timeout(5000),
        catchError(err => {
          console.error('Request failed:', err);
          throw err;
        })
      )
    );
    console.log('Fetched data:', data);
    return data;
  } catch (err) {
    console.error('Failed to fetch data:', err);
    throw err;
  }
}

// ============================================================================
// 6. Practical Examples
// ============================================================================

/**
 * Example: HTTP Service with retry and error handling
 */
class HttpService {
  get<T>(url: string): Observable<T> {
    return ajax.getJSON<T>(url).pipe(
      timeout(5000),
      retry(3),
      catchError(err => {
        console.error(`GET ${url} failed:`, err);
        throw err;
      })
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return ajax({
      url,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    }).pipe(
      map(response => response.response as T),
      timeout(5000),
      retry(3),
      catchError(err => {
        console.error(`POST ${url} failed:`, err);
        throw err;
      })
    );
  }
}

/**
 * Example: WebSocket Service
 */
class WebSocketService {
  private ws$: any;

  connect(url: string): Observable<any> {
    this.ws$ = webSocket(url);
    return this.ws$.asObservable();
  }

  send(message: any): void {
    if (this.ws$) {
      this.ws$.next(message);
    }
  }

  close(): void {
    if (this.ws$) {
      this.ws$.complete();
    }
  }
}

/**
 * Example: Event to Observable converter
 */
function createEventObservable<T>(
  target: EventTarget,
  eventName: string
): Observable<T> {
  return fromEventPattern<T>(
    (handler) => target.addEventListener(eventName, handler as EventListener),
    (handler) => target.removeEventListener(eventName, handler as EventListener)
  );
}

// Export for use in other files
export {
  HttpService,
  WebSocketService,
  createEventObservable,
  fetchDataAsPromise,
  exampleFirstValueFrom,
  exampleLastValueFrom
};

