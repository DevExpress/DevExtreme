import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, prepareData, isTextEmpty,
  getCanvas,
} from '../tooltip_utils';
import domAdapter from '../../../../core/dom_adapter';

jest.mock('../../../../core/dom_adapter', () => ({
  getDocumentElement: jest.fn(),
  getBody: jest.fn(),
}));

describe('getCloudAngle', () => {
  it('should return angle = 0, anchor in the center, top-right and right areas', () => {
    const size = { width: 30, height: 20 };

    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 40, anchorY: 50,
    })).toBe(0); // center

    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 66, anchorY: 40,
    })).toBe(0); // top-right

    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 66, anchorY: 50,
    })).toBe(0); // right
  });

  it('should return angle = 270, anchor in the top-left and top areas', () => {
    const size = { width: 30, height: 20 };

    // top-left
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 20, anchorY: 40,
    })).toBe(270);

    // top
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 33, anchorY: 40,
    })).toBe(270);
  });

  it('should return angle = 90, anchor in the bottom-right and bottom areas', () => {
    const size = { width: 30, height: 20 };

    // bottom-right
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 66, anchorY: 70,
    })).toBe(90);

    // bottom
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 55, anchorY: 70,
    })).toBe(90);
  });

  it('should return angle = 180, anchor in the bottom-left and left areas', () => {
    const size = { width: 30, height: 20 };

    // bottom-left
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 20, anchorY: 70,
    })).toBe(180);

    // left
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 20, anchorY: 70,
    })).toBe(180);
  });
});

describe('recalculateCoordinates', () => {
  it('should return new coordinates', () => {
    const canvas = {
      left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 450,
    };
    const size = { width: 30, height: 40 };
    const coordinates = recalculateCoordinates({
      canvas,
      anchorX: 100,
      anchorY: 90,
      size,
      offset: 8,
      arrowLength: 11,
    });

    expect(coordinates).toEqual({
      x: 100, y: 51, anchorX: 100, anchorY: 82,
    });
  });

  it('should return new coordinates, area of tooltip goes beyond the top canvas', () => {
    const canvas = {
      left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 450,
    };
    const size = { width: 30, height: 40 };
    const coordinates = recalculateCoordinates({
      canvas,
      anchorX: 100,
      anchorY: 20,
      size,
      offset: 8,
      arrowLength: 11,
    });

    expect(coordinates).toEqual({
      x: 100, y: 59, anchorX: 100, anchorY: 28,
    });
  });

  it('should return new coordinates, area of tooltip goes beyond the left canvas', () => {
    const canvas = {
      left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 450,
    };
    const size = { width: 30, height: 40 };
    const coordinates = recalculateCoordinates({
      canvas,
      anchorX: 10,
      anchorY: 90,
      size,
      offset: 8,
      arrowLength: 11,
    });

    expect(coordinates).toEqual({
      x: 15, y: 51, anchorX: 10, anchorY: 82,
    });
  });

  it('should return new coordinates, area of tooltip goes beyond the right canvas', () => {
    const canvas = {
      left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 450,
    };
    const size = { width: 30, height: 40 };
    const coordinates = recalculateCoordinates({
      canvas,
      anchorX: 390,
      anchorY: 90,
      size,
      offset: 8,
      arrowLength: 11,
    });

    expect(coordinates).toEqual({
      x: 385, y: 51, anchorX: 390, anchorY: 82,
    });
  });

  it('should return new coordinates, canvas width less the width of the tooltip', () => {
    const canvas = {
      left: 0, right: 0, top: 0, bottom: 0, width: 27, height: 450,
    };
    const size = { width: 30, height: 40 };
    const coordinates = recalculateCoordinates({
      canvas,
      anchorX: 20,
      anchorY: 90,
      size,
      offset: 8,
      arrowLength: 11,
    });

    expect(coordinates).toEqual({
      x: 14, y: 51, anchorX: 20, anchorY: 82,
    });
  });

  it('should return new coordinates, canvas height less the height of the tooltip', () => {
    const canvas = {
      left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 35,
    };
    const size = { width: 30, height: 40 };
    const coordinates = recalculateCoordinates({
      canvas,
      anchorX: 100,
      anchorY: 20,
      size,
      offset: 8,
      arrowLength: 11,
    });

    expect(coordinates).toEqual({
      x: 100, y: 20, anchorX: 100, anchorY: 20,
    });
  });

  it('should return false, coordinates is not in the canvas', () => {
    const options = {
      canvas: {
        left: 10, right: 20, top: 25, bottom: 30, width: 400, height: 100,
      },
      size: { width: 30, height: 40 },
      offset: 8,
      arrowLength: 11,
    };

    expect(recalculateCoordinates({
      ...options,
      anchorX: 1,
      anchorY: 50,
    })).toEqual(false);
    expect(recalculateCoordinates({
      ...options,
      anchorX: 15,
      anchorY: 5,
    })).toEqual(false);

    expect(recalculateCoordinates({
      ...options,
      anchorX: 700,
      anchorY: 50,
    })).toEqual(false);
    expect(recalculateCoordinates({
      ...options,
      anchorX: 50,
      anchorY: 300,
    })).toEqual(false);
  });
});

