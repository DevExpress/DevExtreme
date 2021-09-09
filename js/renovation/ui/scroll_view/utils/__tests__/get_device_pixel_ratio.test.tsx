import { getDevicePixelRatio } from '../get_device_pixel_ratio';
import { setWindow } from '../../../../../core/utils/window';

describe('getDevicePixelRatio', () => {
  it('hasWindow: false', () => {
    setWindow({ }, false);
    expect(getDevicePixelRatio()).toEqual(1);
  });

  it('hasWindow: true, window.devicePixelRation = 4', () => {
    setWindow({ devicePixelRatio: 4 }, true);
    expect(getDevicePixelRatio()).toEqual(4);
  });
});
