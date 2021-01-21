$(function(){
    var employee = {},
        popup = null,
        popupOptions = {
            width: 300,
            height: 250,
            contentTemplate: function() {
                return $("<div />").append(
                    $("<p>Full Name: <span>" + employee.FirstName +
                        "</span> <span>" + employee.LastName + "</span></p>"),
                    $("<p>Birth Date: <span>" + employee.BirthDate + "</span></p>"),
                    $("<p>Address: <span>" + employee.Address + "</span></p>"),
                    $("<p>Hire Date: <span>" + employee.HireDate + "</span></p>"),
                    $("<p>Position: <span>" + employee.Position + "</span></p>")
                );
            },
            showTitle: true,
            title: "Information",
            dragEnabled: false,
            closeOnOutsideClick: true
    };

    var showInfo = function(data) {
        employee = data;

        if(popup) {
            popup.option("contentTemplate", popupOptions.contentTemplate.bind(this));
        } else {
            popup = $("#popup").dxPopup(popupOptions).dxPopup("instance");
        }

        popup.show();
    };

    $.each(employees, function(i, employee) {
        $("<li />").append(
            $("<img />").attr("src", employee.Picture),
            $("<br />"),
            $("<span />").html("<i>" + employee.FirstName + "</i>"),
            $("<span />").html(" <i>" + employee.LastName  + "</i>"),
            $("<br />"),
            $("<div />")
                .addClass("button-info")
                .dxButton({
                    text: "Details",
                    onClick: function() {
                        showInfo(employee);
                    }
                })
        ).appendTo($("#employees"));
    });
});