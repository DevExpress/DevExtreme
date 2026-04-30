This demo implements the DevExtreme Chat component with [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) to stream AI-generated responses in real time. As the AI model produces output token by token, the Chat component renders the response incrementally inside a message bubble. A typing indicator appears while the response is being streamed, and the send button transforms into a stop button so that users can cancel an in-progress stream at any time.

The empty Chat displays custom suggestion cards. Clicking a card sends the corresponding prompt directly to the AI without extra user input.

<!--split-->

## Streaming AI Responses

The demo calls the Azure OpenAI Chat Completions API with `stream: true`. Incoming delta chunks are passed through a `createDelayedRenderer` queue that introduces a short display delay between chunks to produce a smooth typing effect. The demo appends each chunk to a growing buffer and updates the assistant message in the data store with every render cycle via a `dataSource.store().push(...)` call.

## Stopping a Stream

The demo creates an `AbortController` before each request and passes its `signal` (`AbortSignal`) to the Azure OpenAI SDK in the request options. When the user clicks the stop button, the demo calls `abortController.abort()` to cancel the in-progress HTTP request.

The [sendButtonOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#sendButtonOptions) property switches the button's `action` property to `'custom'` and the icon to `'stopfilled'` while streaming is active, then reverts to the default (send) configuration once streaming ends.

## Custom Empty View

The Chat component specifies an [emptyViewTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#emptyViewTemplate) that replaces the default empty state with custom suggestion cards. Clicking a card creates a message and triggers the demo message sending flow directly, bypassing the text input.