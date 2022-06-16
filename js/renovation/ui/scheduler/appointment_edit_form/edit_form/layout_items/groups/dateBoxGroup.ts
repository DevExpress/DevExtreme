import { IFieldExpr } from '../../../../types';
import type { GroupItem } from '../../../../../../../ui/form';
import { SimpleItem } from '../../../../../form/wrapper/simple_item';
import { ItemLabels } from '../const';
import { getDateBoxLayoutItemConfig } from '../dateBox';
import { getTimeZoneLayoutItemConfig } from '../timeZone';

interface IAppointmentEditFormLayout {
  dataExpr: IFieldExpr;
  allowTimeZoneEditing: boolean | undefined;
  startDateEditorTemplate: JSX.Element;
  endDateEditorTemplate: JSX.Element;
  startDatetimeZoneEditorTemplate: JSX.Element;
  endDateTimeZoneEditorTemplate: JSX.Element;
}

const createDateBoxItems = (options: IAppointmentEditFormLayout): SimpleItem[] => {
  const colSpan = options.allowTimeZoneEditing
    ? 2
    : 1;

  const startDateLayoutItem = getDateBoxLayoutItemConfig(
    options.startDateEditorTemplate,
    options.dataExpr.startDateExpr,
    colSpan,
    ItemLabels.startDate,
  );

  const startDateTimeZoneLayoutItem = getTimeZoneLayoutItemConfig(
    options.startDatetimeZoneEditorTemplate,
    options.dataExpr.startDateTimeZoneExpr,
    colSpan,
    1,
    !!options.allowTimeZoneEditing,
  );

  const endDateLayoutItem = getDateBoxLayoutItemConfig(
    options.endDateEditorTemplate,
    options.dataExpr.endDateExpr,
    colSpan,
    ItemLabels.endDate,
  );

  const endDateTimeZoneLayoutItem = getTimeZoneLayoutItemConfig(
    options.endDateTimeZoneEditorTemplate,
    options.dataExpr.endDateTimeZoneExpr,
    colSpan,
    3,
    !!options.allowTimeZoneEditing,
  );

  return [
    startDateLayoutItem,
    startDateTimeZoneLayoutItem,
    endDateLayoutItem,
    endDateTimeZoneLayoutItem,
  ];
};

export const getDateBoxGroupConfig = (
  dataExpr: IFieldExpr,
  allowTimeZoneEditing: boolean | undefined,
  startDateEditorTemplate: JSX.Element,
  endDateEditorTemplate: JSX.Element,
  startDatetimeZoneEditorTemplate: JSX.Element,
  endDateTimeZoneEditorTemplate: JSX.Element,
): GroupItem => ({
  itemType: 'group',
  colSpan: 2,
  colCountByScreen: {
    lg: 2,
    xs: 1,
  },
  items: createDateBoxItems({
    dataExpr,
    allowTimeZoneEditing,
    startDateEditorTemplate,
    endDateEditorTemplate,
    startDatetimeZoneEditorTemplate,
    endDateTimeZoneEditorTemplate,
  }),
});
