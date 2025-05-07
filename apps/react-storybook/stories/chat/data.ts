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
