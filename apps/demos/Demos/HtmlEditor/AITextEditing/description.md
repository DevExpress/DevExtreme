The HTML Editor supports AI-powered text editing. Users can apply AI requests and insert the results directly into the editor. To enable this feature, follow these steps:

1. Link the HTML Editor to an AI service through the `aiIntegration` option.
2. Specify the `"ai"` toolbar item in the toolbar configuration.

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

You can also specify which predefined commands to include in the `"ai"` item and customize an individual standard command's default options (for example, by setting a custom list of target languages for translation). Additionally, you can add a new custom command to the `"ai"` item by specifying your prompt. In this demo, the custom command is "Extract Keywords". For more details, check the prompt in the code.

[note] This capability works with the selected text. If nothing is selected, the entire text is altered.