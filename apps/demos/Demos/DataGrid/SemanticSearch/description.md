This demo incorporates server-side semantic search into the [DevExtreme DataGrid](/Documentation/Guide/UI_Components/DataGrid/Overview/). Semantic search finds results based on meaning rather than exact wording, understanding the context and intent behind a question or phrase. This allows your DevExtreme-powered app to deliver more relevant answers by connecting related concepts, even if exact words differ.

To review the benefits of this feature, search for dictionary entries and their descriptions and use synonyms or generic descriptions instead of exact search strings (such as "clothing" instead of a specific product name). You can fine-tune the search results: use the Similarity Factor editor to change the search precision.
<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of the DataGrid AI Assistant.

When connected to your own AI model/service without rate and data limits, semantic search will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

This demo configures semantic filtering on the server (using [AzureOpenAI embeddings](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/embeddings?tabs=csharp)). Each request returns filtered data using two parameters:

- A search value (entered in the built-in [search panel](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/searchPanel/))
- A similarity factor (adjusted using a custom [toolbar](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/) item)

The DataGrid is configured to reload data after you enter a query in the search editor.

Review the `DataGridSemanticSearchController.cs` tab in the [ASP.NET Core version](https://demos.devexpress.com/ASPNetCore/Demo/DataGrid/SemanticSearch) of this demo for backend implementation details.