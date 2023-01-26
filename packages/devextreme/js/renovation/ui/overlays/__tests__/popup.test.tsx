import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as PopupView, PopupProps, Popup } from '../popup';

jest.mock('../../../../ui/popup', () => jest.fn());

describe('Popup', () => {
  describe('View', () => {
    it('should render', () => {
      const componentProps = new PopupProps();
      const props = {
        componentProps: { restProps: componentProps },
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Popup>;

      expect(() => {
        shallow(<PopupView {...props as any} /> as any);
      }).not.toThrow();
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('saveInstance', () => {
        it('should save instance', () => {
          const mockCallback = jest.fn();
          const popup: any = new Popup({
            ...new PopupProps(),
            visible: true,
          });
          const instance = { option: mockCallback };

          popup.domComponentWrapperRef = {
            current: {
              getInstance: () => instance,
            },
          };

          popup.saveInstance();
          expect(popup.instance).toEqual(instance);
        });

        it('should not fail if ref has no "current"', () => {
          const popup: any = new Popup({
            ...new PopupProps(),
            visible: true,
          });

          popup.domComponentWrapperRef = {};

          expect(() => { popup.saveInstance(); }).not.toThrow();
        });
      });

      describe('setHideEventListener', () => {
        it('should set the "onHiding" event listener to instance', () => {
          const mockCallback = jest.fn();
          const popup: any = new Popup({
            ...new PopupProps(),
            visible: true,
          });

          popup.instance = { option: mockCallback };

          popup.setHideEventListener();
          expect(mockCallback).toBeCalledTimes(1);
        });

        it('should set correct "onHiding" event', () => {
          const mockCallback = jest.fn();
          const popup: any = new Popup({
            ...new PopupProps(),
            visible: true,
          });

          popup.instance = { option: mockCallback };

          popup.setHideEventListener();
          const onHiding = mockCallback.mock.calls[0][1];
          onHiding();

          expect(popup.props.visible).toBe(false);
        });
      });
    });
  });
});
