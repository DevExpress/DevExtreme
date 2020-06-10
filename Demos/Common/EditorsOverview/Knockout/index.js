window.onload = function() {
    var viewModel = function() {
        var that = this;
        this.color = ko.observable("#f05b41");
        this.text = ko.observable("UI Superhero");
        this.width = ko.observable(370);
        this.height = ko.observable(260);
        this.transform = ko.observable("scaleX(1)");
        this.border = ko.observable(false);

        this.width.subscribe(function(width){
            that.height(width*26/37);
        });

        this.height.subscribe(function(height){
            that.width(height*37/26);
        });

        this.transformations = [
            {
                key: "Flip",
                items: [ 
                    { name: "0 degrees", value: "scaleX(1)" }, 
                    { name: "180 degrees", value: "scaleX(-1)" }
                ]
            },
            {
                key: "Rotate",
                items: [
                    { name: "0 degrees", value: "rotate(0)" },
                    { name: "15 degrees", value: "rotate(15deg)" },
                    { name: "30 degrees", value: "rotate(30deg)" },
                    { name: "-15 degrees", value: "rotate(-15deg)" },
                    { name: "-30 degrees", value: "rotate(-30deg)" }
                ]
            }
        ];
    };
    ko.applyBindings(new viewModel(), document.getElementById("picture-processor"));
};
