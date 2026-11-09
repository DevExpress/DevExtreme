import { ChatTypes } from 'devextreme-react/chat';

export const REGENERATION_TEXT = 'Regeneration...';

export const firstAuthor: ChatTypes.User = {
    id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
    name: "John Doe",
    avatarUrl: "https://devexpress.github.io/DevExtreme/images/icons/bot.png",
};

export const secondAuthor: ChatTypes.User = {
    id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
    name: "Jane Smith"
};

export const thirdAuthor: ChatTypes.User = {
    id: "b02d90c5-ca37-4cc6-9b62-56e2ce573893",
    name: "Gordon Freeman"
};

export const fourthAuthor: ChatTypes.User = {
    id: "8adef6b1-ff40-42df-8456-f7c080e132b8",
    name: "Crash Bandicoot"
};

export const assistant: ChatTypes.User = {
    id: 'assistant',
    name: 'Virtual Assistant',
    avatarUrl: "https://devexpress.github.io/DevExtreme/images/icons/bot.png",
};

const todayDate = new Date();

const date = new Date();
const yesterdayDate = date.setDate(date.getDate() - 1);

export const initialMessages: ChatTypes.Message[] = [
    {
        timestamp: "2024-10-01T10:15:30Z",
        author: firstAuthor,
        text: "Hey! How are you?"
    },
    {
        timestamp: "2024-10-01T10:16:00Z",
        author: secondAuthor,
        text: "Hi! I'm good, thanks. How about you?"
    },
    {
        timestamp: "2024-10-01T10:16:30Z",
        author: firstAuthor,
        text: "I'm doing great too. What are your plans for the weekend?"
    },
    {
        timestamp: "2024-10-01T10:17:00Z",
        author: secondAuthor,
        text: "I'm thinking of going to the countryside. I want to relax in nature."
    },
    {
        timestamp: "2024-10-01T10:18:01Z",
        author: secondAuthor,
        text: "I want to relax in nature."
    },
    {
        timestamp: "2024-10-01T10:25:15Z",
        author: secondAuthor,
        text: "Maybe I'll stay in a cabin by the lake."
    },
    {
        timestamp: "2024-10-01T10:33:30Z",
        author: firstAuthor,
        text: "Sounds awesome!"
    },
    {
        timestamp: "2024-10-01T10:33:32Z",
        author: firstAuthor,
        text: "I also want to get out into nature. Want to join me?"
    },
    {
        timestamp: yesterdayDate,
        author: secondAuthor,
        text: "I'd love to! Just let me know when you're ready."
    },
    {
        timestamp: todayDate,
        author: firstAuthor,
        text: "Great!"
    },
    {
        timestamp: todayDate,
        author: firstAuthor,
        text: "Great! Looking forward to it!"
    }
];

export const longError = { id: '1234', message: 'Error Message. An unexpected issue occurred while processing your request. Please check your internet connection or contact support for further assistance.' };

export const userRequest: ChatTypes.Message =
    {
        timestamp: todayDate,
        author: secondAuthor,
        text: "What is AI?"
    }
;

export const regenerationMessage: ChatTypes.Message = {
    timestamp: todayDate,
    author: assistant,
    text: REGENERATION_TEXT,
};

