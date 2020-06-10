window.onload = function() {
    var filterBuilderValue = ko.observable(filter),
        dataGridFilter = ko.observable(filter);

    var viewModel = {
        filterBuilderOptions: {
            fields: fields,
            value: filterBuilderValue
        },

        buttonOptions: {
            text: "Apply Filter",
            type: "default",
            onClick: function() {
                dataGridFilter(filterBuilderValue());
            },
        },

        dataGridOptions: {
            columns: fields,
            showBorders: true,
            dataSource: {
                store: {
                    type: "odata",
                    fieldTypes: {
                        "Product_Cost": "Decimal",
                        "Product_Sale_Price": "Decimal",
                        "Product_Retail_Price": "Decimal"
                    },
                    url: "https://js.devexpress.com/Demos/DevAV/odata/Products"
                },
                select: [
                    "Product_ID",
                    "Product_Name",
                    "Product_Cost",
                    "Product_Sale_Price",
                    "Product_Retail_Price",
                    "Product_Current_Inventory"
                ]
            },
            filterValue: dataGridFilter,
            height: 300
        }
    };

    ko.applyBindings(viewModel, document.getElementById("demo"));
};