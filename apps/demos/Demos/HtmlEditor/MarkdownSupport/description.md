The DevExtreme HTML Editor uses HTML markup to format document content. This demo module converts content to Markdown using the [unified](https://github.com/unifiedjs/unified) plugin library.

This sample implementation sets the HTML Editor's [converter](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/converter/) property to an object that implements two functions: [toHtml](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/converter/#toHtml) and [fromHtml](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/converter/#fromHtml). 

To review our implementation, edit or format text within the HTML Editor control and see how the Markdown Preview section reflects changes. 
<!--split-->