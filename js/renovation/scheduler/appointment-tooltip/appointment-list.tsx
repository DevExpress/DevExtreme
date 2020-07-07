/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent, OneWay, Template, Event, Ref, Method, Effect,
} from 'devextreme-generator/component_declaration/common';
import noop from '../../utils/noop';
import List from '../../list';
import TooltipItemLayout from './item-layout';
import {
  GetTextAndFormatDateFn, GetSingleAppointmentFn,
  CheckAndDeleteAppointmentFn, ShowAppointmentPopupFn, AppointmentItem,
} from './types';
import getCurrentAppointment from './utils/get-current-appointment';
import {
  defaultGetTextAndFormatDate, defaultGetSingleAppointment,
} from './utils/default-functions';

type ItemTemplateProps = {
  item: AppointmentItem;
  index: number;
  container: HTMLDivElement;
};
type ListItemProps = {
  itemData?: AppointmentItem;
};

export const viewFunction = (viewModel: AppointmentList) => (
  <List
    itemTemplate={({ item, index }: ItemTemplateProps) => (
      <TooltipItemLayout
        item={item}
        index={index}
        onDelete={viewModel.props.checkAndDeleteAppointment}
        onHide={viewModel.props.onHide}
        itemContentTemplate={viewModel.props.itemContentTemplate}
        getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
        singleAppointment={viewModel.props.getSingleAppointmentData!(
          item.data, viewModel.props.target!,
        )}
        showDeleteButton={viewModel.props.isEditingAllowed && !item.data.disabled}
      />
    )}
    dataSource={viewModel.props.appointments}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    onItemClick={viewModel.onItemClick}
    onContentReady={viewModel.props.dragBehavior}
    showScrollbar={viewModel.props.showScrollbar}
    ref={viewModel.listRef as never}
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

  @OneWay() showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';

  @Event() showAppointmentPopup?: ShowAppointmentPopupFn = noop;

  @Event() onHide?: () => void = noop;

  @Event() checkAndDeleteAppointment?: CheckAndDeleteAppointmentFn = noop;

  @Event() getTextAndFormatDate?: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @Event() getSingleAppointmentData?: GetSingleAppointmentFn = defaultGetSingleAppointment;

  @Event() dragBehavior?: (element: HTMLElement) => void;

  @Template() itemContentTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class AppointmentList extends JSXComponent(AppointmentListProps) {
  @Ref()
  listRef!: List;

  @Method()
  getHtmlElement(): HTMLElement {
    return this.listRef.getHtmlElement();
  }

  get onItemClick() {
    return ({ itemData }: ListItemProps): void => {
      const { showAppointmentPopup } = this.props;
      showAppointmentPopup!(itemData!.data, false, getCurrentAppointment(itemData!));
    };
  }
}
