window.onload = function() {
    var viewModel = {
        navData: navData,
        navSelectedIndex: ko.observable(0),
        listData: [{
            data: new DevExpress.data.DataSource({
                store: contacts,
                sort: "name"
            })
        },
            {
                data: new DevExpress.data.DataSource({
                    store: contacts,
                    sort: "name",
                    filter: ["category", "=", "Missed"]
                })
            },
            {
                data: new DevExpress.data.DataSource({
                    store: contacts,
                    sort: "name",
                    filter: ["category", "=", "Favorites"]
                })
            }
    
        ],
        currentData: ko.observable()
    };
    
    viewModel.currentData(viewModel.listData[0].data);
    viewModel.navSelectedIndex.subscribe(function (newValue) {
        viewModel.currentData(viewModel.listData[newValue].data);
    });
    
    ko.applyBindings(viewModel, document.getElementById("navbar"));
};