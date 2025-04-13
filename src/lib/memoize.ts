/**
 * Function signature for a memoizable function.
 */
// export type MemoizableFunction<T extends unknown[], R> = (...args: T) => R;

/**
 * Default function to create a cache key from arguments.
 * @param args - Function arguments
 * @returns String key for cache lookup
 */
function defaultKeyFn(...args: unknown[]): string {
  return JSON.stringify(args);
}

/**
 * Creates a memoized version of a function that caches its results.
 *
 * @example
 * // Memoize an expensive calculation
 * const expensiveCalculation = (a: number, b: number) => {
 *   // Simulate expensive operation
 *   console.log('Calculating...');
 *   return a * b;
 * };
 *
 * const memoizedCalculation = memoize(expensiveCalculation);
 *
 * memoizedCalculation(5, 10); // Logs "Calculating..." and returns 50
 * memoizedCalculation(5, 10); // Returns 50 without logging
 *
 * @param fn - The function to memoize
 * @param keyFn - Optional function to create cache keys
 * @param maxSize - Optional maximum cache size (default: 100)
 * @returns Memoized function with the same signature as the original
 */
export function memoize<T extends unknown[], R>(
  fn: any,
  keyFn: (...args: T) => string = defaultKeyFn as any,
  maxSize = 100
): any {
  const cache = new Map<string, R>();
  const keys: string[] = [];

  return function (...args: T): R {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key) as R;
    }

    const result = fn(...args);

    // Handle cache size limit
    if (keys.length >= maxSize) {
      const oldestKey = keys.shift();
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }

    keys.push(key);
    cache.set(key, result);

    return result;
  };
}

/**
 * Creates a memoized function that only keeps the most recent result.
 * Useful for functions that are called repeatedly with the same arguments
 * in rapid succession.
 *
 * @param fn - The function to memoize
 * @returns Memoized function with the same signature as the original
 */
export function memoizeOne<T extends unknown[], R>(
  fn: any,
  keyFn: (...args: T) => string = defaultKeyFn as any
): any {
  let lastKey: string | undefined;
  let lastResult: R | undefined;

  return function (...args: T): any {
    const key = keyFn(...args);

    if (key === lastKey) {
      return lastResult as R;
    }

    lastKey = key;
    lastResult = fn(...args);

    return lastResult;
  };
}
