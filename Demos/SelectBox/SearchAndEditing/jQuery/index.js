$(function () {
    var searchBox = $("#searchBox").dxSelectBox({
        dataSource: products,
        displayExpr: "Name",
        valueExpr: "ID",
        searchEnabled: true
    }).dxSelectBox("instance");

    var productsDataSource = new DevExpress.data.DataSource({
        store: {
            data: simpleProducts,
            type: "array",
            key: "ID"
        }
    });

    $("#editBox").dxSelectBox({
        dataSource: productsDataSource,
        displayExpr: "Name",
        valueExpr: "ID",
        value: simpleProducts[0].ID,
        acceptCustomValue: true,
        onValueChanged: function (data) {
            var $result = $(".current-value");

            if (data.value) {
                var selectedItem = data.component.option('selectedItem');
                $result.text(selectedItem.Name + " (ID: " + selectedItem.ID + ")");
            } else {
                $result.text("Not selected");
            }
        },
        onCustomItemCreating: function (data) {
            if (!data.text) {
                data.customItem = null;
                return;
            }

            var productIds = simpleProducts.map(function (item) {
                return item.ID;
            });
            var incrementedId = Math.max.apply(null, productIds) + 1;
            var newItem = {
                Name: data.text,
                ID: incrementedId
            };
            data.customItem = productsDataSource.store().insert(newItem)
                .then(() => productsDataSource.load())
                .then(() => {
                    return newItem;
                })
                .catch((error) => {
                    throw error;
                });
        }
    })

    $("#searchModeOption").dxSelectBox({
        items: ["contains", "startswith"],
        value: "contains",
        onValueChanged: function (e) {
            searchBox.option("searchMode", e.value);
        }
    });

    $("#searchExprOption").dxSelectBox({
        items: [{
            name: "'Name'",
            value: "Name"
        }, {
            name: "['Name', 'Category']",
            value: ['Name', 'Category']
        }],
        displayExpr: "name",
        valueExpr: "value",
        value: "Name",
        onValueChanged: function (e) {
            searchBox.option("searchExpr", e.value);
        }
    });

    $("#searchTimeoutOption").dxNumberBox({
        min: 0,
        max: 5000,
        value: 200,
        showSpinButtons: true,
        step: 100,
        onValueChanged: function (e) {
            searchBox.option("searchTimeout", e.value);
        }
    });

    $("#minSearchLengthOption").dxNumberBox({
        min: 0,
        max: 5,
        value: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {
            searchBox.option("minSearchLength", e.value);
        }
    });

    $("#showDataBeforeSearchOption").dxCheckBox({
        value: false,
        text: "Show Data Before Search",
        onValueChanged: function (e) {
            searchBox.option("showDataBeforeSearch", e.value);
        }
    });
});