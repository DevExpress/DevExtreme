import eventRegistratorCallbacks from '@js/common/core/events/core/event_registrator_callbacks';
import $ from '@js/core/renderer';
import { isPlainObject } from '@ts/core/utils/m_type';
import eventsEngine from '@ts/events/core/m_events_engine';
import { addNamespace } from '@ts/events/utils/index';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

if (ko) {
  eventRegistratorCallbacks.add((name) => {
    const koBindingEventName = addNamespace(name, `${name}Binding`);

    ko.bindingHandlers[name] = {
      update(element, valueAccessor, allBindingsAccessor, viewModel): void {
        const $element = $(element);
        const unwrappedValue = ko.utils.unwrapObservable(valueAccessor());
        const eventSource = unwrappedValue.execute ? unwrappedValue.execute : unwrappedValue;

        eventsEngine.off($element, koBindingEventName);
        eventsEngine.on(
          $element,
          koBindingEventName,
          isPlainObject(unwrappedValue) ? unwrappedValue : {},
          (e) => {
            eventSource.call(viewModel, viewModel, e);
          },
        );
      },
    };
  });
}
