var ko = require("knockout"),
    each = require("../core/utils/iterator").each,
    KoTemplate = require("../integration/knockout/template");

var mergeWithReplace = function(targetArray, arrayToMerge, needReplaceFn) {
    var result = [];
    for(var i = 0, length = targetArray.length; i < length; i++) {
        if(!needReplaceFn(targetArray[i], arrayToMerge)) {
            result.push(targetArray[i]);
        }
    }
    result.push.apply(result, arrayToMerge);
    return result;
};

var prepareCommandToReplace = function(targetCommand, commandsToMerge) {
    var needToReplace = false;

    each(commandsToMerge, function(_, commandToMerge) {
        var idEqual = (targetCommand.option("id") === commandToMerge.option("id") && commandToMerge.option("id")),
            behaviorEqual = (targetCommand.option("behavior") === commandToMerge.option("behavior") && targetCommand.option("behavior"));

        needToReplace = idEqual || behaviorEqual;

        if(behaviorEqual && commandToMerge.option("onExecute") === null) {
            commandToMerge.option("onExecute", targetCommand.option("onExecute"));
        }

        if(needToReplace) {
            targetCommand.$element().remove();
            return false;
        }
    });

    return needToReplace;
};

var mergeCommands = function(targetCommands, commandsToMerge) {
    return mergeWithReplace(targetCommands, commandsToMerge, prepareCommandToReplace);
};

var resolvePropertyValue = function(command, containerOptions, propertyName, defaultValue) {
    var containerOption = containerOptions ? containerOptions[propertyName] : undefined,
        defaultOption = containerOption === undefined ? defaultValue : containerOption,
        commandOption = command.option(propertyName);

    return commandOption === undefined || commandOption === defaultValue ? defaultOption : commandOption;
};

var resolveTextValue = function(command, containerOptions) {
    var showText = resolvePropertyValue(command, containerOptions, "showText"),
        hasIcon = !!command.option("icon"),
        titleValue = resolvePropertyValue(command, containerOptions, "title", "");

    return showText || !hasIcon ? titleValue : "";
};

var resolveIconValue = function(command, containerOptions) {
    var showIcon = resolvePropertyValue(command, containerOptions, "showIcon"),
        hasText = !!command.option("title"),
        iconValue = resolvePropertyValue(command, containerOptions, "icon", "");

    return (showIcon || !hasText) ? iconValue : "";
};

exports.utils = {
    mergeCommands: mergeCommands,
    commandToContainer: {
        resolveIconValue: resolveIconValue,
        resolveTextValue: resolveTextValue,
        resolvePropertyValue: resolvePropertyValue
    }
};
exports.templateProvider = {

    createTemplate: function(element) {
        return new KoTemplate(element);
    },

    applyTemplate: function(element, model) {
        ko.applyBindings(model, element);
    }

};
