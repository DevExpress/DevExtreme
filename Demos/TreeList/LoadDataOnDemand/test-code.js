testUtils.importAnd(()=>'devextreme/ui/tree_list', ()=>DevExpress.ui.dxTreeList, function (dxTreeList) {    
    return new Promise(function(resolve){
        var instance = dxTreeList.getInstance(document.getElementById("treelist"));
        let timeoutId = setTimeout(resolve, 30000);
        instance.option("onContentReady", function() {
            clearTimeout(timeoutId);
            resolve();
        });

        instance.option("dataSource", {
            load: function() {
                return new Promise((resolve) => setTimeout(() => resolve([
                    {
                        "id": "App_Data",
                        "parentId": "",
                        "name": "App_Data",
                        "modifiedDate": "2021-08-05T07:19:02.8825692-07:00",
                        "createdDate": "2017-06-29T01:36:12.8161598-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "App_Start",
                        "parentId": "",
                        "name": "App_Start",
                        "modifiedDate": "2021-06-08T10:45:03.5163474-07:00",
                        "createdDate": "2017-06-29T01:36:12.8161598-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Content",
                        "parentId": "",
                        "name": "Content",
                        "modifiedDate": "2021-08-03T22:32:37.6161578-07:00",
                        "createdDate": "2017-06-29T01:36:56.9960013-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Controllers",
                        "parentId": "",
                        "name": "Controllers",
                        "modifiedDate": "2021-08-03T22:35:11.2548749-07:00",
                        "createdDate": "2017-06-29T01:37:53.8178789-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "fonts",
                        "parentId": "",
                        "name": "fonts",
                        "modifiedDate": "2021-08-03T22:35:11.7079766-07:00",
                        "createdDate": "2017-06-29T01:37:54.1772684-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Hubs",
                        "parentId": "",
                        "name": "Hubs",
                        "modifiedDate": "2021-08-03T22:35:11.7392266-07:00",
                        "createdDate": "2018-03-07T14:26:35.7884698-08:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Models",
                        "parentId": "",
                        "name": "Models",
                        "modifiedDate": "2021-08-03T22:35:14.0673698-07:00",
                        "createdDate": "2017-06-29T01:37:54.1928729-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Properties",
                        "parentId": "",
                        "name": "Properties",
                        "modifiedDate": "2021-06-08T10:48:09.4742786-07:00",
                        "createdDate": "2017-06-29T01:38:08.6763555-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Scripts",
                        "parentId": "",
                        "name": "Scripts",
                        "modifiedDate": "2021-08-03T22:35:41.8488563-07:00",
                        "createdDate": "2017-06-29T01:38:08.6920097-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "ViewModels",
                        "parentId": "",
                        "name": "ViewModels",
                        "modifiedDate": "2021-08-03T22:36:00.8018318-07:00",
                        "createdDate": "2017-06-29T01:38:50.7662343-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "Views",
                        "parentId": "",
                        "name": "Views",
                        "modifiedDate": "2021-08-03T22:36:00.8487067-07:00",
                        "createdDate": "2017-06-29T01:38:50.7974738-07:00",
                        "size": null,
                        "isDirectory": true,
                        "hasItems": true
                    },
                    {
                        "id": "DevExtreme.MVC.Demos.csproj",
                        "parentId": "",
                        "name": "DevExtreme.MVC.Demos.csproj",
                        "modifiedDate": "2018-05-24T06:54:04.9923136-07:00",
                        "createdDate": "2016-12-11T03:08:43.8450423-08:00",
                        "size": 115699,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "DevExtreme.MVC.Demos.wpp.targets",
                        "parentId": "",
                        "name": "DevExtreme.MVC.Demos.wpp.targets",
                        "modifiedDate": "2018-06-27T04:40:29.0365912-07:00",
                        "createdDate": "2018-01-24T10:09:40.6024283-08:00",
                        "size": 2698,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Extensions.cs",
                        "parentId": "",
                        "name": "Extensions.cs",
                        "modifiedDate": "2018-05-24T06:44:48.3899756-07:00",
                        "createdDate": "2016-12-11T03:08:43.8606604-08:00",
                        "size": 623,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "favicon.ico",
                        "parentId": "",
                        "name": "favicon.ico",
                        "modifiedDate": "2021-08-03T01:41:37-07:00",
                        "createdDate": "2019-10-03T22:27:24.5600719-07:00",
                        "size": 32038,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Global.asax",
                        "parentId": "",
                        "name": "Global.asax",
                        "modifiedDate": "2021-08-03T01:41:37-07:00",
                        "createdDate": "2019-10-03T22:27:24.5730715-07:00",
                        "size": 111,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Global.asax.cs",
                        "parentId": "",
                        "name": "Global.asax.cs",
                        "modifiedDate": "2018-05-24T06:44:48.4056021-07:00",
                        "createdDate": "2016-12-11T03:08:43.9075364-08:00",
                        "size": 1380,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "packages.config",
                        "parentId": "",
                        "name": "packages.config",
                        "modifiedDate": "2021-08-03T01:41:37-07:00",
                        "createdDate": "2019-10-03T22:27:24.6040716-07:00",
                        "size": 2593,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Startup.cs",
                        "parentId": "",
                        "name": "Startup.cs",
                        "modifiedDate": "2018-05-24T06:44:50.4182136-07:00",
                        "createdDate": "2018-03-05T06:55:17.4367145-08:00",
                        "size": 450,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Web.config",
                        "parentId": "",
                        "name": "Web.config",
                        "modifiedDate": "2021-08-03T07:01:32.4098834-07:00",
                        "createdDate": "2019-10-03T22:27:24.6460716-07:00",
                        "size": 7357,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Web.Debug.config",
                        "parentId": "",
                        "name": "Web.Debug.config",
                        "modifiedDate": "2018-05-24T06:44:55.4430283-07:00",
                        "createdDate": "2016-12-11T03:08:43.9231614-08:00",
                        "size": 1271,
                        "isDirectory": false,
                        "hasItems": false
                    },
                    {
                        "id": "Web.Release.config",
                        "parentId": "",
                        "name": "Web.Release.config",
                        "modifiedDate": "2018-05-24T06:44:55.4586103-07:00",
                        "createdDate": "2016-12-11T03:08:43.9387873-08:00",
                        "size": 1332,
                        "isDirectory": false,
                        "hasItems": false
                    }
                ])), 100);
            }
          });
    });
});
