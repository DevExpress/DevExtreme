"use strict";

var _devices = _interopRequireDefault(require("../../../../../core/devices"));
var _config = require("../config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
jest.mock('../../../../../core/utils/size', () => _extends({}, jest.requireActual('../../../../../core/utils/size'), {
  getWidth: () => window.innerWidth
}));
describe('API', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('getPopupToolbarItems', () => {
    [undefined, jest.fn()].forEach(doneClick => {
      [{
        platform: 'ios',
        cancelLocation: 'before'
      }, {
        platform: undefined,
        cancelLocation: 'after'
      }].forEach(_ref => {
        let {
          platform,
          cancelLocation
        } = _ref;
        [{
          allowUpdating: true,
          expected: [{
            location: 'after',
            onClick: doneClick,
            options: {
              text: 'Done'
            },
            shortcut: 'done'
          }, {
            location: cancelLocation,
            shortcut: 'cancel'
          }]
        }, {
          allowUpdating: false,
          expected: [{
            location: cancelLocation,
            shortcut: 'cancel'
          }]
        }].forEach(_ref2 => {
          let {
            allowUpdating,
            expected
          } = _ref2;
          it(`should return correct config if allowUpdating=${allowUpdating}, has doneClick=${!doneClick}`, () => {
            _devices.default.current = () => ({
              platform
            });
            expect((0, _config.getPopupToolbarItems)(allowUpdating, doneClick)).toEqual(expected);
          });
        });
      });
    });
    it('should return correct config if iOS platform', () => {
      _devices.default.current = () => ({
        platform: 'ios'
      });
      expect((0, _config.getPopupToolbarItems)(false)).toEqual([{
        location: 'before',
        shortcut: 'cancel'
      }]);
    });
  });
  describe('isPopupFullScreenNeeded', () => {
    [{
      device: 'desktop',
      width: _config.POPUP_WIDTH.FULLSCREEN,
      expected: false
    }, {
      device: 'desktop',
      width: _config.POPUP_WIDTH.FULLSCREEN - 1,
      expected: true
    }, {
      device: 'mobile',
      width: _config.POPUP_WIDTH.MOBILE.FULLSCREEN,
      expected: false
    }, {
      device: 'mobile',
      width: _config.POPUP_WIDTH.MOBILE.FULLSCREEN - 1,
      expected: true
    }].forEach(_ref3 => {
      let {
        device,
        width,
        expected
      } = _ref3;
      it(`should return correct value if device=${device}, width=${width}`, () => {
        _devices.default.current = () => ({
          deviceType: device
        });
        window.innerWidth = width;
        expect((0, _config.isPopupFullScreenNeeded)()).toBe(expected);
      });
    });
  });
  describe('getMaxWidth', () => {
    [{
      device: 'desktop',
      isRecurrence: false,
      expected: _config.POPUP_WIDTH.DEFAULT
    }, {
      device: 'desktop',
      isRecurrence: true,
      expected: _config.POPUP_WIDTH.RECURRENCE
    }, {
      device: 'mobile',
      isRecurrence: false,
      expected: _config.POPUP_WIDTH.MOBILE.DEFAULT
    }, {
      device: 'mobile',
      isRecurrence: true,
      expected: _config.POPUP_WIDTH.MOBILE.DEFAULT
    }].forEach(_ref4 => {
      let {
        device,
        isRecurrence,
        expected
      } = _ref4;
      it(`should return correct width if device=${device}, recurrence=${isRecurrence}`, () => {
        _devices.default.current = () => ({
          deviceType: device
        });
        expect((0, _config.getMaxWidth)(isRecurrence)).toBe(expected);
      });
    });
  });
  describe('getPopupSize', () => {
    [{
      device: 'desktop',
      isRecurrence: true,
      expected: {
        fullScreen: true,
        maxWidth: _config.POPUP_WIDTH.RECURRENCE
      }
    }, {
      device: 'desktop',
      isRecurrence: false,
      expected: {
        fullScreen: true,
        maxWidth: _config.POPUP_WIDTH.DEFAULT
      }
    }, {
      device: 'mobile',
      isRecurrence: true,
      expected: {
        fullScreen: true,
        maxWidth: _config.POPUP_WIDTH.MOBILE.DEFAULT
      }
    }, {
      device: 'mobile',
      isRecurrence: false,
      expected: {
        fullScreen: true,
        maxWidth: _config.POPUP_WIDTH.MOBILE.DEFAULT
      }
    }].forEach(_ref5 => {
      let {
        device,
        isRecurrence,
        expected
      } = _ref5;
      it(`should return correct value if device=${device}, recurrence=${isRecurrence}`, () => {
        _devices.default.current = () => ({
          deviceType: device
        });
        expect((0, _config.getPopupSize)(isRecurrence)).toEqual(expected);
      });
    });
  });
});