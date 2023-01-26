/* eslint-disable function-paren-newline */
import { SimpleItem } from '../../../../form/wrapper/simple_item';
import { IFieldExpr } from '../../../types';
import { IAppointmentFormData } from '../../../utils/editing/formData';
import type { GroupItem } from '../../../../../../ui/form';
import { getDescriptionLayoutItemConfig } from './description';
import { ItemLabels } from './const';
import { getDateBoxGroupConfig } from './groups/dateBoxGroup';
import { getSwitchGroupConfig } from './groups/switchGroup';

const LayoutGroupNames = {
  Main: 'mainGroup',
  Recurrence: 'recurrenceGroup',
};

export interface IAppointmentEditFormLayout {
  dataExpr: IFieldExpr;
  allowTimeZoneEditing: boolean | undefined;
  startDateEditorTemplate: JSX.Element;
  endDateEditorTemplate: JSX.Element;
  startDatetimeZoneEditorTemplate: JSX.Element;
  endDateTimeZoneEditorTemplate: JSX.Element;
}

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
  getDateBoxGroupConfig(
    dataExpr,
    allowTimeZoneEditing,
    startDateEditorTemplate,
    endDateEditorTemplate,
    startDatetimeZoneEditorTemplate,
    endDateTimeZoneEditorTemplate,
  ),
  getSwitchGroupConfig(
    allDayEditorTemplate,
    repeatEditorTemplate,
    dataExpr.allDayExpr,
  ),
  {
    itemType: 'empty',
    colSpan: 2,
  },
  getDescriptionLayoutItemConfig(
    descriptionEditorTemplate,
    dataExpr.descriptionExpr,
    ItemLabels.description,
  ),
  {
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
