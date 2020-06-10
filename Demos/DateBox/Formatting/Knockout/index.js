window.onload = function() {
    var date = new Date(2018, 9, 16, 15, 8, 12);

    var viewModel = {
        default: {
            placeholder: "12/31/2018, 2:52 PM",
            showClearButton: true,
            type: "datetime",
            useMaskBehavior: true
        },
        constant: {
            placeholder: "10/16/2018",
            showClearButton: true,
            useMaskBehavior: true,
            displayFormat: "shortdate",
            type: "date",
            value: date
        },
        pattern: {
            placeholder: "Tuesday, 16 of Oct, 2018 14:52",
            showClearButton: true,
            useMaskBehavior: true,
            displayFormat: "EEEE, d of MMM, yyyy HH:mm",
            value: date
        },
        escape: {
            placeholder: "Year: 2018",
            showClearButton: true,
            useMaskBehavior: true,
            displayFormat: "'Year': yyyy",
            type: "date",
            value: date
        }
    };

    ko.applyBindings(viewModel, document.getElementById("date-box-demo"));
};