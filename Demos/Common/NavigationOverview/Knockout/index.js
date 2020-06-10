window.onload = function() {
    var countryData = ko.observable(continents[0].items[0]);
    var citiesData = ko.observableArray(countryData().cities);
    var tabPanelIndex = ko.observable(0);

    var viewModel = {
        countryData: countryData,
        treeViewOptions: {
            dataSource: continents,
            selectionMode: "single",
            selectByClick: true,
            onItemSelectionChanged: function(e) {
                var currentCountryData = e.itemData;
                if(currentCountryData.cities) {
                    countryData(currentCountryData);
                    citiesData(currentCountryData.cities);
                    tabPanelIndex(0);
                }
            }
        },
        tabPanelOptions: {
            dataSource: citiesData,
            animationEnabled: true,
            selectedIndex: tabPanelIndex,
            itemTitleTemplate: "title",
            itemTemplate: "city-template"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("overview"));
};