describe('getCloudPoints', () => {
  it('should return path, anchor in the bottom of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 51, anchorX: 100, anchorY: 82,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M80,46a 10 10 0 0 1 10 -10L110,36a 10 10 0 0 1 8.660254037844386 5L118.66025403784438,41,131,51,118.66025403784438,61A 10 10 0 0 1 110 66L90,66a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor inside of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 80, anchorX: 100, anchorY: 82,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M85,70a 10 10 0 0 1 10 -10L105,60a 10 10 0 0 1 10 10L115,90a 10 10 0 0 1 -10 10L95,100a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the top of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 82, anchorX: 100, anchorY: 51,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M80,77a 10 10 0 0 1 10 -10L110,67a 10 10 0 0 1 8.660254037844386 5L118.66025403784438,72,131,82,118.66025403784438,92A 10 10 0 0 1 110 97L90,97a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the left of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 80, anchorX: 30, anchorY: 80,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,70a 10 10 0 0 1 10 -10L55,60a 10 10 0 0 1 10 10L65,70,70,80,65,90L65,90a 10 10 0 0 1 -10 10L45,100a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the right of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 80, anchorX: 80, anchorY: 80,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,70a 10 10 0 0 1 10 -10L55,60a 10 10 0 0 1 10 10L65,70,80,80,65,90L65,90a 10 10 0 0 1 -10 10L45,100a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the top-right of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 20,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30,80,20,65,40L65,60a 10 10 0 0 1 -10 10L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the top-right, corner radius >= half height of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 20,
    };
    const options = { arrowWidth: 20, cornerRadius: 20 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,45a 15 15 0 0 1 15 -15L50,30a 15 15 0 0 1 1.7767909546784961 0.10560461437347568L80,20,64.89439538562652,43.223209045321504A 15 15 0 0 1 65 45L65,55a 15 15 0 0 1 -15 15L50,70a 15 15 0 0 1 -15 -15Z');
  });

  it('should return path, anchor in the top-right, anchor right on the corner', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 30,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30a 10 10 0 0 1 5.403023058681398 1.585290151921035L60.4030230586814,31.585290151921036,80,30,65,40L65,60a 10 10 0 0 1 -10 10L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the top-right, anchor right on the corner, small arrow width', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 30,
    };
    const options = { arrowWidth: 5, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30a 10 10 0 0 1 5.403023058681398 1.585290151921035L60.4030230586814,31.585290151921036,80,30,62.76541234242515,33.699335657876134A 10 10 0 0 1 65 40L65,60a 10 10 0 0 1 -10 10L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the bottom-right, anchor right on the corner', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 70,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30a 10 10 0 0 1 10 10L65,60,80,70,55,70A 10 10 0 0 1 55 70L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, anchor in the bottom-right, anchor right on the corner, corner radius >= half height of tooltip', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 70,
    };
    const options = { arrowWidth: 20, cornerRadius: 20 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,45a 15 15 0 0 1 15 -15L50,30a 15 15 0 0 1 15 15L65,55a 15 15 0 0 1 -0.8578643762690497 5L64.14213562373095,60,80,70,50,70A 15 15 0 0 1 50 70L50,70a 15 15 0 0 1 -15 -15Z');
  });
});

describe('prepareData', () => {
  const border = {
    color: 'color_2', width: 2, dashStyle: 'dashStyle', visible: true,
  };
  const font = {
    color: 'color_3', family: 'family', opacity: 1, size: 10, weight: 200,
  };

  it('should return value text', () => {
    expect(prepareData({ valueText: 'value_text' }, 'color_1', border, font)).toEqual({
      text: 'value_text',
      color: 'color_1',
      borderColor: 'color_2',
      fontColor: 'color_3',
    });
  });

  it('should return description', () => {
    expect(prepareData({ description: 'description' }, 'color_1', border, font)).toEqual({
      text: 'description',
      color: 'color_1',
      borderColor: 'color_2',
      fontColor: 'color_3',
    });
  });

  it('should return object from customizeTooltip', () => {
    const customizedObject = {
      text: 'tooltip text',
      html: 'tooltip html',
      color: 'customized_color',
      borderColor: 'customized_border_color',
      fontColor: 'customized_font_color',
    };
    const customizeTooltip = () => customizedObject;
    expect(prepareData({ description: 'description' }, 'color_1', border, font, customizeTooltip)).toEqual(customizedObject);
  });

  it('should check if text is empty', () => {
    expect(isTextEmpty({ text: '' })).toBe(true);
    expect(isTextEmpty({ text: null })).toBe(true);
    expect(isTextEmpty({ html: '' })).toBe(true);
    expect(isTextEmpty({ html: null })).toBe(true);

    expect(isTextEmpty({ text: 'text' })).toBe(false);
    expect(isTextEmpty({ html: '<p>html tooltip</p>' })).toBe(false);
  });
});

