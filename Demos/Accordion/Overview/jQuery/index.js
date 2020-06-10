$(function(){
    DevExpress.setTemplateEngine("underscore");
    
    var tagBox = $("#tagbox").dxTagBox({
        dataSource: accordionItems,
        displayExpr: "CompanyName",
        disabled: true,
        value: [accordionItems[0]],
        onValueChanged: function(e) {
            accordion.option("selectedItems", e.value);
        }
    }).dxTagBox("instance");
    
    var accordion = $("#accordion-container").dxAccordion({
        dataSource: accordionItems,
        animationDuration: 300,
        collapsible: false,
        multiple: false,
        selectedItems: [accordionItems[0]],
        itemTitleTemplate: $("#title"),
        itemTemplate: $("#customer"),
        onSelectionChanged: function(e) {
            tagBox.option("value", e.component.option("selectedItems"));
        }
    }).dxAccordion("instance");
    
    $("#slider").dxSlider({
        min: 0,
        max: 1000,
        value: 300,
        label: { visible: true},
        tooltip: { 
            enabled: true,
            position: "bottom"
        },
        onValueChanged: function(e) {
            accordion.option("animationDuration", e.value);
        }
    });
    
    
    $("#multiple-enabled").dxCheckBox({
        text: "Multiple enabled",
        onValueChanged: function(e) {
            accordion.option("multiple", e.value);
            tagBox.option("disabled", !e.value);
            tagBox.option("value", accordion.option("selectedItems"));
        }
    });
    
    $("#collapsible-enabled").dxCheckBox({
        text: "Collapsible enabled",
        onValueChanged: function(e) {
            accordion.option("collapsible", e.value);
        }
    });
});