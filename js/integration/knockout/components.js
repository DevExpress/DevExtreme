const ko = require('knockout');
const iconUtils = require('../../core/utils/icon');

ko.bindingHandlers.dxControlsDescendantBindings = {
    init: function(_, valueAccessor) {
        return {
            controlsDescendantBindings: ko.unwrap(valueAccessor())
        };
    }
};

ko.bindingHandlers.dxIcon = {
    init: function(element, valueAccessor) {
        const options = ko.utils.unwrapObservable(valueAccessor()) || {};
        const iconElement = iconUtils.getImageContainer(options);

        ko.virtualElements.emptyNode(element);
        if(iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0));
        }
    },
    update: function(element, valueAccessor) {
        const options = ko.utils.unwrapObservable(valueAccessor()) || {};
        const iconElement = iconUtils.getImageContainer(options);

        ko.virtualElements.emptyNode(element);
        if(iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0));
        }
    }
};
ko.virtualElements.allowedBindings.dxIcon = true;
