window.onload = function() {
    var viewModel = {
        formOptions: {
            formData: employees,
            colCount: 2,
            items: [{
                    itemType: "group",
                    caption: "System Information",
                    items: ["ID","FirstName", "LastName", "HireDate", "Position", "OfficeNo"]
                }, {
                    itemType: "group",
                    caption: "Personal Data",
                    items: ["BirthDate", {
                        itemType: "group",
                        caption: "Home Address",
                        items: ["Address", "City", "State", "Zipcode"]
                    }]
                }, {
                    itemType: "group",
                    caption: "Contact Information",
                    items: [{
                        itemType: "tabbed",
                        tabPanelOptions: {
                            deferRendering: false
                        },
                        tabs: [{
                            title: "Phone",
                            items: ["Phone"]
                        }, {
                            title: "Skype",
                            items: ["Skype"]
                        }, {
                            title: "Email",
                            items: ["Email"]
                        }]
                    }]
            }]
               
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("form-demo"));
};