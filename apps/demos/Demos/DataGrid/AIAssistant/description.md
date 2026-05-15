The DevExtreme [DataGrid](https://js.devexpress.com/Documentation/Guide/UI_Components/DataGrid/Overview/) component ships with our AI Assistant feature. This capability allows you to interact with the component using natural language. In this demo, the AI Assistant is enabled for a DataGrid that displays mock sale data with over 1500 records.

The AI Assistant feature is also available for the DevExtreme [TreeList](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#aiAssistant) component.
<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of the DataGrid AI Assistant.

When connected to your own AI model/service without rate and data limits, the AI Assistant will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

The AI Assistant supports DataGrid features such as:

- [Filtering and Searching](/Documentation/Guide/UI_Components/DataGrid/Filtering_and_Searching/)
- [Sorting](/Documentation/Guide/UI_Components/DataGrid/Sorting/)
- [Grouping](/Documentation/Guide/UI_Components/DataGrid/Grouping/)
- [Paging](/Documentation/Guide/UI_Components/DataGrid/Paging/)
- [Row Focus](/Documentation/Guide/UI_Components/DataGrid/Focused_Row/)
- [Selection](/Documentation/Guide/UI_Components/DataGrid/Selection/)
- [Summaries](/Documentation/Guide/UI_Components/DataGrid/Summaries/Predefined_Aggregate_Functions/)
- [Column Fixing](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Fixing/), [Resizing](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Sizing/), and [Reordering](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Reordering/)

The following capabilities are enabled in this demo:

- Filtering and Searching
- Sorting
- Grouping
- Paging

You can use/configure these features in the AI Assistant chat using written prompts. The AI Assistant chat also supports [speech-to-text input](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#speechToTextEnabled), ideal for hands-free interactions or entering longer prompts.

This demo also configures [suggestions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#suggestions) for the AI Assistant chat. These buttons allow you to interact with the assistant in one click using pre-defined prompts. For additional information about suggestions, refer to the following technical demo: [DevExtreme Chat - Prompt Suggestions](/Demos/WidgetsGallery/Demo/Chat/PromptSuggestions/).