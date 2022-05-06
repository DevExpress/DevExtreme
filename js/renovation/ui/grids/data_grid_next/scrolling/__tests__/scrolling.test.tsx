import React from 'react';
import { mount } from 'enzyme';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { DataGridNextScrolling, DataGridNextScrollingProps, viewFunction as ScrollingView } from '../scrolling';
import { ScrollingModeValue } from '../plugins';
import { VirtualScrolling } from '../virtual_scrolling';

describe('Scrolling', () => {
  describe('View', () => {
    it('value setter should be rendered when mode is not specified', () => {
      const viewProps = {
        props: new DataGridNextScrollingProps(),
      } as Partial<DataGridNextScrolling>;

      const tree = mount(<ScrollingView {...viewProps as any} />);
      const setters = tree.find(ValueSetter);

      expect(tree.children()).toHaveLength(1);
      expect(setters).toHaveLength(1);
      expect(setters.at(0).props().type).toBe(ScrollingModeValue);
      expect(setters.at(0).props().value).toEqual('standard');
    });

    it('value setter should be rendered when mode is standard', () => {
      const viewProps = {
        props: {
          mode: 'standard',
        },
      } as Partial<DataGridNextScrolling>;

      const tree = mount(<ScrollingView {...viewProps as any} />);
      const setters = tree.find(ValueSetter);

      expect(tree.children()).toHaveLength(1);
      expect(setters).toHaveLength(1);
      expect(setters.at(0).props().type).toBe(ScrollingModeValue);
      expect(setters.at(0).props().value).toEqual('standard');
    });

    it('value setter and virtual scrolling should be rendered when mode is virtual', () => {
      const viewProps = {
        props: {
          mode: 'virtual',
        },
        isVirtualScrolling: true,
        virtualScrollingMode: 'virtual',
      } as Partial<DataGridNextScrolling>;

      const tree = mount(<ScrollingView {...viewProps as any} />);
      const setters = tree.children(ValueSetter);
      const scrolling = tree.find(VirtualScrolling);

      expect(tree.children()).toHaveLength(2);
      expect(setters).toHaveLength(1);
      expect(setters.at(0).props().type).toBe(ScrollingModeValue);
      expect(setters.at(0).props().value).toEqual('virtual');
      expect(scrolling).toHaveLength(1);
      expect(scrolling.at(0).props().mode).toEqual('virtual');
    });

    it('value setter and virtual scrolling should be rendered when mode is infinite', () => {
      const viewProps = {
        props: {
          mode: 'infinite',
        },
        isVirtualScrolling: true,
        virtualScrollingMode: 'infinite',
      } as Partial<DataGridNextScrolling>;

      const tree = mount(<ScrollingView {...viewProps as any} />);
      const setters = tree.children(ValueSetter);
      const scrolling = tree.find(VirtualScrolling);

      expect(tree.children()).toHaveLength(2);
      expect(setters).toHaveLength(1);
      expect(setters.at(0).props().type).toBe(ScrollingModeValue);
      expect(setters.at(0).props().value).toEqual('infinite');
      expect(scrolling).toHaveLength(1);
      expect(scrolling.at(0).props().mode).toEqual('infinite');
    });
  });

  describe('Methods', () => {
    describe('isVirtualScrolling', () => {
      it('props.mode is not specified', () => {
        const scrolling = new DataGridNextScrolling(new DataGridNextScrollingProps());

        expect(scrolling.isVirtualScrolling).toBe(false);
      });

      it('props.mode is standard', () => {
        const scrolling = new DataGridNextScrolling({
          mode: 'standard',
        } as DataGridNextScrollingProps);

        expect(scrolling.isVirtualScrolling).toBe(false);
      });

      it('props.mode is virtual', () => {
        const scrolling = new DataGridNextScrolling({
          mode: 'virtual',
        } as DataGridNextScrollingProps);

        expect(scrolling.isVirtualScrolling).toBe(true);
      });

      it('props.mode is infinite', () => {
        const scrolling = new DataGridNextScrolling({
          mode: 'infinite',
        } as DataGridNextScrollingProps);

        expect(scrolling.isVirtualScrolling).toBe(true);
      });
    });

    describe('virtualScrollingMode', () => {
      it('props.mode is virtual', () => {
        const scrolling = new DataGridNextScrolling({
          mode: 'virtual',
        } as DataGridNextScrollingProps);

        expect(scrolling.virtualScrollingMode).toEqual('virtual');
      });

      it('props.mode is infinite', () => {
        const scrolling = new DataGridNextScrolling({
          mode: 'infinite',
        } as DataGridNextScrollingProps);

        expect(scrolling.virtualScrollingMode).toEqual('infinite');
      });
    });
  });
});
