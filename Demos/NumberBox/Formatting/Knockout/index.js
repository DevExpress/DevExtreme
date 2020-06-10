window.onload = function() {
    var viewModel = {
            currencyFormat: {
                format: "$ #,##0.##",
                value: 14500.55
            },
            accountingFormat: {
                format: "$ #,##0.##;($ #,##0.##)",
                value: -2314.12
            },
            percentFormat: {
                format: "#0%",
                value: 0.15,
                step: 0.01
            },
            fixedPointFormat: {
                format: "#,##0.00",
                value: 13415.24
            },
            weightFormat: {
                format: "#0.## kg",
                value: 3.14
            }
    };
    
    ko.applyBindings(viewModel, document.getElementsByClassName("demo-container")[0]);
};