import { SchedulerTypes } from 'devextreme-react/scheduler';
import { ChatTypes } from 'devextreme-react/chat';

export const author_id_1 = "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3";
export const author_id_2 = "d16d1a4c-5c67-4e20-b70e-2991c22747c3";

export const author_info_1: ChatTypes.User = {
    id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
    name: "John Doe",
    avatarUrl: "https://devexpress.github.io/DevExtreme/images/icons/bot.png",
};

export const author_info_2: ChatTypes.User = {
    id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
    name: "Jane Smith"
};

export const initialMessages: ChatTypes.Message[] = [
    {
        timestamp: "2024-10-01T10:15:30Z",
        author: author_info_1,
        text: "Hey! How are you?"
    },
    {
        timestamp: "2024-10-01T10:16:00Z",
        author: author_info_2,
        text: "Hi! I'm good, thanks. How about you?"
    },
    {
        timestamp: "2024-10-01T10:16:30Z",
        author: author_info_1,
        text: "I'm doing great too. What are your plans for the weekend?"
    },
    {
        timestamp: "2024-10-01T10:17:00Z",
        author: author_info_2,
        text: "I'm thinking of going to the countryside. I want to relax in nature."
    },
    {
        timestamp: "2024-10-01T10:18:01Z",
        author: author_info_2,
        text: "I want to relax in nature."
    },
    {
        timestamp: "2024-10-01T10:25:15Z",
        author: author_info_2,
        text: "Maybe I'll stay in a cabin by the lake."
    },
    {
        timestamp: "2024-10-01T10:33:30Z",
        author: author_info_1,
        text: "Sounds awesome!"
    },
    {
        timestamp: "2024-10-01T10:33:32Z",
        author: author_info_1,
        text: "I also want to get out into nature. Want to join me?"
    },
    {
        timestamp: "2024-10-01T10:35:00Z",
        author: author_info_2,
        text: "I'd love to! Just let me know when you're ready."
    }
];
