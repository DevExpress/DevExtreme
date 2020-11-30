import { getCloudPoints, recalculateCoordinates, getCloudAngle } from '../tooltip_computeds';

describe('#getCloudAngle', () => {
  it('should return angle=0', () => {
    const size = { width: 30, height: 20 };

    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 40, anchorY: 50,
    })).toBe(0); // 0

    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 66, anchorY: 40,
    })).toBe(0); // 3

    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 66, anchorY: 50,
    })).toBe(0); // 4
  });

  it('should return angle = 270', () => {
    const size = { width: 30, height: 20 };

    // 1
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 20, anchorY: 40,
    })).toBe(270);

    // 2
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 33, anchorY: 40,
    })).toBe(270);
  });

  it('should return angle = 90', () => {
    const size = { width: 30, height: 20 };

    // 5
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 66, anchorY: 70,
    })).toBe(90);

    // 6
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 55, anchorY: 70,
    })).toBe(90);
  });

  it('should return angle = 180', () => {
    const size = { width: 30, height: 20 };

    // 7
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 20, anchorY: 70,
    })).toBe(180);

    // 8
    expect(getCloudAngle(size, {
      x: 44, y: 56, anchorX: 20, anchorY: 70,
    })).toBe(180);
  });
});

describe('#recalculateCoordinates', () => {
  it('should return new coordinatess', () => {
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

  it('should return new coordinates, is not fit on the top', () => {
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

  it('should return new coordinates, is not fit on the left', () => {
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

  it('should return new coordinates, is not fit on the right', () => {
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

  it('should return new coordinates, canvas width less the width of the element', () => {
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

  it('should return new coordinates, canvas height less the height of the element', () => {
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
});

describe('#getCloudPoints', () => {
  it('should return path, arrow in the bottom', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 51, anchorX: 100, anchorY: 82,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M80,46a 10 10 0 0 1 10 -10L110,36a 10 10 0 0 1 8.660254037844386 5L118.66025403784438,41,131,51,118.66025403784438,61A 10 10 0 0 1 110 66L90,66a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow inside', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 80, anchorX: 100, anchorY: 82,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M85,70a 10 10 0 0 1 10 -10L105,60a 10 10 0 0 1 10 10L115,90a 10 10 0 0 1 -10 10L95,100a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, is not bounded', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 51, anchorX: 100, anchorY: 82,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, false))
      .toBe('M80,46a 10 10 0 0 1 10 -10L110,36a 10 10 0 0 1 10 10L120,56a 10 10 0 0 1 -10 10L90,66a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the top', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 100, y: 82, anchorX: 100, anchorY: 51,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M80,77a 10 10 0 0 1 10 -10L110,67a 10 10 0 0 1 8.660254037844386 5L118.66025403784438,72,131,82,118.66025403784438,92A 10 10 0 0 1 110 97L90,97a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the left', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 80, anchorX: 30, anchorY: 80,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,70a 10 10 0 0 1 10 -10L55,60a 10 10 0 0 1 10 10L65,70,70,80,65,90L65,90a 10 10 0 0 1 -10 10L45,100a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the right', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 80, anchorX: 80, anchorY: 80,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,70a 10 10 0 0 1 10 -10L55,60a 10 10 0 0 1 10 10L65,70,80,80,65,90L65,90a 10 10 0 0 1 -10 10L45,100a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the top-right', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 20,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30,80,20,65,40L65,60a 10 10 0 0 1 -10 10L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the top-right, more corner radius', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 20,
    };
    const options = { arrowWidth: 20, cornerRadius: 20 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,45a 15 15 0 0 1 15 -15L50,30a 15 15 0 0 1 1.7767909546784961 0.10560461437347568L80,20,64.89439538562652,43.223209045321504A 15 15 0 0 1 65 45L65,55a 15 15 0 0 1 -15 15L50,70a 15 15 0 0 1 -15 -15Z');
  });

  it('should return path, arrow in the top-right, arrow on the corner', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 30,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30a 10 10 0 0 1 5.403023058681398 1.585290151921035L60.4030230586814,31.585290151921036,80,30,65,40L65,60a 10 10 0 0 1 -10 10L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the top-right, arrow on the corner, less arrow width', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 30,
    };
    const options = { arrowWidth: 5, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30a 10 10 0 0 1 5.403023058681398 1.585290151921035L60.4030230586814,31.585290151921036,80,30,62.76541234242515,33.699335657876134A 10 10 0 0 1 65 40L65,60a 10 10 0 0 1 -10 10L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the bottom-right, arrow on the corner', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 70,
    };
    const options = { arrowWidth: 20, cornerRadius: 10 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,40a 10 10 0 0 1 10 -10L55,30a 10 10 0 0 1 10 10L65,60,80,70,55,70A 10 10 0 0 1 55 70L45,70a 10 10 0 0 1 -10 -10Z');
  });

  it('should return path, arrow in the bottom-right, arrow on the corner, more corner radius', () => {
    const size = { width: 30, height: 40 };
    const coordinates = {
      x: 50, y: 50, anchorX: 80, anchorY: 70,
    };
    const options = { arrowWidth: 20, cornerRadius: 20 };

    expect(getCloudPoints(size, coordinates, getCloudAngle(size, coordinates), options, true))
      .toBe('M35,45a 15 15 0 0 1 15 -15L50,30a 15 15 0 0 1 15 15L65,55a 15 15 0 0 1 -0.8578643762690497 5L64.14213562373095,60,80,70,50,70A 15 15 0 0 1 50 70L50,70a 15 15 0 0 1 -15 -15Z');
  });
});