export const assistantReplies: ChatTypes.Message[] = [
    {
        timestamp: todayDate,
        author: assistant,
        text: `<p>Artificial Intelligence (AI) is a branch of computer science that focuses on 
                creating systems capable of performing tasks that typically require human intelligence. 
                These tasks include learning, reasoning, problem-solving, understanding natural
                language, recognizing patterns, and even making decisions.</p>
            <p>AI can be divided into several subfields and categories:</p>
            <h3><strong>Types of AI Based on Capability</strong></h3>
            <ul>
                <li><strong>Narrow AI (Weak AI):</strong> Specialized in performing a single task 
                    or a narrow range of tasks, like language translation, facial recognition, 
                    or recommendation systems. Most AI systems today fall into this category.
                </li>
                <li><strong>General AI (Strong AI):</strong> A hypothetical form of AI that possesses 
                    the ability to understand, learn, and apply knowledge across a broad range 
                    of tasks, much like a human being.
                </li>
                <li><strong>Superintelligent AI:</strong> A theoretical concept where AI surpasses 
                    human intelligence across all domains, potentially transforming or outstripping 
                    human capabilities.
                </li>
            </ul>
            <p>AI continues to evolve, impacting nearly every aspect of modern life while raising 
                ethical, societal, and technological challenges.</p>`.replace(/\s{2,}/gm, ''),
    },
    {
        timestamp: todayDate,
        author: assistant,
        text: `<p>Artificial Intelligence (AI) is a branch of computer science that focuses on 
                creating systems capable of performing tasks that typically require human intelligence. 
                These tasks include learning, reasoning, problem-solving, understanding natural
                language, recognizing patterns, and even making decisions.</p>
            <p>AI can be divided into several subfields and categories:</p>
            <h3><strong>Types of AI Based on Functionality</strong></h3>
            <ol>
                <li><strong>Reactive Machines:</strong> AI systems that respond to specific inputs 
                    with predefined outputs, without memory or past experiences influencing their 
                    decisions (e.g., IBM's Deep Blue chess-playing computer).
                </li>
                <li><strong>Limited Memory:</strong> AI systems that can use past data for a short 
                    time to inform decisions, such as self-driving cars.
                </li>
                <li><strong>Theory of Mind:</strong> A more advanced concept where AI would 
                    understand  emotions, beliefs, and intentions, allowing it to interact more 
                    naturally with humans. This remains largely in the research phase.
                </li>
                <li><strong>Self-Aware AI:</strong> A theoretical AI that has self-awareness and 
                consciousness.
                </li>
            </ol>
            <p>AI continues to evolve, impacting nearly every aspect of modern life while raising 
                ethical, societal, and technological challenges.</p>`.replace(/\s{2,}/gm, ''),
    },
    {
        timestamp: todayDate,
        author: assistant,
        text: `<p>Artificial Intelligence (AI) is a branch of computer science that focuses on 
                creating systems capable of performing tasks that typically require human intelligence. 
                These tasks include learning, reasoning, problem-solving, understanding natural
                language, recognizing patterns, and even making decisions.</p>
            <p>AI can be divided into several subfields and categories:</p>
            <h3><strong>Key Subfields of AI</strong></h3>
            <ul>
                <li><strong>Machine Learning (ML):</strong> Enables systems to learn and improve 
                    from data without explicit programming.
                </li>
                <li><strong>Deep Learning:</strong> A subset of ML that uses neural networks with 
                    many layers to analyze complex patterns.
                </li>
                <li><strong>Natural Language Processing (NLP):</strong> Allows AI to understand, 
                    interpret, and respond to human language.
                </li>
                <li><strong>Computer Vision:</strong> Enables AI to process and analyze visual data 
                    from the world.
                </li>
                <li><strong>Robotics:</strong> Focuses on creating AI-driven robots to perform tasks 
                    in the physical world.
                </li>
                <li><strong>Expert Systems:</strong> Mimic human decision-making using rule-based 
                    systems.
                </li>
            </ul>
            <p>AI continues to evolve, impacting nearly every aspect of modern life while raising 
                ethical, societal, and technological challenges.</p>`.replace(/\s{2,}/gm, ''),
    },
    {
        timestamp: todayDate,
        author: assistant,
        text: `<p>Artificial Intelligence (AI) is a branch of computer science that focuses on 
                creating systems capable of performing tasks that typically require human intelligence. 
                These tasks include learning, reasoning, problem-solving, understanding natural
                language, recognizing patterns, and even making decisions.</p>
            <p>AI can be divided into several subfields and categories:</p>
            <h3><strong>Applications of AI</strong></h3>
            <ol>
                <li><strong>Healthcare:</strong> Diagnosing diseases, drug discovery, and patient 
                    care.
                </li>
                <li><strong>Finance:</strong> Fraud detection, stock market analysis, and personalized 
                    financial advice.
                </li>
                <li><strong>Transportation:</strong> Autonomous vehicles and traffic management.</li>
                <li><strong>Entertainment:</strong> Personalized content recommendations on platforms 
                    like Netflix or Spotify.
                </li>
                <li><strong>Customer Service:</strong> Chatbots and virtual assistants like Siri, 
                    Alexa, or Google Assistant.
                </li>
            </ol>
            <p>AI continues to evolve, impacting nearly every aspect of modern life while raising 
                ethical, societal, and technological challenges.</p>`.replace(/\s{2,}/gm, ''),
    }
];

type ToolCall = NonNullable<ChatTypes.Message['toolCalls']>[number];

interface ModelToolCall {
    id: string;
    function: { name: string; arguments?: string };
}

interface ModelMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content?: string | null;
    tool_calls?: ModelToolCall[];
    tool_call_id?: string;
}

const deployment = 'demo-mini';
const apiVersion = '2024-02-01';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiKey = 'DEMO';

const MAX_TOOL_ROUNDS = 3;
const TOOL_DELAY = 700;
const TOOL_ERROR_TEXT = 'Failed to execute the tool';

export const toolCallsUser = { id: 'user' };
export const toolCallsAssistant = { id: 'assistant', name: 'AI Assistant' };

export const suggestionCards = [
    {
        title: 'Single Tool',
        description: 'Find out the current time in the Barcelona and Los Angeles offices.',
        prompt: 'Check the current time in Barcelona, Spain and Los Angeles, US.',
    },
    {
        title: 'Multiple Tools',
        description: 'Check the current weather and time in Barcelona and the USD-to-EUR exchange rate.',
        prompt: 'Check the current weather conditions in Barcelona, Spain, the current time in Barcelona, Spain, and the exchange rate from USD to EUR.',
    },
    {
        title: 'Error State',
        description: 'Check the weather in London and in Atlantis. The request for Atlantis fails.',
        prompt: 'Check the current weather conditions in London, UK and in Atlantis, Atlantis.',
    },
];

