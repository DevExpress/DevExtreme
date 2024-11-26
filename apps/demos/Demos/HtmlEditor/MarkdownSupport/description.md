DevExtreme HTML Editor uses HTML markup to format its document content. This demo module converts content to Markdown with the help of the [unified](https://github.com/unifiedjs/unified) plugin library.

The code sets the the editor's [converter](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/converter/) property to an object that implements two functions: [toHtml](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/converter/#toHtml) and [fromHtml](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/converter/#fromHtml). 

Try to edit or format text in the HTML Editor control and see how the Markdown Preview section reflects those changes. 
<!--split-->