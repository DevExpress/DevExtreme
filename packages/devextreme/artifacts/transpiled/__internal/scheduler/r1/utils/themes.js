"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeType = void 0;
var _themes = require("../../../../ui/themes");
const getThemeType = () => {
  const theme = (0, _themes.current)();
  return {
    isCompact: (0, _themes.isCompact)(theme),
    isMaterial: (0, _themes.isMaterial)(theme),
    isFluent: (0, _themes.isFluent)(theme),
    isMaterialBased: (0, _themes.isMaterialBased)(theme)
  };
};
exports.getThemeType = getThemeType;