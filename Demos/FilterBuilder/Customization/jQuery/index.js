$(function() {
    $("#filterBuilder").dxFilterBuilder({
        fields: fields,
        value: filter,
        maxGroupLevel: 1,
        groupOperations: ["and", "or"],
        onValueChanged: updateTexts,
        onInitialized: updateTexts,
        customOperations: [{
            name: "anyof",
            caption: "Is any of",
            icon: "check",
            editorTemplate: function(conditionInfo) {
                return $("<div>").dxTagBox({
                    value: conditionInfo.value,
                    items: categories,
                    onValueChanged: function(e) {
                        conditionInfo.setValue(e.value && e.value.length ? e.value : null);
                    },
                    width: "auto"
                });
            },
            calculateFilterExpression: function(filterValue, field) {
                return filterValue && filterValue.length
                    && Array.prototype.concat.apply([], filterValue.map(function(value) {
                        return [[field.dataField, "=", value], "or"];
                    })).slice(0, -1);
            }
        }]
    });

    function updateTexts(e) {
        $("#filterText").text(formatValue(e.component.option("value")));
        $("#dataSourceText").text(formatValue(e.component.getFilterExpression()));
    }

    function formatValue(value, spaces) {
        if(value && Array.isArray(value[0])) {
            var TAB_SIZE = 4;
            spaces = spaces || TAB_SIZE;
            return "[" + getLineBreak(spaces) + value.map(function(item) {
                return Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item);
            }).join("," + getLineBreak(spaces)) + getLineBreak(spaces - TAB_SIZE) + "]";
        }
        return JSON.stringify(value);
    }

    function getLineBreak(spaces) {
        return "\r\n" + new Array(spaces + 1).join(" ");
    }
});