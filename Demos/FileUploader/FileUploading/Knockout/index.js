window.onload = function() {
    var viewModel = function(){
        var that = this;
        that.multiple = ko.observable(false);
        that.accept = ko.observable("*");
        that.value = ko.observableArray();
        that.uploadMode = ko.observable("instantly");
        that.showUploadedFiles = ko.computed(
            function(){
                return that.value().length > 0;
            }
        );
    
        that.options = {
            multiple: that.multiple,
            accept: that.accept,
            value: that.value,
            uploadMode: that.uploadMode,
            uploadUrl: "https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        };
        
        that.acceptOptions = {
            dataSource: [
                {name: "All types", value: "*"}, 
                {name: "Images", value: "image/*"}, 
                {name: "Videos", value: "video/*"}
            ],
            valueExpr: "value",
            displayExpr: "name",
            value: that.accept
        };
        
        that.uploadOptions = {
            items: ["instantly", "useButtons"],
            value: that.uploadMode
        };
    };
    
    ko.applyBindings(new viewModel(), document.getElementById("fileuploader"));
};