/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as PopupView, PopupProps, Popup } from '../popup';

jest.mock('../../../../ui/popup', () => jest.fn());

describe('Popup', () => {
  describe('View', () => {
    it('should render', () => {
      const componentProps = new PopupProps();
      const props = {
        props: componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Popup>;
      shallow(<PopupView {...props as any} /> as any);
    });
  });

  describe('Behaviour', () => {
    describe('Events', () => {
      it('should not fail if ref has no "current"', () => {
        const toolbar: any = new Popup({
          ...new PopupProps(),
          visible: true,
        });

        toolbar.wrapperRef = {};

        toolbar.saveInstance();
      });

      it('should set the "onHiding" event listener', () => {
        const mockCallback = jest.fn();
        const toolbar: any = new Popup({
          ...new PopupProps(),
          visible: true,
        });

        toolbar.wrapperRef = {
          current: {
            getInstance: () => ({ option: mockCallback }),
          },
        };

        toolbar.saveInstance();

        toolbar.setListeners();
        expect(mockCallback).toBeCalledTimes(1);

        mockCallback.mock.calls[0][1]();
        expect(toolbar.props.visible).toBe(false);
      });
    });
  });
});
