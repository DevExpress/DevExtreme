import {
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import Sortable from '@js/ui/sortable';

describe('Draggable dispose safety', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should not crash on _stopAnimator when _scrollAnimator is not initialized', () => {
    const $container = $('<div>').appendTo(document.body);
    const sortable = new Sortable($container.get(0), {});

    (sortable as any)._scrollAnimator = undefined;

    expect(() => {
      sortable.dispose();
    }).not.toThrow();
  });
});
