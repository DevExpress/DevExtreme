import * as accessibility from '@js/ui/shared/accessibility';

export const registerKeyboardAction = function (viewName, instance, $element, selector, action) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let executeKeyDown = (args) => {};
  const keyboardController = instance.getController('keyboardNavigation');
  if (instance.option('useLegacyKeyboardNavigation') || (keyboardController && !keyboardController.isKeyboardEnabled())) {
    return;
  }

  if (viewName === 'filterPanel') {
    executeKeyDown = (args) => {
      instance.executeAction('onKeyDown', args);
    };

    instance.createAction('onKeyDown');
  }

  accessibility.registerKeyboardAction(viewName, instance, $element, selector, action, executeKeyDown);
};
