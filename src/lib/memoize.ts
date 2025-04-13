/**
 * Function signature for a memoizable function.
 * Represents any function with parameters and a return value that can be memoized.
 * 
 * @template T - Array of parameter types
 * @template R - Return type of the function
 */
export type MemoizableFunction<T extends unknown[], R> = (...args: T) => R;

/**
 * Default function to create a cache key from arguments.
 * Uses JSON.stringify to convert arguments to a string representation.
 * 
 * @param args - Function arguments of any type
 * @returns String key for cache lookup
 */
function defaultKeyFn(...args: unknown[]): string {
  return JSON.stringify(args);
}

/**
 * Creates a memoized version of a function that caches its results.
 * Caches the return values based on input parameters to avoid redundant computations.
 * Implements an LRU (Least Recently Used) cache eviction policy when maxSize is reached.
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
 * memoizedCalculation(5, 10); // Returns 50 without logging (from cache)
 * 
 * // With custom key function
 * const userLookup = (user: {id: number, name: string}) => {
 *   console.log('Looking up user...');
 *   return fetchUserData(user.id);
 * };
 * 
 * // Only use id for cache key
 * const memoizedLookup = memoize(
 *   userLookup, 
 *   (user) => String(user.id)
 * );
 *
 * @template T - Array of parameter types
 * @template R - Return type of the function
 * @param {MemoizableFunction<T, R>} fn - The function to memoize
 * @param {(...args: T) => string} [keyFn=defaultKeyFn] - Optional function to create cache keys
 * @param {number} [maxSize=100] - Optional maximum cache size
 * @returns {MemoizableFunction<T, R>} Memoized function with the same signature as the original
 */
export function memoize<T extends unknown[], R>(
  fn: MemoizableFunction<T, R>,
  keyFn: (...args: T) => string = defaultKeyFn as any,
  maxSize = 100
): MemoizableFunction<T, R> {
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
 * in rapid succession, or for implementing referential equality checks.
 *
 * @example
 * // Useful for component props optimization
 * const getDisplayData = (userId: string, filters: string[]) => {
 *   console.log('Processing data...');
 *   return processUserData(userId, filters);
 * };
 * 
 * const memoizedGetData = memoizeOne(getDisplayData);
 * 
 * // Only recalculates when inputs change
 * memoizedGetData('user123', ['active']); // Logs and processes
 * memoizedGetData('user123', ['active']); // Returns cached result
 * memoizedGetData('user123', ['inactive']); // Logs and processes (inputs changed)
 * 
 * @template T - Array of parameter types
 * @template R - Return type of the function
 * @param {MemoizableFunction<T, R>} fn - The function to memoize
 * @param {(...args: T) => string} [keyFn=defaultKeyFn] - Optional function to create cache keys
 * @returns {MemoizableFunction<T, R>} Memoized function with the same signature as the original
 */
export function memoizeOne<T extends unknown[], R>(
  fn: MemoizableFunction<T, R>,
  keyFn: (...args: T) => string = defaultKeyFn as any
): MemoizableFunction<T, R> {
  let lastKey: string | undefined;
  let lastResult: R | undefined;

  return function (...args: T): R {
    const key = keyFn(...args);

    if (key === lastKey) {
      return lastResult as R;
    }

    lastKey = key;
    lastResult = fn(...args);

    return lastResult;
  };
}
