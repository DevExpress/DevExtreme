import React, { useState, useCallback } from 'react';
import {Chat, ChatTypes} from 'devextreme-react/chat'
import type {Meta, StoryObj} from '@storybook/react';
import { firstAuthor, secondAuthor, initialMessages } from './data';
import { Popup } from 'devextreme-react/popup';

import './styles.css';

const meta: Meta<typeof Chat> = {
    title: 'Components/Chat',
    component: Chat,
    parameters: {
        layout: 'fullscreen',
    }
};

export default meta;

type Story = StoryObj<typeof Chat>;

const commonArgs: ChatTypes.Properties = {
    width: "400px",
    height: "450px",
    disabled: false,
    rtlEnabled: false,
    visible: true,
    hint: undefined,
    activeStateEnabled: true,
    hoverStateEnabled: true,
    focusStateEnabled: true,
};

export const Overview: Story = {
    args: {
        items: initialMessages,
        user: firstAuthor,
        ...commonArgs,
    },
    argTypes: {
        user: {
            control: 'select',
            options: [firstAuthor.name, secondAuthor.name],
            mapping: {
                [firstAuthor.name]: firstAuthor,
                [secondAuthor.name]: secondAuthor,
            },
        },
        hint: {
            control: 'text',
        }
    },
    render: ({
        width,
        height,
        disabled,
        rtlEnabled,
        user,
        items,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const [messages, setMessages] = useState(items);
        
        const onMessageSend = useCallback(({ message }) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        }, []);
        
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={width}
                    height={height}
                    items={messages}
                    disabled={disabled}
                    rtlEnabled={rtlEnabled}
                    user={user}
                    onMessageSend={onMessageSend}
                    visible={visible}
                    hint={hint}
                    activeStateEnabled={activeStateEnabled}
                    focusStateEnabled={focusStateEnabled}
                    hoverStateEnabled={hoverStateEnabled}
                >
                </Chat>
            </div>
        );
    }
}

export const PopupIntegration: Story = {
    args: {
        items: initialMessages,
        user: secondAuthor,
        ...commonArgs,
        width: '100%',
        height: '100%'
    },
    argTypes: {
        user: {
            control: 'select',
            options: [firstAuthor.name, secondAuthor.name],
            mapping: {
                [firstAuthor.name]: firstAuthor,
                [secondAuthor.name]: secondAuthor,
            },
        },
        hint: {
            control: 'text',
        }
    },
    render: ({
        width,
        height,
        disabled,
        rtlEnabled,
        user,
        items,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const [messages, setMessages] = useState(items);
        
        const onMessageSend = useCallback(({ message }) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        }, []);
        
        return (
            <Popup
                width={300}
                height={350}
                visible={true}
                showCloseButton={false}
                title="Chat title"
                position={{
                    my: 'right bottom',
                    at: 'right bottom',
                    offset: '-20 -20',
                }}
            >
                <Chat
                    width={width}
                    height={height}
                    items={messages}
                    disabled={disabled}
                    rtlEnabled={rtlEnabled}
                    user={user}
                    onMessageSend={onMessageSend}
                    visible={visible}
                    hint={hint}
                    activeStateEnabled={activeStateEnabled}
                    focusStateEnabled={focusStateEnabled}
                    hoverStateEnabled={hoverStateEnabled}
                >
                </Chat>
            </Popup>
        );
    }
}
