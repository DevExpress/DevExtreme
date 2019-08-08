# DevExtreme

[![Build Status](https://devextreme-ci.devexpress.com/api/badges/DevExpress/DevExtreme/status.svg?branch=19_2)](https://devextreme-ci.devexpress.com/DevExpress/DevExtreme)

Voted the best cross-platform component suite containing everything you need to create responsive web apps for touch devices and traditional desktops: data grid, interactive charts, data editors, navigation and multi-purpose widgets that are designed to look great and provide powerful functionality in any browser.

- Official website: [js.devexpress.com](https://js.devexpress.com)
- Pricing: [js.devexpress.com/buy](https://js.devexpress.com/Buy)
- Licensing: [js.devexpress.com/licensing](https://js.devexpress.com/Licensing)
- Support: [www.devexpress.com/support](https://www.devexpress.com/support)

## Download and Install

To include DevExtreme to your project, use one of the distribution packages. If you use Visual Studio, then use the Windows installer for added features like project templates. Alternatively, download a plain zip archive of just the client-side library and its widgets:

- [Install from NPM](https://js.devexpress.com/Documentation/Guide/Getting_Started/Installation/npm_Package/)
- [Install via Bower](https://js.devexpress.com/Documentation/Guide/Getting_Started/Installation/Bower_Package/)
- [Install from NuGet](https://js.devexpress.com/Documentation/Guide/Getting_Started/Installation/NuGet_Package/)
- [Windows Installer](https://js.devexpress.com/Downloading/DevExtremeComplete/) - Provides benefits for developers who use Visual Studio
- [ZIP Archive](https://js.devexpress.com/Downloading/DevExtremeCompleteZip/)


## Getting Started

After installation, you can add a widget to your app. Here's a simple button example:

```html
<div id="buttonContainer"></div>
```

```js
var element = document.getElementById('buttonContainer');
var button = new DevExpress.ui.dxButton(element, { text: 'Hello World!' });
```

DevExtreme supports deep integration with the following client-side technologies:

- [jQuery](https://js.devexpress.com/Documentation/Guide/Getting_Started/Widget_Basics_-_jQuery/Create_and_Configure_a_Widget/)
- [Angular](https://github.com/DevExpress/devextreme-angular#readme)
- [React](https://github.com/DevExpress/devextreme-react#readme)
- [Vue](https://github.com/DevExpress/devextreme-vue#readme)

And server-side frameworks:

- [ASP.NET MVC & ASP.NET Core](https://js.devexpress.com/Documentation/Guide/ASP.NET_MVC_Controls/Fundamentals/)

## Learn

- [Online Demos](https://js.devexpress.com/Demos/)
- [Documentation](https://js.devexpress.com/Documentation)
- [Examples on GitHub](https://github.com/DevExpress/DevExtreme-examples)
- [YouTube videos](https://www.youtube.com/watch?v=oWWL6iILMPM&list=PL8h4jt35t1wjGvgflbHEH_e3b23AA30-z)


## Contributing

See our [Guidelines for Contributing](CONTRIBUTING.md)
