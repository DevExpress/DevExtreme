This demo uses the DevExtreme [Chat](/Documentation/ApiReference/UI_Components/dxChat/) component as a page-level AI assistant. Users type requests in natural language, and the assistant updates the [Form](/Documentation/ApiReference/UI_Components/dxForm/) and [DataGrid](/Documentation/ApiReference/UI_Components/dxDataGrid/) components on the page. The demo uses [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) as the AI service.

Click the floating **AI Assistant** button to open the Chat. Try prompts such as "Change State to Texas", "Show completed tasks", or "Sort by due date descending".
<!--split-->

## Chat in a Popup

The demo embeds the Chat in a [Popup](/Documentation/ApiReference/UI_Components/dxPopup/) that opens from a [SpeedDialAction](/Documentation/ApiReference/UI_Components/dxSpeedDialAction/) button. The popup is draggable and resizable, so users can keep the Form and DataGrid visible while they work with the assistant. A toolbar button in the popup header clears the conversation.

The Chat also uses the following options:

- [suggestions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#suggestions) - quick prompts that users can click instead of typing
- [emptyViewTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#emptyViewTemplate) - a custom greeting that describes what the assistant can do
- [speechToTextEnabled](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#speechToTextEnabled) - voice input for prompts

## Request Routing

The [onMessageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event handler uses [AIIntegration](/Documentation/Guide/UI_Components/Common/AI_Integration/) to send each message to the AI service. The service classifies the request to determine whether it targets the Form, the DataGrid, or both. The `routeMessage` function then forwards the request to the corresponding handler and posts the result to the Chat as a bot message. While the assistant processes a request, the demo disables the Chat.

## Form Updates (Smart Paste)

The Form uses the [Smart Paste](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#aiIntegration) feature to fill editors from free-form text. The Chat calls the Form's [smartPaste(text)](/Documentation/ApiReference/UI_Components/dxForm/Methods/#smartPastetext) method and handles the [smartPasted](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#onSmartPasted) event to report which fields the AI updated. The assistant can also clear a single field or reset the entire Form.

## DataGrid Commands

The AI service translates grid-related requests into a list of structured commands that the demo executes using the DataGrid API:

- **Filtering** - sets [filterValue](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#filterValue) for a column, or calls [clearFilter()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#clearFilter) to remove filters.
- **Sorting** - sets a column's `sortOrder`, or calls [clearSorting()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#clearSorting).
- **Column visibility** - shows or hides a column.

The `gridCommands` object in the demo code defines the available commands and their parameters. Add a new command to this object to extend the assistant. A single request can include multiple commands (for example, "Show completed tasks and sort by priority"). 
