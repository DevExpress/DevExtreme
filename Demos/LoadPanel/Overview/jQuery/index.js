$(function(){
    var showLoadPanel = function() {
        loadPanel.show();
        showEmployeeInfo({});
    };
    
    var showEmployeeInfo = function(employee) {
        $(".birth-date").text(employee.Birth_Date || "");
        $(".city").text(employee.City || "");
        $(".zipcode").text(employee.Zipcode || "");
        $(".address-info").text(employee.Address || "");
        $(".mobile-phone").text(employee.Mobile_Phone || "");
        $(".email").text(employee.Email || "");
    };
    
    $(".show-panel").dxButton({
        text: "Load Data", 
        onClick: showLoadPanel 
    });
    
    
    var loadPanel = $(".loadpanel").dxLoadPanel({
        shadingColor: "rgba(0,0,0,0.4)",
        position: { of: "#employee" },
        visible: false,
        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        onShown: function(){
            setTimeout(function () { 
                loadPanel.hide();          
            }, 3000);
        },
        onHidden: function(){
            showEmployeeInfo(employee);
        }      
    }).dxLoadPanel("instance");
    
    $(".with-indicator").dxCheckBox({
        value: true,
        text: "With indicator",
        onValueChanged: function(e) {
            loadPanel.option("showIndicator", e.value);
        }
    });
    
    $(".with-overlay").dxCheckBox({
        value: true,
        text: "With overlay",
        onValueChanged: function(e) {
            loadPanel.option("shading", e.value);
        }
    });
    
    $(".with-pane").dxCheckBox({
        value: true,
        text: "With pane",
        onValueChanged: function(e) {
            loadPanel.option("showPane", e.value);
        }
    });
    
    $(".outside-click").dxCheckBox({
        value: false,
        text: "Close on outside click",
        onValueChanged: function(e) {
            loadPanel.option("closeOnOutsideClick", e.value);
        }
    });
});