import devices from '../../../../../core/devices';
import {
  getMaxWidth,
  getPopupSize,
  getPopupToolbarItems,
  isPopupFullScreenNeeded,
  POPUP_WIDTH,
} from '../popup_config';

jest.mock('../../../../../core/utils/size', () => ({
  ...jest.requireActual('../../../../../core/utils/size'),
  getWidth: () => (window as any).innerWidth,
}));

describe('API', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getPopupToolbarItems', () => {
    [
      undefined,
      jest.fn(),
    ].forEach((doneClick) => {
      [
        {
          platform: 'ios',
          cancelLocation: 'before',
        },
        {
          platform: undefined,
          cancelLocation: 'after',
        },
      ].forEach(({ platform, cancelLocation }) => {
        [
          {
            allowUpdating: true,
            expected: [
              {
                location: 'after',
                onClick: doneClick,
                options: { text: 'Done' },
                shortcut: 'done',
              },
              {
                location: cancelLocation,
                shortcut: 'cancel',
              },
            ],
          },
          {
            allowUpdating: false,
            expected: [
              {
                location: cancelLocation,
                shortcut: 'cancel',
              },
            ],
          },
        ].forEach(({ allowUpdating, expected }) => {
          it(`should return correct config if allowUpdating=${allowUpdating}, has doneClick=${!doneClick}`, () => {
            devices.current = (): any => ({ platform });

            expect(getPopupToolbarItems(allowUpdating, doneClick))
              .toEqual(expected);
          });
        });
      });
    });

    it('should return correct config if iOS platform', () => {
      devices.current = (): any => ({ platform: 'ios' });

      expect(getPopupToolbarItems(false))
        .toEqual([{
          location: 'before',
          shortcut: 'cancel',
        }]);
    });
  });

  describe('isPopupFullScreenNeeded', () => {
    [
      {
        device: 'desktop',
        width: POPUP_WIDTH.FULLSCREEN,
        expected: false,
      },
      {
        device: 'desktop',
        width: POPUP_WIDTH.FULLSCREEN - 1,
        expected: true,
      },
      {
        device: 'mobile',
        width: POPUP_WIDTH.MOBILE.FULLSCREEN,
        expected: false,
      },
      {
        device: 'mobile',
        width: POPUP_WIDTH.MOBILE.FULLSCREEN - 1,
        expected: true,
      },
    ].forEach(({ device, width, expected }) => {
      it(`should return correct value if device=${device}, width=${width}`, () => {
        devices.current = (): any => ({ deviceType: device });

        (window as any).innerWidth = width;

        expect(isPopupFullScreenNeeded())
          .toBe(expected);
      });
    });
  });

  describe('getMaxWidth', () => {
    [{
      device: 'desktop',
      isRecurrence: false,
      expected: POPUP_WIDTH.DEFAULT,
    }, {
      device: 'desktop',
      isRecurrence: true,
      expected: POPUP_WIDTH.RECURRENCE,
    }, {
      device: 'mobile',
      isRecurrence: false,
      expected: POPUP_WIDTH.MOBILE.DEFAULT,
    }, {
      device: 'mobile',
      isRecurrence: true,
      expected: POPUP_WIDTH.MOBILE.DEFAULT,
    }].forEach(({ device, isRecurrence, expected }) => {
      it(`should return correct width if device=${device}, recurrence=${isRecurrence}`, () => {
        devices.current = (): any => ({ deviceType: device });

        expect(getMaxWidth(isRecurrence))
          .toBe(expected);
      });
    });
  });

  describe('getPopupSize', () => {
    [{
      device: 'desktop',
      isRecurrence: true,
      expected: {
        fullScreen: true,
        maxWidth: POPUP_WIDTH.RECURRENCE,
      },
    }, {
      device: 'desktop',
      isRecurrence: false,
      expected: {
        fullScreen: true,
        maxWidth: POPUP_WIDTH.DEFAULT,
      },
    }, {
      device: 'mobile',
      isRecurrence: true,
      expected: {
        fullScreen: true,
        maxWidth: POPUP_WIDTH.MOBILE.DEFAULT,
      },
    }, {
      device: 'mobile',
      isRecurrence: false,
      expected: {
        fullScreen: true,
        maxWidth: POPUP_WIDTH.MOBILE.DEFAULT,
      },
    }].forEach(({ device, isRecurrence, expected }) => {
      it(`should return correct value if device=${device}, recurrence=${isRecurrence}`, () => {
        devices.current = (): any => ({ deviceType: device });

        expect(getPopupSize(isRecurrence))
          .toEqual(expected);
      });
    });
  });
});
