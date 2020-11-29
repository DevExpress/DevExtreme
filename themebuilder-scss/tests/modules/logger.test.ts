/* eslint no-console: 0 */
import Logger from '../../src/modules/logger';

describe('Logger tests', () => {
  const realLog = console.log;

  beforeEach(() => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('1985-12-03').getTime());

    console.log = jest.fn();
  });

  afterEach(() => {
    (console.log as jest.Mock).mockReset();
    console.log = realLog;
    delete process.env.THEMEBUILDER_DEBUG;
  });

  test('No logging when THEMEBUILDER_DEBUG is not defined', () => {
    console.log = jest.fn();
    Logger.log('test message');
    expect(console.log).not.toBeCalled();
  });

  test('Logging when THEMEBUILDER_DEBUG is defined', () => {
    process.env.THEMEBUILDER_DEBUG = '';

    Logger.log('test message');
    expect(console.log).toBeCalled();
    expect(console.log).toBeCalledWith('1985-12-03T00:00:00.000Z: test message');
  });

  test('Logging with additional info', () => {
    process.env.THEMEBUILDER_DEBUG = '';

    Logger.log('test message', { data: '123' });
    expect(console.log).toBeCalled();
    expect(console.log).toBeCalledWith('1985-12-03T00:00:00.000Z: test message: {\n  "data": "123"\n}');
  });
});
