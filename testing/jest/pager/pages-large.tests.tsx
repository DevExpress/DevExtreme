/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import { h } from 'preact';
import { mount } from 'enzyme';
import type { LargePagesPropsType } from '../../../js/renovation/pager/pages-large.p';
import PagesComponent from '../../../js/renovation/pager/pages-large.p';
import Page from '../../../js/renovation/pager/page.p';
import Pages from '../../../js/renovation/pager/pages-large';

describe('Pager pages', () => {
  const render = (props: LargePagesPropsType) => mount(<PagesComponent {...props} />);

  it('render all pages text', () => {
    const pages = render({ pageCount: 3, maxPagesCount: 3, pageIndex: 2 });
    expect(pages.find(Page)).toHaveLength(3);
    expect(pages.find(Page).map((p) => p.text())).toEqual(['1', '2', '3']);
  });
  it('render all pages selected', () => {
    const pages = render({ pageCount: 3, maxPagesCount: 3, pageIndex: 1 });
    expect(pages.find(Page).map((p) => p.prop('selected'))).toEqual([false, true, false]);
  });
  it('render all limited pages text', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
  });
  it('calculate pages for pageIndex = 0', () => {
    const pages = new Pages({ pageCount: 30, maxPagesCount: 10, pageIndex: 0 });
    expect(pages.pages.map((p) => p && p.index)).toEqual([0, 1, 2, 3, 4, null, 29]);
  });
  it('calculate pages for pageIndex = 1', () => {
    const pages = new Pages({ pageCount: 30, maxPagesCount: 10, pageIndex: 1 });
    expect(pages.pages.map((p) => p && p.index)).toEqual([0, 1, 2, 3, 4, null, 29]);
  });
  it('calculate pages for pageIndex = pageCount - 1 (last page)', () => {
    const pages = new Pages({ pageCount: 30, maxPagesCount: 10, pageIndex: 29 });
    expect(pages.pages.map((p) => p && p.index)).toEqual([0, null, 25, 26, 27, 28, 29]);
  });
  it('calculate pages for pageIndex = pageCount - 2 (last page - 1)', () => {
    const pages = new Pages({ pageCount: 30, maxPagesCount: 10, pageIndex: 28 });
    expect(pages.pages.map((p) => p && p.index)).toEqual([0, null, 25, 26, 27, 28, 29]);
  });
  it('calculate pages for pageIndex = 2', () => {
    const pages = new Pages({ pageCount: 30, maxPagesCount: 3, pageIndex: 2 });
    expect(pages.pages.map((p) => p && p.index)).toEqual([0, 1, 2, 3, 4, null, 29]);
  });
  it('calulate pages for rtlEnabled', () => {
    const pages = new Pages({
      rtlEnabled: true, pageCount: 30, maxPagesCount: 3, pageIndex: 3,
    });
    expect(pages.pages.map((p) => p && p.index)).toEqual([29, null, 5, 4, 3, 2, null, 0]);
  });
  it('update selection: pageIndex changed to low range limit', () => {
    // const pages = new Pages({ pageCount: 30, maxPagesCount: 10, pageIndex: 20 });
    // expect(pages.pages.map(p => p && p.index)).toEqual([0, null, 20, 21, 22, 23, null, 29]);
    // pages.pages[3].onClick()
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '4').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '5').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 4 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
  });
  it('update selection: pageIndex changed to high range limit', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '4').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '6').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 5 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '4', '5', '6', '7', '. . .', '30']);
  });
  it('update selection: !pageIndex changed to high range limit', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '4').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '5').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 4 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    pages.findWhere((c) => c.text() === '6').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 5 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '4', '5', '6', '7', '. . .', '30']);
  });
  it('update selection: from has low delimiter to no', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '4').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '3').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 1 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '30']);
  });
  it('update selection: from has high delimiter to no', () => {
    const pages = render({ pageCount: 7, maxPagesCount: 3, pageIndex: 2 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '7']);
    expect(pages.findWhere((c) => c.text() === '3').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '5').at(0).props().onClick();
    pages.setProps({ pageCount: 7, maxPagesCount: 3, pageIndex: 4 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '7']);
  });
  it('update selection: from pageIndex pageCount - 2 -> pageCount - 1', () => {
    const pages = render({ pageCount: 7, maxPagesCount: 3, pageIndex: 5 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '7']);
    expect(pages.findWhere((c) => c.text() === '6').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '7').at(0).props().onClick();
    pages.setProps({ pageCount: 7, maxPagesCount: 3, pageIndex: 6 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '7']);
  });
  it('update selection: from pageIndex 0 -> 1', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 0 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '1').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '2').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 1 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '30']);
  });
  it('update selection: from pageIndex 1 -> 0', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 1 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '2').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '1').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 0 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '30']);
  });
  it('update selection: new pageIndex out of min range limit', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '4').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '5').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 1 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '2', '3', '4', '5', '. . .', '30']);
  });
  it('update selection: new pageIndex out of max range limit', () => {
    const pages = render({ pageCount: 30, maxPagesCount: 3, pageIndex: 3 });
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    expect(pages.findWhere((c) => c.text() === '4').at(0).props().selected).toBeTruthy();
    pages.findWhere((c) => c.text() === '5').at(0).props().onClick();
    pages.setProps({ pageCount: 30, maxPagesCount: 3, pageIndex: 20 });
    pages.update();
    expect(pages.children().map((p) => p.text())).toEqual(['1', '. . .', '20', '21', '22', '23', '. . .', '30']);
  });
});
