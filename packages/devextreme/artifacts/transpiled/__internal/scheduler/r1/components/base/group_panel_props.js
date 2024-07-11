"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelRowDefaultProps = exports.GroupPanelCellDefaultProps = exports.GroupPanelBaseDefaultProps = void 0;
const GroupPanelBaseDefaultProps = exports.GroupPanelBaseDefaultProps = {
  groupPanelData: {
    groupPanelItems: [],
    baseColSpan: 1
  },
  groupByDate: false,
  styles: {}
};
const GroupPanelCellDefaultProps = exports.GroupPanelCellDefaultProps = {
  id: 0,
  text: '',
  data: {
    id: 0
  },
  className: ''
};
const GroupPanelRowDefaultProps = exports.GroupPanelRowDefaultProps = {
  groupItems: [],
  className: ''
};