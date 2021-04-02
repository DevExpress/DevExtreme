import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Template,
  Event,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import noop from '../../../utils/noop';
import { List } from '../../list';
import { TooltipItemLayout } from './item_layout';
import {
  GetTextAndFormatDateFn,
  GetSingleAppointmentFn,
  CheckAndDeleteAppointmentFn,
  ShowAppointmentPopupFn,
  AppointmentItem,
  AppointmentTooltipTemplate,
} from './types.d';
import getCurrentAppointment from './utils/get_current_appointment';
import {
  defaultGetTextAndFormatDate, defaultGetSingleAppointment,
} from './utils/default_functions';

interface ItemTemplateProps {
  item: AppointmentItem;
  index: number;
  container: HTMLDivElement;
}
interface ListItemProps {
  itemData: AppointmentItem;
}

export const viewFunction = (viewModel: AppointmentList): JSX.Element => (
  <List
    itemTemplate={({ item, index }: ItemTemplateProps): JSX.Element => (
      <TooltipItemLayout
        item={item}
        index={index}
        onDelete={viewModel.props.checkAndDeleteAppointment}
        onHide={viewModel.props.onHide}
        itemContentTemplate={viewModel.props.itemContentTemplate}
        getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
        singleAppointment={viewModel.props.getSingleAppointmentData(
          item.data, viewModel.props.target,
        )}
        showDeleteButton={viewModel.props.isEditingAllowed && !item.data.disabled}
      />
    )}
    dataSource={viewModel.props.appointments}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    onItemClick={viewModel.onItemClick}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@ComponentBindings()
export class AppointmentListProps {
  @OneWay() appointments?: AppointmentItem[];

  @OneWay() isEditingAllowed?: boolean = true;

  @OneWay() focusStateEnabled?: boolean = false;

  @OneWay() target?: HTMLElement;

  @Event() showAppointmentPopup?: ShowAppointmentPopupFn = noop;

  @Event() onHide?: () => void = noop;

  @Event() checkAndDeleteAppointment?: CheckAndDeleteAppointmentFn = noop;

  @Event() getTextAndFormatDate?: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @Event() getSingleAppointmentData: GetSingleAppointmentFn = defaultGetSingleAppointment;

  @Template() itemContentTemplate?: JSXTemplate<AppointmentTooltipTemplate>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentList extends JSXComponent(AppointmentListProps) {
  get onItemClick() {
    return ({ itemData }: ListItemProps): void => {
      const { showAppointmentPopup } = this.props;

      showAppointmentPopup?.(itemData.data, false, getCurrentAppointment(itemData));
    };
  }
}
