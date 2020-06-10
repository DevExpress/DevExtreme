$(function(){
    var now = new Date();
    
    $("#date").dxDateBox({
        type: "date",
        value: now
    });
    
    $("#time").dxDateBox({
        type: "time",
        value: now
    });
    
    $("#date-time").dxDateBox({
        type: "datetime",
        value: now
    });
    
    $("#custom").dxDateBox({
        displayFormat: "EEEE, MMM dd",
        value: now
    });
    
    $("#date-by-picker").dxDateBox({
        pickerType: "rollers",
        value: now
    });
    
    $("#disabled").dxDateBox({
        type: "datetime",
        disabled: true,
        value: now
    });

    $("#disabledDates").dxDateBox({
        type: "date",
        pickerType: "calendar",
        value: new Date(2017, 0, 3),
        disabledDates: federalHolidays
    });
    
    $("#clear").dxDateBox({
        type: "time",
        showClearButton: true,
        value: new Date(2015, 11, 1, 6)
    });
    
    var startDate = new Date(1981, 3, 27);
    
    $("#birthday").dxDateBox({
        applyValueMode: "useButtons",
        value: startDate,
        max: new Date(),
        min: new Date(1900, 0, 1),
        onValueChanged: function(data) {
            dateDiff(new Date(data.value));
        }
    });
    
    function dateDiff(date) {
        var diffInDay = Math.floor(Math.abs((new Date() - date)/(24*60*60*1000)));
        return $("#age").text(diffInDay + " days");
    }
    
    dateDiff(startDate);
});