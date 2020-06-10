$(function(){
    DevExpress.setTemplateEngine("underscore");
    
    var treeViewWidget = $("#treeview").dxTreeView({
        dataSource: continents,
        width: 200,
        displayExpr: "text"
    }).dxTreeView("instance");
    
    var menuWidget = $("#menu").dxMenu({
        dataSource: continents 
    }).dxMenu("instance");
    
    var arabicAccordionOptions = {
        rtlEnabled: true,
        itemTitleTemplate: function(data) {
            return data.nameAr;
        },
        itemTemplate: $("#arabic-accordion-template")
    };
    
    var englishAccordionOptions = {
        rtlEnabled: false,
        itemTitleTemplate: function(data) {
            return data.nameEn;
        },
        itemTemplate: $("#english-accordion-template")
    };
    
    var accordionWidget = $("#accordion").dxAccordion(
        $.extend({
            dataSource: europeCountries
        },
        englishAccordionOptions)
    ).dxAccordion("instance");
    
    var languages = [
        "Arabic: Right-to-Left direction", 
        "English: Left-to-Right direction"
    ];
    
    $("#select-language").dxSelectBox({
        items: languages,
        value: languages[1],
        onValueChanged: function(data) {
            var isRTL = data.value === languages[0];

            $(".demo-container").toggleClass("dx-rtl", isRTL);

            $.each([treeViewWidget, menuWidget], function(_, instance){
                instance.option("rtlEnabled", isRTL);
                instance.option("displayExpr", isRTL ? "textAr" : "text");
            });

            accordionWidget.option(isRTL 
                ? arabicAccordionOptions 
                : englishAccordionOptions);
        }
    });
});