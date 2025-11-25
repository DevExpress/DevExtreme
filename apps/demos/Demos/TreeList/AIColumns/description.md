DevExtreme TreeList supports AI columns. These columns augment your data and transform our TreeList into an AI-powered data exploration tool. This demo implements an AI column (fixed on the right side of the component) to display one additional AI-generated data field. You can also integrate multiple AI columns to expand the scope of generated insights.

<!--split-->

To integrate an AI column, do the following:

- Configure [aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#aiIntegration) (or **columns[]**.**ai**.[aiIntegration](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#aiIntegration)).
- Set a column's [type](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#type) to *"ai"*.
- Specify the column's [name](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#name).
- Configure **columns[]**.**ai** options, including the [prompt](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#prompt) and generation [mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/ai/#mode).

This demo also configures the [onAIColumnRequestCreating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onAIColumnRequestCreating) handler to limit data included in AI requests. The default TreeList behavior is to include all data from visible rows in AI requests, including data not bound to a column and data of hidden columns. This gives LLMs broader context, but increases the component's use of AI resources. To limit data included in AI requests, modify the **AIColumnRequestCreatingEvent**.[data](/Documentation/ApiReference/UI_Components/dxTreeList/Types/AIColumnRequestCreatingEvent/#data) parameter.