The DevExtreme HTML Editor supports AI-powered text editing operations. Users can initiate AI requests and insert results directly into the editor. To activate this feature, you must:

1. Link the HTML Editor to an AI service through the [aiIntegration](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/#aiIntegration) option.
2. Specify the `"ai"` toolbar item in the [toolbar configuration](/Documentation/ApiReference/UI_Components/dxHtmlEditor/Configuration/toolbar/).

<!--split-->
The default `"ai"` toolbar item includes the following predefined commands:

- Summarize
- Proofread
- Expand
- Shorten
- Change style
- Change tone
- Translate
- Ask AI assistant (allows users to run their own prompts to alter HTML Editor content)

You can also specify predefined commands to include in the `"ai"` item and customize standard command default options (for example, by setting a custom list of target languages for translation). Additionally, you can add a new custom command to the `"ai"` item by specifying your prompt. In this demo, the custom command is "Extract Keywords". For additional information, check the prompt in code.

[note] This implementation works with selected text. If nothing is selected, the entire text is altered.