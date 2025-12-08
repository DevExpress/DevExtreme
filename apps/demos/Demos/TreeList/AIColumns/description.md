DevExtreme TreeList allows you to add multiple AI columns to the TreeList. These columns auto generate meaningful cell values based on component data and a custom prompt, transforming DevExtreme TreeList into an AI-powered data analysis tool. In this demo, an AI column is fixed to the right side of the component.

<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of TreeList AI Columns.

When connected to your own AI model/service without rate and data limits, TreeList AI Columns will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

This demo instructs the AI service to identify the department name associated with each employee. You can modify the default prompt or enter a custom prompt in the AI column header menu.

To integrate an AI column into the DevExtreme TreeList, you must:

- Configure the **aiIntegration** property at the component or column level ([aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#aiIntegration) or **columns[]**.**ai**.[aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#aiIntegration)).
- Set the column [type](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#type) to *"ai"*.
- Specify the column [name](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#name).
- Configure **columns[]**.**ai** options, such as generation [mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#mode), predefined [prompt](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#prompt), and [no data text](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#noDataText) (displayed when the AI service returns no data for a row).

Our DevExtreme TreeList component uses all visible row data in AI requests, including fields not bound to a column and hidden column fields. This data gives LLMs broader context, but increases the use of AI resources. To limit data included in AI requests, modify the **AIColumnRequestCreatingEvent**.[data](/Documentation/ApiReference/UI_Components/dxTreeList/Types/AIColumnRequestCreatingEvent/#data) parameter in the [onAIColumnRequestCreating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onAIColumnRequestCreating) event handler.