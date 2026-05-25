import $ from '@js/core/renderer';

import { AreaItem } from '../area_item/m_area_item';

class TestAreaItem extends AreaItem {
  _getAreaName() {
    return 'row';
  }
}

const createMockComponent = () => ({
  option(name: string) {
    const options: Record<string, any> = {
      rtlEnabled: false,
      encodeHtml: true,
      onCellPrepared: null,
    };
    return options[name];
  },
  _eventsStrategy: {
    hasEvent: () => false,
  },
  _defaultActionArgs: () => ({}),
});

describe('PivotGrid expand icon accessibility', () => {
  let $container: any = null;

  beforeEach(() => {
    $container = $('<div>').appendTo('body');
  });

  afterEach(() => {
    $container.remove();
  });

  it('should set aria-expanded="true" on td when cell is expanded', () => {
    const areaItem = new TestAreaItem(createMockComponent());
    const tableData = [[{ expanded: true, text: 'Category' }]];

    areaItem.render($container, tableData);

    const $td = $container.find('td');
    expect($td.attr('aria-expanded')).toBe('true');
  });

  it('should set aria-expanded="false" on td when cell is collapsed', () => {
    const areaItem = new TestAreaItem(createMockComponent());
    const tableData = [[{ expanded: false, text: 'Category' }]];

    areaItem.render($container, tableData);

    const $td = $container.find('td');
    expect($td.attr('aria-expanded')).toBe('false');
  });

  it('should set tabindex="0" on td when cell has expand icon', () => {
    const areaItem = new TestAreaItem(createMockComponent());
    const tableData = [[{ expanded: true, text: 'Category' }]];

    areaItem.render($container, tableData);

    const $td = $container.find('td');
    expect($td.attr('tabindex')).toBe('0');
  });

  it('should not set tabindex on td when cell has no expand state', () => {
    const areaItem = new TestAreaItem(createMockComponent());
    const tableData = [[{ text: 'Plain cell' }]];

    areaItem.render($container, tableData);

    const $td = $container.find('td');
    expect($td.attr('tabindex')).toBeUndefined();
  });

  it('should not set aria-expanded on td when cell has no expand state', () => {
    const areaItem = new TestAreaItem(createMockComponent());
    const tableData = [[{ text: 'Plain cell' }]];

    areaItem.render($container, tableData);

    const $td = $container.find('td');
    expect($td.attr('aria-expanded')).toBeUndefined();
  });
});