export const systemPrompt = 'You are a helpful assistant. Use the tools to answer questions about the weather, the current time in offices, and exchange rates. '
    + 'Always call a tool instead of guessing. Pass the country as a short name (such as UK or US), cities without the country, and currencies as ISO codes. '
    + 'When a question needs several tools, call all of them at once. If a tool fails, say so briefly. Keep answers short.';

const tools = [{
    type: 'function',
    function: {
        name: 'getWeather',
        description: 'Get the current weather for a city',
        parameters: {
            type: 'object',
            properties: {
                country: { type: 'string', description: 'The short country name, such as UK or US' },
                city: { type: 'string', description: 'The city name' },
            },
            required: ['country', 'city'],
        },
    },
}, {
    type: 'function',
    function: {
        name: 'getCurrentTime',
        description: 'Get the current local time in the offices of one or several cities',
        parameters: {
            type: 'object',
            properties: {
                locations: { type: 'array', items: { type: 'string' }, description: 'City names without the country, such as Barcelona' },
            },
            required: ['locations'],
        },
    },
}, {
    type: 'function',
    function: {
        name: 'getExchangeRate',
        description: 'Get the exchange rate between two currencies',
        parameters: {
            type: 'object',
            properties: {
                fromCurrency: { type: 'string', description: 'The ISO code of the source currency' },
                toCurrency: { type: 'string', description: 'The ISO code of the target currency' },
            },
            required: ['fromCurrency', 'toCurrency'],
        },
    },
}];

const weatherByCity: Record<string, string> = {
    london: '15°C (59°F)',
    barcelona: '21°C (70°F)',
    'los angeles': '24°C (75°F)',
    'new york': '12°C (54°F)',
};

const timeByCity: Record<string, string> = {
    london: '09:18 (UTC+00:00) Greenwich Mean Time',
    barcelona: '10:18 (UTC+01:00) Central European Time',
    'los angeles': '01:18 (UTC−08:00) Pacific Time (US & Canada)',
    'new york': '04:18 (UTC−05:00) Eastern Time (US & Canada)',
};

const ratesToUsd: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
};

const toolImplementations: Record<string, (args: any) => string> = {
    getWeather: ({ city }) => {
        const weather = weatherByCity[String(city).toLowerCase()];

        if (!weather) {
            throw new Error(TOOL_ERROR_TEXT);
        }

        return weather;
    },
    getCurrentTime: ({ locations }) => (locations ?? [])
        .map((location: string) => `${location}: ${timeByCity[String(location).toLowerCase()] ?? 'unknown time zone'}`)
        .join('\n'),
    getExchangeRate: ({ fromCurrency, toCurrency }) => {
        const from = ratesToUsd[String(fromCurrency).toUpperCase()];
        const to = ratesToUsd[String(toCurrency).toUpperCase()];

        if (!from || !to) {
            throw new Error(TOOL_ERROR_TEXT);
        }

        const rate = Math.round((to / from) * 10000) / 10000;

        return `1 ${String(fromCurrency).toUpperCase()} = ${rate} ${String(toCurrency).toUpperCase()}`;
    },
};

const delay = (ms: number) => new Promise<void>((resolve) => { setTimeout(resolve, ms); });

async function requestModel(messages: ModelMessage[]): Promise<ModelMessage> {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
            messages,
            tools,
            tool_choice: 'auto',
            max_completion_tokens: 1000,
        }),
    });

    if (!response.ok) {
        throw new Error(`The AI service returned an error (${response.status}).`);
    }

    const data = await response.json();

    return data.choices[0].message;
}

async function runTool(call: ModelToolCall): Promise<ToolCall> {
    const { name } = call.function;
    let args: Record<string, unknown>;

    try {
        args = JSON.parse(call.function.arguments || '{}');
    } catch {
        return {
            name, arguments: {}, status: 'error', result: 'Invalid tool arguments',
        };
    }

    await delay(TOOL_DELAY + Math.random() * 600);

    try {
        const implementation = toolImplementations[name];

        if (!implementation) {
            throw new Error(TOOL_ERROR_TEXT);
        }

        return { name, arguments: args, status: 'success', result: implementation(args) };
    } catch (error) {
        return { name, arguments: args, status: 'error', result: (error as Error).message };
    }
}

export async function getAIResponse(messages: ModelMessage[]): Promise<{ text: string; toolCalls: ToolCall[] }> {
    const toolCalls: ToolCall[] = [];
    let toolRounds = 0;

    while (true) {
        const answer = await requestModel(messages);
        const calls = answer.tool_calls;

        if (!calls?.length) {
            return { text: answer.content ?? '', toolCalls };
        }

        if (toolRounds >= MAX_TOOL_ROUNDS) {
            throw new Error('The model requested too many tool calls. Try rephrasing your request.');
        }

        toolRounds += 1;
        messages.push(answer);

        const results = await Promise.all(calls.map(runTool));

        calls.forEach((call, index) => {
            const result = results[index];

            toolCalls.push(result);
            messages.push({
                role: 'tool',
                tool_call_id: call.id,
                content: result.status === 'error' ? `Error: ${result.result}` : String(result.result),
            });
        });
    }
}

export type { ModelMessage };
