import {
  describe, expect, it,
} from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { ProcessedItem, RawItemData } from '../data_controller/types';
import {
  getDataFromRowItems,
  isAIColumnAutoMode,
  isEditorOptions,
  isKeyMissingInData,
  isPopupOptions,
  isPromptOption,
  isRefreshOption,
  reduceDataCachedKeys,
} from './utils';

describe('reduceDataCachedKeys', () => {
  it('should remove keys from data that are present in cachedKeys', () => {
    const data = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
    ];
    const cachedData = {
      b: 'test b',
      c: 'test c',
    };
    const result = reduceDataCachedKeys(data, cachedData, (item) => item.key as PropertyKey);
    expect(result).toEqual(
      { a: { key: 'a', value: '1' } },
    );
  });

  it('should return the original data if no keys are cached', () => {
    const data = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
    ];
    const cachedKeys = {};
    const result = reduceDataCachedKeys(data, cachedKeys, (item) => item.key as PropertyKey);
    expect(result).toEqual({
      a: { key: 'a', value: '1' },
      b: { key: 'b', value: '2' },
      c: { key: 'c', value: '3' },
    });
  });

  it('should return empty object if all keys are cached', () => {
    const data = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
    ];
    const cachedData = {
      a: 'test a',
      b: 'test b',
      c: 'test c',
    };
    const result = reduceDataCachedKeys(data, cachedData, (item) => item.key as PropertyKey);
    expect(result).toEqual({ });
  });

  it('should handle number keys', () => {
    const data = [
      { key: 1, value: '1' },
      { key: 2, value: '2' },
      { key: 3, value: '3' },
    ];
    const cachedKeys = {
      2: 'two',
      3: 'three',
    };
    const result = reduceDataCachedKeys(data, cachedKeys, (item) => item.key as PropertyKey);
    expect(result).toEqual({
      1: { key: 1, value: '1' },
    });
  });
});

