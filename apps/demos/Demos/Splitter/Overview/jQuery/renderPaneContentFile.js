(function($) {

    $.fn.createElementWithClass = function(text, className) {
        return $("<div>").text(text).addClass(className);
    };

    $.fn.getStateText = function(data) {
        if(data.resizable !== false && !data.collapsible) {
            return 'Resizable only';
        }
        
        return `${data.resizable ? "Resizable" : "Non-resizable"} and ${data.collapsible ? "collapsible" : "non-collapsible"}`;
    };

    $.fn.paneContentTemplate = function(data, paneName) {
        const $content = $.fn.createElementWithClass("", "pane-content");

        $content.append($.fn.createElementWithClass(paneName, "pane-title"));

        $content.append($.fn.createElementWithClass($.fn.getStateText(data), "pane-state"));

        const dimensionOptions = new Set(["size", "minSize", "maxSize"]);

        Object.entries(data)
            .filter(([key]) => dimensionOptions.has(key))
            .forEach(([key, value]) => {
                $content.append($.fn.createElementWithClass(`${key}: ${value}`, "pane-option"));
            });
        
            
        return $content;
    };
})(jQuery);
