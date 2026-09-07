This demo incorporates AI insights into DevExtreme [DataGrid](/Documentation/Guide/UI_Components/DataGrid/Overview/)'s [master-detail interface](/Documentation/Guide/UI_Components/DataGrid/Master-Detail_Interface/), extending the component's built-in AI data exploration capabilities. This sample complements built-in [AI columns](/Demos/WidgetsGallery/Demo/DataGrid/AIColumns/) that generate data for every DataGrid row. The AI-powered detail view augments data only within specific rows, significantly reducing AI token consumption and enhancing data generation performance in usage scenarios that do not require generated data for every row.

To start working with the AI Assistant, click the **AI** icon on the left side of a row and enter a prompt.

<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of AI-powered Detail Views.

When connected to your own AI model/service without rate and data limits, AI-powered Detail Views will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

To display the AI-powered detail view, this demo defines the DataGrid's [master-detail template](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/masterDetail/#template) with DevExtreme [TextBox](/Documentation/Guide/UI_Components/TextBox/Overview/) and [Button](/Documentation/Guide/UI_Components/Button/Overview/) components. The DevExtreme [ButtonGroup](/Documentation/Guide/UI_Components/ButtonGroup/Getting_Started_with_ButtonGroup/) component serves as a prompt suggestion UI, mirroring the DevExtreme Chat's [Suggestions](/Demos/WidgetsGallery/Demo/Chat/PromptSuggestions/). After you submit a prompt, the detail view expands and displays a DevExtreme [LoadPanel](/Documentation/Guide/UI_Components/LoadPanel/Overview/) while the AI processes your query. Generated responses appear within a DevExtreme [TextArea](/Documentation/Guide/UI_Components/TextArea/Getting_Started_with_TextArea/) component configured in [read-only mode](/Documentation/ApiReference/UI_Components/dxTextArea/Configuration/#readOnly).
