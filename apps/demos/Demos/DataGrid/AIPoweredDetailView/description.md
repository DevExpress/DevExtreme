This sample integrates AI-generated insights into the DevExtreme [DataGrid](/Documentation/Guide/UI_Components/DataGrid/Overview/) [master-detail interface](/Documentation/Guide/UI_Components/DataGrid/Master-Detail_Interface/), extending the component's built-in AI-powered data analysis features. While built-in [AI columns](/Demos/WidgetsGallery/Demo/DataGrid/AIColumns/) generate content for every row in the DataGrid, this approach generates AI-enhanced data only when users expand specific master-detail rows. By limiting AI processing to the rows that require additional context, the sample significantly reduces token consumption, improves generation performance, and provides a more efficient solution for usage scenarios wherein AI-generated content is not needed across the entire dataset.

To initiate the AI Assistant, click the **AI** icon on the left side of a row and enter a prompt.

<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of AI-powered Detail Views.

When connected to your own AI model/service without rate and data limits, AI-powered Detail Views will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

To surface AI-generated insights within the DataGrid, this sample uses the [master-detail template](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/masterDetail/#template) together with DevExtreme [TextBox](/Documentation/Guide/UI_Components/TextBox/Overview/) and [Button](/Documentation/Guide/UI_Components/Button/Overview/) components. A [ButtonGroup](/Documentation/Guide/UI_Components/ButtonGroup/Getting_Started_with_ButtonGroup/) provides prompt suggestions, delivering an experience similar to the DevExtreme Chat [Suggestions](/Demos/WidgetsGallery/Demo/Chat/PromptSuggestions/) demo. When a user submits a prompt, the corresponding detail row expands and displays a [LoadPanel](/Documentation/Guide/UI_Components/LoadPanel/Overview/) while the AI processes the request. Once generation is complete, the response is rendered in a [read-only](/Documentation/ApiReference/UI_Components/dxTextArea/Configuration/#readOnly) [TextArea](/Documentation/Guide/UI_Components/TextArea/Getting_Started_with_TextArea/), allowing users to review AI-generated content directly within the DataGrid without leaving the current context.
