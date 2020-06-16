/**
 * @jest-environment jsdom
 */

import { act } from 'preact/test-utils';
import $ from '../../js/core/renderer';
import './test_components/preact_test_widget';

describe('JQuery', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="components">
        <div id="component"></div>
    </div>
    `;
  });

  afterEach(() => {
    $('#components').empty();
    document.body.innerHTML = '';
  });

  it('On widget disposing clean preact effects', () => {
    const subscribeEffect = jest.fn();
    const unsubscribeEffect = jest.fn();
    act(() => $('#component').dxrPreactTestWidget({
      subscribeEffect,
      unsubscribeEffect,
    }));

    expect(subscribeEffect).toHaveBeenCalledTimes(1);
    expect(unsubscribeEffect).toHaveBeenCalledTimes(0);

    act(() => $('#components').empty());

    expect(subscribeEffect).toHaveBeenCalledTimes(1);
    expect(unsubscribeEffect).toHaveBeenCalledTimes(1);
  });

  describe('Method Option', () => {
    it('should return default props of preact component', () => {
      act(() => $('#component').dxrPreactTestWidget({}));

      expect($('#component').dxrPreactTestWidget('option').text).toBe('default text');
    });

    it.skip('should return default value of TwoWay prop', () => {
      act(() => $('#component').dxrPreactTestWidget({}));

      expect($('#component').dxrPreactTestWidget('option').count).toBe(1);
    });

    it('should return update value of TwoWay prop', () => {
      act(() => $('#component').dxrPreactTestWidget({}));

      $('#component').dxrPreactTestWidget('tick');

      expect($('#component').dxrPreactTestWidget('option').count).toBe(2);
    });
  });
});