describe('isKeyMissingInData', () => {
  it('should return false when a primitive key is present in all rows', () => {
    const data: RawItemData[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    expect(isKeyMissingInData(data, 'id')).toBe(false);
  });

  it('should return true when a primitive key is missing from a row', () => {
    const data: RawItemData[] = [
      { id: 1, name: 'A' },
      { name: 'B' },
    ];
    expect(isKeyMissingInData(data, 'id')).toBe(true);
  });

  it('should return false when a primitive key is present but null or undefined', () => {
    const data: RawItemData[] = [
      { id: null, name: 'A' },
      { id: undefined, name: 'B' },
    ];
    expect(isKeyMissingInData(data, 'id')).toBe(false);
  });

  it('should return false when all compound key fields are present in all rows', () => {
    const data: RawItemData[] = [
      { id1: 1, id2: 'a' },
      { id1: 2, id2: 'b' },
    ];
    expect(isKeyMissingInData(data, ['id1', 'id2'])).toBe(false);
  });

  it('should return true when a compound key subfield is missing from a row', () => {
    const data: RawItemData[] = [
      { id1: 1, id2: 'a' },
      { id1: 2 },
    ];
    expect(isKeyMissingInData(data, ['id1', 'id2'])).toBe(true);
  });

  it('should return false when a function key expression resolves for all rows', () => {
    const data: RawItemData[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    expect(isKeyMissingInData(data, (row) => row.id)).toBe(false);
  });

  it('should return true when a function key expression cannot resolve a row', () => {
    const data: RawItemData[] = [
      { id: 1, name: 'A' },
      { name: 'B' },
    ];
    expect(isKeyMissingInData(data, (row) => row.id)).toBe(true);
  });

  it('should return false for empty data', () => {
    expect(isKeyMissingInData([], 'id')).toBe(false);
  });
});

describe('getDataFromRowItems', () => {
  it('should extract data rows correctly', () => {
    const items = [
      {
        data: { id: 1, value: 'one' },
        key: 'id',
        rowType: 'data',
      },
      {
        data: { id: 2, value: 'two' },
        key: 'id',
        rowType: 'data',
      },
      {
        data: { id: 3, value: 'three' },
        key: 'id',
        rowType: 'data',
      },
    ] as unknown as ProcessedItem[];
    const result = getDataFromRowItems(items);
    expect(result).toEqual([
      { id: 1, value: 'one' },
      { id: 2, value: 'two' },
      { id: 3, value: 'three' },
    ]);
  });
  it('should ignore non-data rows', () => {
    const items = [
      {
        data: { id: 1, value: 'one' },
        key: 'id',
        rowType: 'data',
      },
      {
        data: { id: 4, value: 'four' },
        key: 'id',
        rowType: 'group',
      },
    ] as unknown as ProcessedItem[];
    const result = getDataFromRowItems(items);
    expect(result).toEqual([
      { id: 1, value: 'one' },
    ]);
  });
});

describe('isAIColumnAutoMode', () => {
  it('should return true for AI columns in auto mode', () => {
    const column = {
      type: 'ai',
      ai: {
        mode: 'auto',
      },
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(true);
  });

  it('should return false for AI columns in manual mode', () => {
    const column = {
      type: 'ai',
      ai: {
        mode: 'manual',
      },
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(false);
  });

  it('should return false for non-AI columns', () => {
    const column = {
      type: 'buttons',
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(false);
  });

  it('should return true by default', () => {
    const column = {
      type: 'ai',
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(true);
  });
});

describe('isPopupOptions', () => {
  it('should return true for popup option names', () => {
    expect(isPopupOptions('ai.popup.width', 200)).toBe(true);
    expect(isPopupOptions('ai.popup', { width: 200 })).toBe(true);
    expect(isPopupOptions('ai', {
      popup: {
        width: 300,
      },
    })).toBe(true);
    expect(isPopupOptions('ai', {
      popup: {
        width: 300,
      },
      prompt: 'Test',
    })).toBe(true);
  });

  it('should return false for non-popup option names', () => {
    expect(isPopupOptions('ai.editorOptions.width', {})).toBe(false);
    expect(isPopupOptions('ai.prompt', {})).toBe(false);
    expect(isPopupOptions('ai', {
      editorOptions: {
        width: 300,
      },
    })).toBe(false);
    expect(isPopupOptions('ai', {
      editorOptions: {
        width: 300,
      },
      prompt: 'Test',
    })).toBe(false);
  });
});

describe('isEditorOptions', () => {
  it('should return true for editorOptions option names', () => {
    expect(isEditorOptions('ai.editorOptions.width', 200)).toBe(true);
    expect(isEditorOptions('ai.editorOptions', { width: 200 })).toBe(true);
    expect(isEditorOptions('ai', {
      editorOptions: {
        width: 300,
      },
    })).toBe(true);
    expect(isEditorOptions('ai', {
      editorOptions: {
        width: 300,
      },
      prompt: 'Test',
    })).toBe(true);
  });

  it('should return false for non-editorOptions option names', () => {
    expect(isEditorOptions('ai.popup.width', {})).toBe(false);
    expect(isEditorOptions('ai.prompt', {})).toBe(false);
    expect(isEditorOptions('ai', {
      popup: {
        width: 300,
      },
    })).toBe(false);
    expect(isEditorOptions('ai', {
      popup: {
        width: 300,
      },
      prompt: 'Test',
    })).toBe(false);
  });
});

describe('isPromptOption', () => {
  it('should return true for prompt option names', () => {
    expect(isPromptOption('ai.prompt', 'Test prompt')).toBe(true);
    expect(isPromptOption('ai', {
      prompt: 'Test prompt',
    })).toBe(true);
    expect(isPromptOption('ai', {
      prompt: 'Test prompt',
      popup: { width: 300 },
    })).toBe(true);
  });

  it('should return false for non-prompt option names', () => {
    expect(isPromptOption('ai.popup.width', {})).toBe(false);
    expect(isPromptOption('ai.editorOptions', {})).toBe(false);
    expect(isPromptOption('ai', {
      editorOptions: {
        width: 300,
      },
    })).toBe(false);
    expect(isPromptOption('ai', {
      popup: {
        width: 300,
      },
    })).toBe(false);
  });
});

describe('isRefreshOption', () => {
  it('should return true for refresh option names', () => {
    expect(isRefreshOption('ai.showHeaderMenu', true)).toBe(true);
    expect(isRefreshOption('ai.noDataText', 'No data')).toBe(true);
    expect(isRefreshOption('ai.emptyText', 'Empty')).toBe(true);
    expect(isRefreshOption('ai', {
      showHeaderMenu: true,
    })).toBe(true);
    expect(isRefreshOption('ai', {
      noDataText: 'No data',
    })).toBe(true);
    expect(isRefreshOption('ai', {
      emptyText: 'Empty',
    })).toBe(true);
    expect(isRefreshOption('ai', {
      showHeaderMenu: true,
      prompt: 'Test',
    })).toBe(true);
  });

  it('should return false for non-refresh option names', () => {
    expect(isRefreshOption('ai.popup.width', {})).toBe(false);
    expect(isRefreshOption('ai.prompt', {})).toBe(false);
    expect(isRefreshOption('ai.editorOptions', {})).toBe(false);
    expect(isRefreshOption('ai', {
      popup: {
        width: 300,
      },
    })).toBe(false);
    expect(isRefreshOption('ai', {
      editorOptions: {
        width: 300,
      },
    })).toBe(false);
    expect(isRefreshOption('ai', {
      prompt: 'Test',
    })).toBe(false);
  });
});
