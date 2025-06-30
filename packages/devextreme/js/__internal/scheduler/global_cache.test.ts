import {
  describe, expect, it,
} from '@jest/globals';

import { Cache } from './global_cache';

describe('global cache', () => {
  it('Initialization: should be empty', () => {
    const cache = new Cache();
    expect(cache.size).toBe(0);
  });

  it('API: should get and set', () => {
    const cache = new Cache();
    cache.set('test', 'value');

    expect(cache.size).toBe(1);
    expect(cache.get('test')).toBe('value');
  });

  it('API: get with callback', () => {
    const cache = new Cache();
    cache.get('test', () => 'callbackValue');

    expect(cache.size).toBe(1);
    expect(cache.get('test')).toBe('callbackValue');
  });

  it('API: clear', () => {
    const cache = new Cache();
    cache.set('test0', () => 'callbackValue');
    cache.set('test1', 'value');
    cache.clear();

    expect(cache.size).toBe(0);
  });
});
