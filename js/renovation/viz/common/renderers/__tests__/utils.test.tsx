import { getGraphicExtraProps } from '../utils';

describe('getGraphicExtraProps', () => {
  it('should not calculate anything, no transformation and no dash style', () => {
    expect(getGraphicExtraProps({})).toEqual({ });
  });

  it('should calculate rotate transformation', () => {
    expect(getGraphicExtraProps({ rotate: 10 })).toEqual({ transform: 'rotate(10,0,0)' });
    expect(getGraphicExtraProps({ rotate: 20, rotateX: 30 })).toEqual({ transform: 'rotate(20,30,0)' });
    expect(getGraphicExtraProps({ rotate: 40, rotateY: 50 })).toEqual({ transform: 'rotate(40,0,50)' });
    expect(getGraphicExtraProps({ rotate: 90, rotateX: 20, rotateY: 30 })).toEqual({ transform: 'rotate(90,20,30)' });
    expect(getGraphicExtraProps({ rotate: 50 }, 44, 55)).toEqual({ transform: 'rotate(50,44,55)' });
    expect(getGraphicExtraProps({ rotate: 120, rotateY: 140 }, 130, 150)).toEqual({ transform: 'rotate(120,130,140)' });
  });

  it('should calculate scale transformation', () => {
    expect(getGraphicExtraProps({ scaleX: 10 })).toEqual({ transform: 'scale(10,1)' });
    expect(getGraphicExtraProps({ scaleY: 20 })).toEqual({ transform: 'scale(1,20)' });
    expect(getGraphicExtraProps({ scaleX: 30, scaleY: 40 })).toEqual({ transform: 'scale(30,40)' });
  });

  it('should calculate translate transformation', () => {
    expect(getGraphicExtraProps({ translateX: 10 })).toEqual({ transform: 'translate(10,0)' });
    expect(getGraphicExtraProps({ translateY: 20 })).toEqual({ transform: 'translate(0,20)' });
    expect(getGraphicExtraProps({ translateX: 30, translateY: 40 })).toEqual({ transform: 'translate(30,40)' });
  });

  it('should calculate all transformations at once', () => {
    expect(getGraphicExtraProps({
      translateX: 10, translateY: 20, scaleX: 30, scaleY: 40, rotate: 50, rotateX: 60, rotateY: 70,
    })).toEqual({ transform: 'translate(10,20) rotate(50,60,70) scale(30,40)' });
  });

  it('should calculate with sharping', () => {
    expect(getGraphicExtraProps({ sharp: true })).toEqual({});
    expect(getGraphicExtraProps({ sharp: true, strokeWidth: 1 })).toEqual({ transform: 'translate(0.5,0.5)' });
    expect(getGraphicExtraProps({ sharp: true, strokeWidth: 2 })).toEqual({ });
    expect(getGraphicExtraProps({
      sharp: true, strokeWidth: 1, translateX: 30, translateY: 40,
    })).toEqual({ transform: 'translate(30.5,40.5)' });
  });

  it('should calculate with vertical sharping', () => {
    expect(getGraphicExtraProps({ sharp: 'v' })).toEqual({});
    expect(getGraphicExtraProps({ sharp: 'v', strokeWidth: 1 })).toEqual({ transform: 'translate(0,0.5)' });
    expect(getGraphicExtraProps({ sharp: 'v', strokeWidth: 2 })).toEqual({ });
    expect(getGraphicExtraProps({
      sharp: 'v', strokeWidth: 1, translateX: 30, translateY: 40,
    })).toEqual({ transform: 'translate(30,40.5)' });
  });

  it('should calculate with horizontal sharping', () => {
    expect(getGraphicExtraProps({ sharp: 'h' })).toEqual({});
    expect(getGraphicExtraProps({ sharp: 'h', strokeWidth: 1 })).toEqual({ transform: 'translate(0.5,0)' });
    expect(getGraphicExtraProps({ sharp: 'h', strokeWidth: 2 })).toEqual({ });
    expect(getGraphicExtraProps({
      sharp: 'h', strokeWidth: 1, translateX: 30, translateY: 40,
    })).toEqual({ transform: 'translate(30.5,40)' });
  });

  it('should calculate dash style', () => {
    expect(getGraphicExtraProps({ dashStyle: 'longdash' })).toEqual({ 'stroke-dasharray': '8,3' });
    expect(getGraphicExtraProps({ dashStyle: 'dash' })).toEqual({ 'stroke-dasharray': '4,3' });
    expect(getGraphicExtraProps({ dashStyle: 'dot' })).toEqual({ 'stroke-dasharray': '1,3' });
    expect(getGraphicExtraProps({ dashStyle: 'longdashdotdashlongdash' })).toEqual({ 'stroke-dasharray': '8,3,1,3,4,3,8,3' });
    expect(getGraphicExtraProps({ dashStyle: 'none' })).toEqual({});
    expect(getGraphicExtraProps({ dashStyle: 'solid' })).toEqual({});
    expect(getGraphicExtraProps({ dashStyle: '' })).toEqual({});
  });

  it('should calculate dash style with stroke width', () => {
    expect(getGraphicExtraProps({ dashStyle: 'longdash', strokeWidth: 2 })).toEqual({ 'stroke-dasharray': '16,6' });
    expect(getGraphicExtraProps({ dashStyle: 'dash', strokeWidth: 2 })).toEqual({ 'stroke-dasharray': '8,6' });
    expect(getGraphicExtraProps({ dashStyle: 'dot', strokeWidth: 2 })).toEqual({ 'stroke-dasharray': '2,6' });
    expect(getGraphicExtraProps({ dashStyle: 'longdashdotdashlongdash', strokeWidth: 2 })).toEqual({ 'stroke-dasharray': '16,6,2,6,8,6,16,6' });
  });
});
