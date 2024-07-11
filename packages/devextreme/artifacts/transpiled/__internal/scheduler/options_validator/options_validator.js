"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchedulerOptionsValidator = void 0;
var _index = require("./common/index");
var _index2 = require("./core/index");
var _validator_rules = require("./validator_rules");
class SchedulerOptionsValidator extends _index2.OptionsValidator {
  constructor() {
    super({
      startDayHour: new _index2.Validator(_ref => {
        let {
          startDayHour
        } = _ref;
        return startDayHour;
      }, [_index.mustBeInteger, (0, _index.mustBeInRange)([0, 24])]),
      endDayHour: new _index2.Validator(_ref2 => {
        let {
          endDayHour
        } = _ref2;
        return endDayHour;
      }, [_index.mustBeInteger, (0, _index.mustBeInRange)([0, 24])]),
      offset: new _index2.Validator(_ref3 => {
        let {
          offset
        } = _ref3;
        return offset;
      }, [_index.mustBeInteger, (0, _index.mustBeInRange)([-1440, 1440]), (0, _index.mustBeDivisibleBy)(5)]),
      cellDuration: new _index2.Validator(_ref4 => {
        let {
          cellDuration
        } = _ref4;
        return cellDuration;
      }, [_index.mustBeInteger, (0, _index.mustBeGreaterThan)(0)]),
      startDayHourAndEndDayHour: new _index2.Validator(options => options, [_validator_rules.endDayHourMustBeGreaterThanStartDayHour]),
      cellDurationAndVisibleInterval: new _index2.Validator(options => options, [_validator_rules.visibleIntervalMustBeDivisibleByCellDuration, _validator_rules.cellDurationMustBeLessThanVisibleInterval])
    });
  }
}
exports.SchedulerOptionsValidator = SchedulerOptionsValidator;