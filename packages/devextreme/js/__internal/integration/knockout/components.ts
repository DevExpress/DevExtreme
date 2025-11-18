import { getImageContainer } from '@ts/core/utils/m_icon';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

if (ko) {
  ko.bindingHandlers.dxControlsDescendantBindings = {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    init(_, valueAccessor) {
      return {
        controlsDescendantBindings: ko.unwrap(valueAccessor()),
      };
    },
  };

  ko.bindingHandlers.dxIcon = {
    init(element, valueAccessor): void {
      const options = ko.utils.unwrapObservable(valueAccessor()) || {};
      const iconElement = getImageContainer(options);

      ko.virtualElements.emptyNode(element);
      if (iconElement) {
        ko.virtualElements.prepend(element, iconElement.get(0));
      }
    },
    update(element, valueAccessor): void {
      const options = ko.utils.unwrapObservable(valueAccessor()) || {};
      const iconElement = getImageContainer(options);

      ko.virtualElements.emptyNode(element);
      if (iconElement) {
        ko.virtualElements.prepend(element, iconElement.get(0));
      }
    },
  };
  ko.virtualElements.allowedBindings.dxIcon = true;
}
