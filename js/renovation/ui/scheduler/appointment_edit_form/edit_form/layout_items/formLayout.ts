/* eslint-disable function-paren-newline */
import { SimpleItem } from '../../../../form/wrapper/simple_item';
import { IFieldExpr } from '../../../types';
import { IAppointmentFormData } from '../../../utils/editing/formData';
import messageLocalization from '../../../../../../localization/message';
import { getDateBoxLayoutItemConfig } from './dateBox';
import type { GroupItem } from '../../../../../../ui/form';
import { getTimeZoneLayoutItemConfig } from './timeZone';
import { getSwitchLayoutItemConfig } from './switch';
import { getDescriptionLayoutItemConfig } from './description';

const LayoutGroupNames = {
  Main: 'mainGroup',
  Recurrence: 'recurrenceGroup',
};

const ItemLabels = {
  subject: messageLocalization.format('dxScheduler-editorLabelTitle'),
  startDate: messageLocalization.format('dxScheduler-editorLabelStartDate'),
  endDate: messageLocalization.format('dxScheduler-editorLabelEndDate'),
  allDay: messageLocalization.format('dxScheduler-allDay'),
  repeat: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
  description: messageLocalization.format('dxScheduler-editorLabelDescription'),
};

export interface IAppointmentEditFormLayout {
  dataExpr: IFieldExpr;
  allowTimeZoneEditing: boolean | undefined;
  startDateEditorTemplate: JSX.Element;
  endDateEditorTemplate: JSX.Element;
  startDatetimeZoneEditorTemplate: JSX.Element;
  endDateTimeZoneEditorTemplate: JSX.Element;
}

const createDateBoxItems = (
  options: IAppointmentEditFormLayout,
): SimpleItem[] => {
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

const createMainItems = (
  dataExpr: IFieldExpr,
  allowTimeZoneEditing: boolean | undefined,
  startDateEditorTemplate: JSX.Element,
  endDateEditorTemplate: JSX.Element,
  startDatetimeZoneEditorTemplate: JSX.Element,
  endDateTimeZoneEditorTemplate: JSX.Element,
  allDayEditorTemplate: JSX.Element,
  repeatEditorTemplate: JSX.Element,
  descriptionEditorTemplate: JSX.Element,
): (SimpleItem | GroupItem)[] => [
  {
    dataField: dataExpr.textExpr,
    editorType: 'dxTextBox', // TODO replace with template after make wrapper
    colSpan: 2,
    label: {
      text: ItemLabels.subject,
    },
  },
  {
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
  },
  {
    itemType: 'group',
    colCountByScreen: {
      lg: 3,
      xs: 3,
    },
    colSpan: 2,
    items: [
      getSwitchLayoutItemConfig(
        allDayEditorTemplate,
        dataExpr.allDayExpr,
        ItemLabels.allDay,
      ),
      getSwitchLayoutItemConfig(
        repeatEditorTemplate,
        'repeat',
        ItemLabels.repeat,
      ),
      {
        itemType: 'empty',
        colSpan: 2,
      },
    ],
  }, {
    itemType: 'empty',
    colSpan: 2,
  },
  getDescriptionLayoutItemConfig(
    descriptionEditorTemplate,
    dataExpr.descriptionExpr,
    ItemLabels.description,
  ), {
    itemType: 'empty',
    colSpan: 2,
  },
];

const getMainLayout = (
  colSpan: number,
  dateExpr: IFieldExpr,
  recurrenceEditorVisibility: boolean,
  allowTimeZoneEditing: boolean | undefined,
  startDateEditorTemplate: JSX.Element,
  endDateEditorTemplate: JSX.Element,
  startDatetimeZoneEditorTemplate: JSX.Element,
  endDateTimeZoneEditorTemplate: JSX.Element,
  allDayEditorTemplate: JSX.Element,
  repeatEditorTemplate: JSX.Element,
  descriptionEditorTemplate: JSX.Element,
): GroupItem[] => [{
  itemType: 'group',
  name: LayoutGroupNames.Main,
  colCountByScreen: {
    lg: 2,
    xs: 1,
  },
  colSpan,
  items: createMainItems(
    dateExpr,
    allowTimeZoneEditing,
    startDateEditorTemplate,
    endDateEditorTemplate,
    startDatetimeZoneEditorTemplate,
    endDateTimeZoneEditorTemplate,
    allDayEditorTemplate,
    repeatEditorTemplate,
    descriptionEditorTemplate,
  ),
}, {
  itemType: 'group',
  name: LayoutGroupNames.Recurrence,
  visible: recurrenceEditorVisibility,
  colSpan,
  // items: createRecurrenceEditorConfig(dateExpr),
  items: [],
}];

export const getFormLayoutConfig = (
  fieldExpr: IFieldExpr,
  formData: IAppointmentFormData,
  allowTimeZoneEditing: boolean | undefined,
  startDateEditorTemplate: JSX.Element,
  endDateEditorTemplate: JSX.Element,
  startDatetimeZoneEditorTemplate: JSX.Element,
  endDateTimeZoneEditorTemplate: JSX.Element,
  allDayEditorTemplate: JSX.Element,
  repeatEditorTemplate: JSX.Element,
  descriptionEditorTemplate: JSX.Element,
): GroupItem[] => {
  const recurrenceEditorVisibility = !!formData[fieldExpr.recurrenceRuleExpr]; // TODO
  const colSpan = recurrenceEditorVisibility
    ? 1
    : 2;

  return getMainLayout(
    colSpan,
    fieldExpr,
    recurrenceEditorVisibility,
    allowTimeZoneEditing,
    startDateEditorTemplate,
    endDateEditorTemplate,
    startDatetimeZoneEditorTemplate,
    endDateTimeZoneEditorTemplate,
    allDayEditorTemplate,
    repeatEditorTemplate,
    descriptionEditorTemplate,
  );
};
