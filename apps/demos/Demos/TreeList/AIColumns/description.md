DevExtreme TreeList supports AI columns. These columns augment your data and transform our TreeList into an AI-powered data exploration tool. This demo implements an AI column (fixed on the right side of the component) to display one additional AI-generated data field. You can also integrate multiple AI columns to expand the scope of generated insights.

<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of TreeList AI Columns.

When connected to your own AI model/service without rate and data limits, TreeList AI Columns will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

This demo implements a default prompt within the AI column. This prompt instructs AI to identify each employee's department within the TreeList. You can modify the default prompt or enter a custom prompt in the AI column's header menu.

To integrate an AI column, do the following:

- Configure [aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#aiIntegration) (or **columns[]**.**ai**.[aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#aiIntegration)).
- Set a column's [type](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#type) to *"ai"*.
- Specify the column's [name](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#name).
- Configure **columns[]**.**ai** options, including the generation [mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#mode), predefined [prompt](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#prompt), and [no data text](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#noDataText) (displayed when the AI service returns no data for a row).

This demo also configures the [onAIColumnRequestCreating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onAIColumnRequestCreating) handler to limit data included in AI requests. The default TreeList behavior is to include all data from visible rows in AI requests, including data not bound to a column and data of hidden columns. This gives LLMs broader context, but increases the component's use of AI resources. To limit data included in AI requests, modify the **AIColumnRequestCreatingEvent**.[data](/Documentation/ApiReference/UI_Components/dxTreeList/Types/AIColumnRequestCreatingEvent/#data) parameter.