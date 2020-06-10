var filter = [
        ["Category", "anyof", ["Automation", "Monitors"]],
        "or",
        [
            ["Category", "=", "Televisions"],
            "and",
            ["Price", "between", [2000, 4000]]
        ]
    ],
    categories = [
        "Video Players",
        "Televisions",
        "Monitors",
        "Projectors",
        "Automation"
    ],
    fields = [{
            dataField: "Name"
        }, {
            dataField: "Price",
            dataType: "number",
            format: "currency"
        }, {
            dataField: "Current_Inventory",
            dataType: "number",
            caption: "Inventory"
        }, {
            dataField: "Category",
            filterOperations: ["=", "anyof"],
            lookup: {
                dataSource: categories
            }
        }
    ];
