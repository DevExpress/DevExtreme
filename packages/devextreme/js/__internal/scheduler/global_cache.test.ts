import {
  describe, expect, it, jest,
} from '@jest/globals';

import { Cache } from './global_cache';

describe('global cache', () => {
  it('should be empty at initialization', () => {
    const cache = new Cache();
    expect(cache.size).toBe(0);
  });

  it('should get non-existed value', () => {
    const cache = new Cache();

    expect(cache.get('test0')).toBe(undefined);
  });

  it('should get existed value', () => {
    const cache = new Cache();
    cache.memo('test0', () => 'callbackValue');

    expect(cache.get('test0')).toBe('callbackValue');
  });

  it('should memo value', () => {
    const cache = new Cache();
    const valueCallback = jest.fn().mockReturnValue(1).mockReturnValueOnce(2);
    const memoValue = cache.memo('test', valueCallback);

    expect(cache.get('test')).toBe(memoValue);
    expect(cache.size).toBe(1);
  });

  it('should memo twice for deleted value', () => {
    const cache = new Cache();
    const valueCallback1 = jest.fn().mockReturnValue(1).mockReturnValueOnce(2);
    const valueCallback2 = jest.fn().mockReturnValue(1).mockReturnValueOnce(2);
    const memoValue1 = cache.memo('test1', valueCallback1);
    const memoValue2 = cache.memo('test2', valueCallback2);
    cache.delete('test1');

    expect(cache.size).toBe(1);
    expect(cache.memo('test1', valueCallback1)).not.toBe(memoValue1);
    expect(cache.memo('test2', valueCallback2)).toBe(memoValue2);
    expect(cache.size).toBe(2);
  });

  it('should delete existed value', () => {
    const cache = new Cache();
    cache.memo('test1', () => 'callbackValue1');
    cache.delete('test1');

    expect(cache.get('test1')).toBe(undefined);
    expect(cache.size).toBe(0);
  });

  it('should delete non-existed value', () => {
    const cache = new Cache();
    cache.memo('test1', () => 'callbackValue1');
    cache.memo('test2', () => 'callbackValue2');
    cache.delete('non-existed');

    expect(cache.size).toBe(2);
  });

  it('should clear all values', () => {
    const cache = new Cache();
    cache.memo('test0', () => 'callbackValue');
    cache.memo('test1', () => 'callbackValue');
    cache.clear();

    expect(cache.size).toBe(0);
  });
});
