DevExtreme TreeList allows you to create one or multiple AI columns. These columns generate meaningful cell values based on component data and a custom prompt, transforming DevExtreme TreeList into an AI-augmented data exploration tool. In this demo, an AI column is fixed on the right side of the component.

<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of TreeList AI Columns.

When connected to your own AI model/service without rate and data limits, TreeList AI Columns will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

This demo implements a prompt that instructs AI to identify the department of each employee. You can modify the default prompt or enter a custom prompt in the AI column's header menu.

To integrate an AI column into your DevExtreme TreeList, you must:

- Configure the **aiIntegration** property at the component or column level ([aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#aiIntegration) or **columns[]**.**ai**.[aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#aiIntegration)).
- Set the column [type](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#type) to *"ai"*.
- Specify the column [name](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#name).
- Configure **columns[]**.**ai** options, such as generation [mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#mode), predefined [prompt](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#prompt), and [no data text](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#noDataText) (displayed when the AI service returns no data for a row).

Our DevExtreme TreeList component uses all visible row data in AI requests, including unbound and hidden column fields. This data gives LLMs broader context, but increases the component use of AI resources. To limit data included in AI requests, modify the **AIColumnRequestCreatingEvent**.[data](/Documentation/ApiReference/UI_Components/dxTreeList/Types/AIColumnRequestCreatingEvent/#data) parameter in the [onAIColumnRequestCreating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onAIColumnRequestCreating) event handler.