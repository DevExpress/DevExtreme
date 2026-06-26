import {
  describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import VerticalCurrentTimeShader from './current_time_shader_vertical';

const DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';
const DATE_TIME_SHADER_TOP_CLASS = 'dx-scheduler-date-time-shader-top';
const DATE_TIME_SHADER_BOTTOM_CLASS = 'dx-scheduler-date-time-shader-bottom';

describe('VerticalCurrentTimeShader', () => {
  it('should use group max height for each shader part', () => {
    const $container = $('<div>');
    const getShaderMaxHeight = jest.fn((groupIndex?: number): number => (
      groupIndex === 0 ? 100 : 200
    ));
    const workSpace = {
      getScrollable: () => ({ $content: () => $container }),
      isGroupedByDate: () => false,
      getGroupedStrategy: () => ({
        getShaderHeight: () => 150,
        getShaderMaxHeight,
        getShaderWidth: () => 50,
        getShaderTopOffset: () => 0,
        getShaderOffset: () => 0,
      }),
      getCellWidth: () => 10,
      option: () => false,
      $element: () => $('<div>'),
    } as any;
    const shader = new VerticalCurrentTimeShader(workSpace);

    shader.render(false, 2, 0);

    expect(getShaderMaxHeight).toHaveBeenCalledWith(0);
    expect(getShaderMaxHeight).toHaveBeenCalledWith(1);
    expect($container.find(`.${DATE_TIME_SHADER_CLASS}`).css('height')).toBe('150px');
    expect($container.find(`.${DATE_TIME_SHADER_TOP_CLASS}`).eq(0).css('height')).toBe('100px');
    expect($container.find(`.${DATE_TIME_SHADER_TOP_CLASS}`).eq(1).css('height')).toBe('150px');
    expect($container.find(`.${DATE_TIME_SHADER_BOTTOM_CLASS}`).length).toBe(1);
  });
});
