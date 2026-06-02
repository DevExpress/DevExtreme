The AI Assistant for the DevExtreme [DataGrid](/Documentation/Guide/UI_Components/DataGrid/Overview/) allows you to interact with the component using natural language.

You can use/configure the following DataGrid features via AI Assistant Chat prompts:

- [Filtering and Searching](/Documentation/Guide/UI_Components/DataGrid/Filtering_and_Searching/)
- [Sorting](/Documentation/Guide/UI_Components/DataGrid/Sorting/)
- [Grouping](/Documentation/Guide/UI_Components/DataGrid/Grouping/)
- [Paging](/Documentation/Guide/UI_Components/DataGrid/Paging/)
- [Focused Row](/Documentation/Guide/UI_Components/DataGrid/Focused_Row/)
- [Selection](/Documentation/Guide/UI_Components/DataGrid/Selection/)
- [Summaries](/Documentation/Guide/UI_Components/DataGrid/Summaries/Predefined_Aggregate_Functions/)
- [Column Fixing](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Fixing/), [Resizing](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Sizing/), and [Reordering](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Reordering/)

This AI Assistant feature is also available in the DevExtreme [TreeList](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#aiAssistant) component.
<!--split-->

In this demo, the AI Assistant is enabled for a DataGrid that displays mock sales data with over 1500 records.

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of the DataGrid AI Assistant.

When connected to your own AI model/service without rate and data limits, the AI Assistant will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

To enable the AI Assistant, configure the [aiIntegration](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#aiIntegration) or **aiAssistant**.[aiIntegration](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/#aiIntegration) object and set the **aiAssistant**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/#enabled) property to `true`. Once activated, the DataGrid adds a predefined item (*"aiAssistantButton"*) to the toolbar. This button opens our AI Assistant Chat in a draggable pop-up window.

Our Chat implementation supports [speech-to-text input](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#speechToTextEnabled), ideal for hands-free interaction or entering longer prompts.

This demo also configures [suggestions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#suggestions) for the AI Assistant Chat. These buttons allow you to interact with the assistant in one click using predefined prompts. For additional information about suggestions, refer to the following demo: [DevExtreme Chat - Prompt Suggestions](/Demos/WidgetsGallery/Demo/Chat/PromptSuggestions/).

[note] This functionality is available as a [community technology preview (CTP)](https://www.devexpress.com/aboutus/pre-release.xml). Should you have any questions or suggestions prior to its official release, please create a new ticket in the [DevExpress Support Center](https://supportcenter.devexpress.com/ticket/create).