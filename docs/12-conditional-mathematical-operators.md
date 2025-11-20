# Conditional & Mathematical Operators

## Overview

Conditional operators check conditions on Observables, while mathematical operators perform calculations on numeric streams.

## Conditional Operators

### defaultIfEmpty()

Emits a default value if the Observable is empty.

**Use Case**: Providing fallback values

```typescript
import { EMPTY, of } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';

EMPTY.pipe(
  defaultIfEmpty('No values')
).subscribe(console.log);
// Output: 'No values'

of(1, 2, 3).pipe(
  defaultIfEmpty('No values')
).subscribe(console.log);
// Output: 1, 2, 3 (default not used)
```

### every()

Checks if all values match a predicate.

**Use Case**: Validation, checking conditions

```typescript
import { of } from 'rxjs';
import { every } from 'rxjs/operators';

of(2, 4, 6, 8).pipe(
  every(x => x % 2 === 0)
).subscribe(console.log);
// Output: true

of(2, 4, 5, 8).pipe(
  every(x => x % 2 === 0)
).subscribe(console.log);
// Output: false
```

### isEmpty()

Checks if the Observable is empty.

**Use Case**: Checking for data

```typescript
import { EMPTY, of } from 'rxjs';
import { isEmpty } from 'rxjs/operators';

EMPTY.pipe(
  isEmpty()
).subscribe(console.log);
// Output: true

of(1, 2, 3).pipe(
  isEmpty()
).subscribe(console.log);
// Output: false
```

### sequenceEqual()

Compares two Observables for equality.

**Use Case**: Testing, validation

```typescript
import { of } from 'rxjs';
import { sequenceEqual } from 'rxjs/operators';

const obs1 = of(1, 2, 3);
const obs2 = of(1, 2, 3);
const obs3 = of(1, 2, 4);

obs1.pipe(
  sequenceEqual(obs2)
).subscribe(console.log);
// Output: true

obs1.pipe(
  sequenceEqual(obs3)
).subscribe(console.log);
// Output: false
```

## Mathematical Operators

### count()

Counts the number of emissions.

**Use Case**: Counting items, statistics

```typescript
import { of } from 'rxjs';
import { count } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  count()
).subscribe(console.log);
// Output: 5

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  count(x => x % 2 === 0)
).subscribe(console.log);
// Output: 5 (count of even numbers)
```

### max()

Finds the maximum value.

**Use Case**: Finding maximum, statistics

```typescript
import { of } from 'rxjs';
import { max } from 'rxjs/operators';

of(5, 2, 8, 1, 9, 3).pipe(
  max()
).subscribe(console.log);
// Output: 9

of(
  { value: 5 },
  { value: 2 },
  { value: 8 }
).pipe(
  max((a, b) => a.value - b.value)
).subscribe(console.log);
// Output: { value: 8 }
```

### min()

Finds the minimum value.

**Use Case**: Finding minimum, statistics

```typescript
import { of } from 'rxjs';
import { min } from 'rxjs/operators';

of(5, 2, 8, 1, 9, 3).pipe(
  min()
).subscribe(console.log);
// Output: 1
```

## Best Practices

1. **Use `defaultIfEmpty()` for fallbacks** - Better user experience
2. **Use `every()` for validation** - Check all conditions
3. **Use `isEmpty()` to check data** - Before processing
4. **Use `count()` for statistics** - Simple counting
5. **Use `max()`/`min()` for extremes** - Finding boundaries

## Common Patterns

### Pattern 1: Validation

```typescript
formValues$.pipe(
  every(value => value !== null && value !== undefined)
).subscribe(isValid => {
  if (isValid) {
    submitForm();
  }
});
```

### Pattern 2: Statistics

```typescript
data$.pipe(
  toArray(),
  map(array => ({
    count: array.length,
    max: Math.max(...array),
    min: Math.min(...array),
    sum: array.reduce((a, b) => a + b, 0)
  }))
).subscribe(stats => console.log(stats));
```

### Pattern 3: Default Values

```typescript
apiData$.pipe(
  defaultIfEmpty([])
).subscribe(data => {
  if (data.length === 0) {
    showEmptyState();
  }
});
```

## Related Concepts

- [Transformation Operators](./03-transformation-operators.md)
- [Utility Operators](./10-utility-operators.md)
- [Error Handling](./07-error-handling.md)

