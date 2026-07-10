This demo incorporates server-side semantic search into the [DevExtreme DataGrid](/Documentation/Guide/UI_Components/DataGrid/Overview/). Semantic search finds results based on meaning rather than exact wording, understanding the context and intent behind a question or phrase. This allows your DevExtreme-powered app to deliver more relevant answers by connecting related concepts, even if exact words differ.

To review benefits of this feature, search for dictionary entries and their descriptions and use synonyms or generic descriptions instead of exact search strings (such as "clothing" instead of a specific product name). You can fine-tune search results: use the Similarity Factor editor to change the search precision.
<!--split-->

[note]

AI services used for this demo have been rate and data limited. As such, you may experience performance-related delays when exploring the capabilities of the DataGrid AI Assistant.

When connected to your own AI model/service without rate and data limits, semantic search will perform seamlessly, without artificial delays. Note that DevExtreme does not offer an AI REST API and does not ship any built-in LLMs/SLMs.

[/note]

This demo configures semantic filtering on the server (using [AzureOpenAI embeddings](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/embeddings?tabs=csharp)). Server-side semantic search allows the integration of this capability using built-in DataGrid visual elements. In this demo, each request returns filtered data using two parameters:

- A search value (entered in the built-in [search panel](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/searchPanel/))
- A similarity factor (can be adjusted via a custom [toolbar](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/) item)

After you enter a query in the search panel, DataGrid passes the new search value to the backend and loads the filtered data set.
