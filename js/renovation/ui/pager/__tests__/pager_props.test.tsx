import { PagerProps, InternalPagerProps } from '../common/pager_props';

describe('Pager props', () => {
  describe('PagerProps', () => {
    it('should have correct default values', () => {
      const props = new PagerProps();
      expect(props.pageSize).toBe(5);
      expect(props.pageIndex).toBe(1);
    });
  });

  describe('InternalPagerProps', () => {
    it('should have correct default values', () => {
      const props = new InternalPagerProps();
      expect(props.pageSize).toBe(5);
      expect(props.pageIndex).toBe(1);
    });
  });
});
