AI assistants often call tools (functions) to retrieve data or execute actions before they respond. DevExtreme Chat can display tool calls within an AI response.

This demo uses [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) and three local tools: current weather, current office time, and exchange rates. Click a card in the empty Chat to send a prompt that calls a single tool, multiple tools, or a tool that fails.
<!--split-->

## Tool Call Visualization

Populate a text message's [toolCalls](/Documentation/ApiReference/UI_Components/dxChat/Types/TextMessage/#toolCalls) array to display tool calls. Each [ToolCall](/Documentation/ApiReference/UI_Components/dxChat/Types/ToolCall/) object supports the following fields:

- **name**    
The tool name displayed as a tool call title.
- **arguments**    
Parameters passed to the tool.
- **result**    
The tool output (a string or an object).
- **status**    
The call status: `'success'` (default) or `'error'`. Failed calls display an error badge.
- **expanded**    
Specifies whether the call details are initially visible.

The Chat displays tool calls at the top of the message bubble (above response text). Each call is a collapsible item that displays arguments and the result when expanded. If a message contains multiple tool calls, the Chat also displays the total call count.

## Tool Call Options

Use the [toolCallOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/toolCallOptions/) object to configure how the Chat displays tool calls:

- **expandAll**    
Expands all tool calls. The **expanded** field of an individual call overrides this setting. Use the "Expand all tool calls" checkbox to toggle this option.
- **showInMessageTemplate**    
Displays tool calls in messages that use a custom [messageTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#messageTemplate). If this option is `false`, the Chat hides tool calls in templated messages.

## Tool Execution

The demo sends each prompt to Azure OpenAI with a list of available tools. When the AI model requests tool calls, the demo runs the tools locally and sends results back to the model. The demo repeats this cycle until the model returns a final answer. The demo collects all calls (name, arguments, status, and result) into an array and assigns this array to the **toolCalls** field of the assistant message. Review the `getAIResponse` function for implementation details.

