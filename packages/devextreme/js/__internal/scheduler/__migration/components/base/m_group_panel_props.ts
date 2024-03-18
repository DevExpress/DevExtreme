export const GroupPanelBaseProps = {
  groupPanelData: Object.freeze({
    groupPanelItems: [],
    baseColSpan: 1,
  }),
  groupByDate: false,
};

export const GroupPanelCellProps = {
  id: 0,
  text: '',
  data: Object.freeze({
    id: 0,
  }),
  className: '',
};

export const GroupPanelRowProps = {
  groupItems: Object.freeze([]),
  className: '',
};
