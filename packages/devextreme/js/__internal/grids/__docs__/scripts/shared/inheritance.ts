import { stripOuterMixin } from './ast-helpers';
import type { HeritageInfo } from './types';

export interface BuildChainOptions {
  /** Maximum recursion depth. Default: no limit (relies on visited set). */
  maxDepth?: number;
  /** Format a mixin name before pushing to chain (e.g. add "[mixin] " prefix). */
  formatMixin?: (mixin: string) => string;
  /**
   * Map rawBase to the key used for class-map lookup and recursion.
   * Default: identity (use rawBase as-is).
   */
  resolveNext?: (rawBase: string) => string | null;
  /**
   * Called when the resolved key is not found in the class map.
   * Return extra chain entries for well-known terminal nodes.
   * Default: no extra entries.
   */
  onTerminal?: (rawBase: string) => string[];
  /** Called when a cycle is detected (className already in visited set). */
  onCycle?: (className: string) => void;
}

/**
 * Core recursive algorithm for building an inheritance chain.
 *
 * Steps:
 * 1. Check visited set (+ optional depth limit)
 * 2. Look up class info via `getClassInfo`
 * 3. Collect mixins into chain
 * 4. Strip outermost mixin wrapper from baseClass
 * 5. Push rawBase into chain
 * 6. Recurse if the resolved key exists in the class map
 *
 * Both `grid_core` and `data_grid` resolvers use this with different hooks.
 */
export function buildInheritanceChainCore(
  className: string,
  getClassInfo: (name: string) => HeritageInfo | undefined,
  visited: Set<string>,
  options: BuildChainOptions = {},
  depth = 0,
): string[] {
  const {
    maxDepth, formatMixin, resolveNext, onTerminal, onCycle,
  } = options;

  if (visited.has(className)) {
    onCycle?.(className);
    return [];
  }
  if (maxDepth !== undefined && depth > maxDepth) {
    return [];
  }
  visited.add(className);

  const info = getClassInfo(className);
  if (!info?.baseClass) {
    return [];
  }

  const chain: string[] = [];

  info.mixins.forEach((mixin) => {
    chain.push(formatMixin ? formatMixin(mixin) : mixin);
  });

  const rawBase = stripOuterMixin(info.baseClass);
  chain.push(rawBase);

  const nextKey = resolveNext ? resolveNext(rawBase) : rawBase;
  if (nextKey !== null && getClassInfo(nextKey)) {
    chain.push(...buildInheritanceChainCore(nextKey, getClassInfo, visited, options, depth + 1));
  } else if (onTerminal) {
    chain.push(...onTerminal(rawBase));
  }

  return chain;
}
