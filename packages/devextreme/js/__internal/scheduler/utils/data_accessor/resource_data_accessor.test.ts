import {
  describe, expect, it,
} from '@jest/globals';

import type { RawResourceData } from '../loader/types';
import { ResourceDataAccessor } from './resource_data_accessor';

describe('ResourceDataAccessor', () => {
  describe('default id, text and color', () => {
    const defaultResource: any = { id: 0, text: 'Room 1', color: '#aaa' };
    const defaultAccessor = new ResourceDataAccessor({
      fieldExpr: 'roomId',
      dataSource: [],
      label: 'Room',
    });
    it('should get fields', () => {
      expect(defaultAccessor.get('id', defaultResource)).toBe(defaultResource.id);
      expect(defaultAccessor.get('text', defaultResource)).toBe(defaultResource.text);
      expect(defaultAccessor.get('color', defaultResource)).toBe(defaultResource.color);
    });

    it('should set fields', () => {
      defaultAccessor.set('id', defaultResource, 10);
      defaultAccessor.set('text', defaultResource, 'text');
      defaultAccessor.set('color', defaultResource, 'color');

      expect(defaultResource.id).toBe(10);
      expect(defaultResource.text).toBe('text');
      expect(defaultResource.color).toBe('color');
    });
  });

  describe('overloaded id, text and color', () => {
    const customResource: any = { complex: { item: { guid: '0' } }, name: 'Room 1', mainColor: '#aaa' };
    const accessor = new ResourceDataAccessor({
      fieldExpr: 'roomId',
      dataSource: [],
      valueExpr: 'complex.item.guid',
      displayExpr: 'name',
      colorExpr: 'mainColor',
      label: 'Room',
    });

    it('should get overloaded fields', () => {
      expect(accessor.get('id', customResource)).toBe(customResource.complex.item.guid);
      expect(accessor.get('text', customResource)).toBe(customResource.name);
      expect(accessor.get('color', customResource)).toBe(customResource.mainColor);
    });

    it('should set overloaded fields', () => {
      accessor.set('id', customResource, 10);
      accessor.set('text', customResource, 'text');
      accessor.set('color', customResource, 'color');

      expect(customResource.complex.item.guid).toBe(10);
      expect(customResource.name).toBe('text');
      expect(customResource.mainColor).toBe('color');
    });
  });

  describe('function valueExpr/displayExpr', () => {
    const customResource: any = { complex: { item: { guid: '0' } }, name: 'Room 1' };
    const accessor = new ResourceDataAccessor({
      fieldExpr: 'roomId',
      dataSource: [],
      valueExpr: (resource: any) => resource.complex.item.guid,
      displayExpr: (resource: any) => resource.name,
      label: 'Room',
    });

    it('should get fields via a function expression', () => {
      expect(accessor.get('id', customResource)).toBe(customResource.complex.item.guid);
      expect(accessor.get('text', customResource)).toBe(customResource.name);
    });

    it('should not throw when setting a field defined by a function expression', () => {
      expect(() => accessor.set('id', customResource, 10)).not.toThrow();
      expect(() => accessor.set('text', customResource, 'text')).not.toThrow();
    });
  });

  describe('parentId', () => {
    const hierarchicalResource: RawResourceData = { id: 11, text: 'Room 11', parentId: 'board' };
    const accessor = new ResourceDataAccessor({
      fieldExpr: 'roomId',
      dataSource: [],
      parentIdExpr: 'parentId',
      label: 'Room',
    });

    it('should get parentId with default parentIdExpr', () => {
      expect(accessor.get('parentId', hierarchicalResource)).toBe('board');
    });

    it('should set parentId with default parentIdExpr', () => {
      accessor.set('parentId', hierarchicalResource, 'open');

      expect(hierarchicalResource.parentId).toBe('open');
    });
  });
});
