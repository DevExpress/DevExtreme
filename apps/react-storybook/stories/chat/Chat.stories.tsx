import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {Chat, ChatTypes} from 'devextreme-react/chat'
import type {Meta, StoryObj} from '@storybook/react';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { firstAuthor, secondAuthor, initialMessages, longError } from './data';
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
        errors: [],
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
            defaultValue: firstAuthor.name,
        },
        hint: {
            control: 'text',
        },
        errors: {
            control: 'select',
            options: ['None', 'One error', 'One error with long text', 'Three errors'],
            mapping: {
                ['None']: [],
                ['One error']: [
                    { id: 1, message: 'Error Message 1. Error Description...' }
                ],
                ['One error with long text']: [longError],
                ['Three errors']: [
                    { id: 1, message: 'Error Message 1. Error Description...' },
                    { id: 2, message: 'Error Message 2. Message was not sent' },
                    longError,
                ],
            },
            defaultValue: 'Empty',
        }
    },
    render: ({
        width,
        height,
        disabled,
        rtlEnabled,
        user,
        items,
        errors,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const [messages, setMessages] = useState(items);
        
        const onMessageSend = useCallback(({ message }) => {
            const updatedMessages = [...messages, message];

            setMessages(updatedMessages);
        }, [messages]);

        useEffect(() => {
            setMessages(items);
        }, [items]);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={width}
                    height={height}
                    items={messages}
                    disabled={disabled}
                    rtlEnabled={rtlEnabled}
                    user={user}
                    errors={errors}
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

export const EmptyView: Story = {
    args: {
        items: [],
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
            defaultValue: firstAuthor.name,
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
        onItemsChange,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const [messages, setMessages] = useState(items);
        
        const onMessageSend = useCallback(({ message }) => {
            const updatedMessages = [...messages, message];

            setMessages(updatedMessages);
        }, [messages]);

        useEffect(() => {
            setMessages(items);
        }, [items]);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={width}
                    height={height}
                    items={messages}
                    onItemsChange={onItemsChange}
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

export const DataLoading: Story = {
    args: {
        user: firstAuthor,
        reloadOnChange: true,
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
            defaultValue: firstAuthor.name,
        },
        hint: {
            control: 'text',
        },
    },
    render: ({
        width,
        height,
        disabled,
        rtlEnabled,
        reloadOnChange,
        user,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const messagesRef = React.useRef([...initialMessages]);

        const dataSource = useMemo(() => new DataSource({
            store: new CustomStore({
                load: () => {
                    const promise = new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(messagesRef.current);
                        }, 500);
                    });
            
                    return promise;
                },
                insert: (message) => {
                    if(reloadOnChange) {
                        messagesRef.current.push(message);
                    }
    
                    const promise = new Promise<void>((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 200);
                    });
              
                    return promise;
                },
            }),
            paginate: false,
        }), [reloadOnChange]);
        
        const onMessageSend = useCallback((e) => {
            if(!reloadOnChange) {
                e.component.getDataSource().store().push([{ type: 'insert', data: e.message }]);
            }
        }, [reloadOnChange]);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={width}
                    height={height}
                    dataSource={dataSource}
                    reloadOnChange={reloadOnChange}
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
            defaultValue: firstAuthor.name,
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
        
        useEffect(() => {
            setMessages(items);
        }, [items]);

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

export const Customization: Story = {
    args: {
        width: 500,
        height: 600,
        showDayHeaders: true,
        showAvatar: true,
        showUserName: true,
        showMessageTimestamp: true,
    },
    render: ({
        width,
        height,
        showDayHeaders,
        showAvatar,
        showUserName,
        showMessageTimestamp,
    }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={width}
                    height={height}
                    items={initialMessages}
                    user={secondAuthor}
                    showDayHeaders={showDayHeaders}
                    showAvatar={showAvatar}
                    showUserName={showUserName}
                    showMessageTimestamp={showMessageTimestamp}
                >
                </Chat>
            </div>
        );
    }
}
