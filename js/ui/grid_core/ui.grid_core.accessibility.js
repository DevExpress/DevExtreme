import accessibility from '../../ui/shared/accessibility';

module.exports = {
    registerKeyboardAction: function(viewName, instance, $element, selector, action) {
        const keyboardController = instance.getController('keyboardNavigation');
        if(instance.option('useLegacyKeyboardNavigation') || (keyboardController && !keyboardController.isKeyboardEnabled())) {
            return;
        }

        const executeKeyDown = args => {
            instance.executeAction('onKeyDown', args);
        };

        instance.createAction('onKeyDown');

        accessibility.registerKeyboardAction(viewName, instance, $element, selector, action, executeKeyDown);
    }
};
