# DevExtreme

DevExtreme supplies HTML/JS tools for mobile and web development.

- **A blazing-fast HTML5 Data Grid and rich libraries of high-performance touch-enabled data visualization and UI widgets**  
DevExtreme ships with a rich library of client-side widgets that can be used in **any** web application and on any website.

- **DevExtreme SPA framework**  
DevExtreme allows you to build HTML/JS applications that can be packed as native mobile applications using the PhoneGap Build and can then be installed on mobile devices. When installed, DevExtreme applications look and behave like native mobile applications.


## Installation

If you plan to use DevExtreme Widgets in an Angular 2 application, please install [``devextreme-angular``](https://www.npmjs.com/package/devextreme-angular) package.

To add DevExtreme to your application, use the following command:
```
npm install devextreme
```

To use the DevExtreme Bundler tool, install the package globally:
```
npm install -g webpack
npm install -g devextreme
```

NOTE: DevExtreme doesn't use semantic versioning. The increment of the first or middle number means a major release and can contain changes, which break backward compatibility. If you want to use only minor updates in your application, specify an appropriate range in the package.json (a patch release in semver corresponds to a minor DevExtreme version). For example, to use the DevExtreme package from 17.1.5 and above without breaking changes, the range will be: 17.1 or 17.1.x or ~17.1.5. 

## Basic Usage

*   Add themes to your application:
    ```html
    <link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.light.css" />
    ```
    You can replace ``dx.light.css`` with one of [Predefined themes](https://js.devexpress.com/Documentation/16_1/Guide/Themes/Predefined_Themes/).

*   If you use **WebPack**, use this syntax to specify required modules:
    ```js
    var $ = require('jquery');
    require('devextreme/ui/button');
    ```
     
    If you use **jspm**, use this syntax instead:
    ```js
    import $ from 'jquery';
    import 'devextreme/ui/button';
    ```

For more information about different approaches and available modules, please read [this documentation article](https://js.devexpress.com/Documentation/16_1/Guide/Common/Modularity/).


## Documentation

To start with DevExtreme, go through the steps given on the [start page](http://js.devexpress.com/Documentation/) of the documentation.

While using DevExtreme, the [videos](http://js.devexpress.com/Documentation/Videos/), [tutorials](http://js.devexpress.com/Documentation/Tutorials/), [guides](http://js.devexpress.com/Documentation/Guide/) and [API reference](http://js.devexpress.com/Documentation/ApiReference/) provided with the documentation will be helpful.


## Demos

Take a look at the DevExtreme demos.

- [Web apps](http://js.devexpress.com/Demos/)  
Sample real-world apps built using the DevExtreme tools.

- [Widgets Gallery](http://js.devexpress.com/Demos/WidgetsGallery/)  
A vast collection of code samples illustrating the usage of DevExtreme widgets.


## License

Read about DevExtreme licensing here: [https://js.devexpress.com/Licensing](https://js.devexpress.com/Licensing).


## Support

In case of any questions regarding the use of DevExtreme, please refer to our [Support Center](https://www.devexpress.com/Support/Center).