function setReturnValue(method, returnValue) {
  (domAdapter[method] as jest.Mock).mockReturnValue(returnValue);
}

describe('getCanvas', () => {
  afterEach(() => jest.resetAllMocks);

  it('should return valid canvas. tooltip in body. width from the document.clientWidth', () => {
    setReturnValue('getBody', {
      scrollHeight: 14,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 100,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 4,
      offsetHeight: 5,
      clientHeight: 6,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 16,
      left: 1,
      right: 0,
      top: 2,
      width: 301,
    });
  });

  it('should return valid canvas. tooltip in body. width from the body.clientWidth', () => {
    setReturnValue('getBody', {
      scrollHeight: 14,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 4,
      offsetHeight: 5,
      clientHeight: 6,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 16,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in body. height from the body.scrollHeight', () => {
    setReturnValue('getBody', {
      scrollHeight: 20,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 5,
      offsetHeight: 6,
      clientHeight: 7,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 20,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in body. height from the body.offsetHeight', () => {
    setReturnValue('getBody', {
      scrollHeight: 14,
      offsetHeight: 20,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 5,
      offsetHeight: 6,
      clientHeight: 7,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 20,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in body. height from the body.clientHeight', () => {
    setReturnValue('getBody', {
      scrollHeight: 14,
      offsetHeight: 15,
      clientHeight: 20,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 5,
      offsetHeight: 6,
      clientHeight: 7,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 20,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in body. height from the document.scrollHeight', () => {
    setReturnValue('getBody', {
      scrollHeight: 5,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 20,
      offsetHeight: 6,
      clientHeight: 7,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 20,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in body. height from the document.offsetHeight', () => {
    setReturnValue('getBody', {
      scrollHeight: 5,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 6,
      offsetHeight: 20,
      clientHeight: 7,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 20,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in body. height from the document.clientHeight', () => {
    setReturnValue('getBody', {
      scrollHeight: 5,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 6,
      offsetHeight: 5,
      clientHeight: 20,
    });

    expect(getCanvas(domAdapter.getBody())).toEqual({
      bottom: 0,
      height: 20,
      left: 1,
      right: 0,
      top: 2,
      width: 401,
    });
  });

  it('should return valid canvas. tooltip in custom container. left,top coord calculation. container has no left,top offsets', () => {
    const container = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 10,
        height: 10,
      }),
    } as HTMLElement;
    setReturnValue('getBody', {
      scrollHeight: 5,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 6,
      offsetHeight: 5,
      clientHeight: 4,
    });

    expect(getCanvas(container)).toEqual({
      bottom: 0,
      height: 14,
      left: 1,
      right: 0,
      top: 2,
      width: 12,
    });
  });

  it('should return valid canvas. tooltip in custom container. left,top coords calculation. container has left,top offsets', () => {
    const container = {
      getBoundingClientRect: () => ({
        left: 30,
        top: 30,
        width: 10,
        height: 10,
      }),
    } as HTMLElement;
    setReturnValue('getBody', {
      scrollHeight: 5,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 300,
      scrollHeight: 6,
      offsetHeight: 5,
      clientHeight: 4,
    });

    expect(getCanvas(container)).toEqual({
      bottom: 0,
      height: 44,
      left: 31,
      right: 0,
      top: 32,
      width: 42,
    });
  });

  it('should return valid canvas. tooltip in custom container. width,height calculation. container is smaller of client size', () => {
    const container = {
      getBoundingClientRect: () => ({
        left: 30,
        top: 30,
        width: 300,
        height: 2,
      }),
    } as HTMLElement;
    setReturnValue('getBody', {
      scrollHeight: 5,
      offsetHeight: 15,
      clientHeight: 16,
      clientWidth: 400,
      getBoundingClientRect: () => ({ left: 20 }),
    });

    setReturnValue('getDocumentElement', {
      scrollLeft: 1,
      scrollTop: 2,
      clientWidth: 100,
      scrollHeight: 6,
      offsetHeight: 5,
      clientHeight: 4,
    });

    expect(getCanvas(container)).toEqual({
      bottom: 0,
      height: 36,
      left: 31,
      right: 0,
      top: 32,
      width: 332,
    });
  });
});
