import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Chat, ChatTypes } from 'devextreme-react/chat'
import { Button } from "devextreme-react";
import type { Meta, StoryObj } from '@storybook/react';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import {
    firstAuthor,
    secondAuthor,
    thirdAuthor,
    fourthAuthor,
    initialMessages,
    longError,
    REGENERATION_TEXT,
    assistantReplies,
    userRequest,
    regenerationMessage, 
    assistant,
} from './data';
import { Popup } from 'devextreme-react/popup';
import HTMLReactParser from 'html-react-parser';

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
        alerts: [],
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
        alerts: {
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
        alerts,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const [messages, setMessages] = useState(items);
        
        const onMessageEntered = useCallback(({ message }) => {
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
                    alerts={alerts}
                    onMessageEntered={onMessageEntered}
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
        
        const onMessageEntered = useCallback(({ message }) => {
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
                    onMessageEntered={onMessageEntered}
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
                            resolve([...messagesRef.current]);
                        }, 500);
                    });
            
                    return promise;
                },
                insert: (message) => {
                    messagesRef.current.push(message);
    
                    const promise = new Promise<void>((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 200);
                    });
              
                    return promise;
                },
            }),
            paginate: false,
        }), []);
        
        const onMessageEntered = useCallback((e) => {
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
                    onMessageEntered={onMessageEntered}
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
        
        const onMessageEntered = useCallback(({ message }) => {
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
                    onMessageEntered={onMessageEntered}
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

const formattingOptions = ['shortdate', 'shorttime', 'yyyy-mm-dd hh:mm:ss', 'hh:mm:ss', 'longdate', 'longtime', 'invalid format', null];

const formattingControlMappings = Object.fromEntries(formattingOptions.map(option => [option, option])); 

const formattingCommonProperties = {
    control: 'select',
    options: formattingOptions,
    mapping: formattingControlMappings,
};

export const Formatting: Story = {
    args: {
        dayHeaderFormat: 'shortdate',
        messageTimestampFormat: 'shorttime',
    },
    argTypes: {
        dayHeaderFormat: {
            ...formattingCommonProperties,
            defaultValue: 'shortdate',
        },
        messageTimestampFormat: {
            ...formattingCommonProperties,
            defaultValue: 'shorttime',
        },
    },
    render: ({
        dayHeaderFormat,
        messageTimestampFormat,
    }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={500}
                    height={500}
                    items={initialMessages}
                    user={secondAuthor}
                    dayHeaderFormat={dayHeaderFormat}
                    messageTimestampFormat={messageTimestampFormat}
                >
                </Chat>
            </div>
        );
    }
}

export const TypingUsers: Story = {
    args: {
        typingUsers: 'One user typing',
    },
    argTypes: {
        typingUsers: {
            control: 'select',
            defaultValue: 'One user typing',
            options: [
                'No one is typing',
                'One user typing',
                'Two users typing',
                'Three users typing',
                'Multiple users typing',
            ],
            mapping: {
                ['No one is typing']: [],
                ['One user typing']: [ firstAuthor ],
                ['Two users typing']: [ firstAuthor, secondAuthor ],
                ['Three users typing']: [ firstAuthor, secondAuthor, thirdAuthor ],
                ['Multiple users typing']: [ firstAuthor, secondAuthor, thirdAuthor, fourthAuthor ],
            },
        },
    },
    render: ({
        typingUsers,
    }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={400}
                    height={500}
                    items={initialMessages}
                    user={secondAuthor}
                    typingUsers={typingUsers}
                >
                </Chat>
            </div>
        );
    }
}

export const AIBotIntegration: Story = {
    args: {
        alerts: 'No alerts',
    },
    argTypes: {
        alerts: {
            control: 'select',
            defaultValue: 'No alerts',
            options: [
                'No alerts',
                'Limit reached',
            ],
            mapping: {
                ['No alerts']: [],
                ['Limit reached']: [{ message: 'Request limit reached, try again in a minute.' }],
            },
        },
    },
    render: ({ alerts }) => {
        const [isProcessing, setIsProcessing] = useState(false);
        const [assistantReplyIndex, setAssistantReplyIndex] = useState<number>(0);
        const [copyButtonIcon, setCopyButtonIcon] = useState('copy');

        const items = useMemo(() => {
            const repliesCount = assistantReplies.length;
            const assistantReply = isProcessing ? regenerationMessage : assistantReplies[assistantReplyIndex % repliesCount];

            return [userRequest, assistantReply];
        }, [assistantReplyIndex, isProcessing]);

        const onRegenerateButtonClick = useCallback(async (): Promise<void> => {
            setIsProcessing(true);

            await new Promise((resolve) => {
                setTimeout(resolve, 300);
            });
            setAssistantReplyIndex((prev: number) => prev + 1);

            setIsProcessing(false);
        }, []);

        const messageRender = useCallback(({ message }: { message: ChatTypes.Message }) => {
            const { text = '', author } = message;

            const onCopyButtonClick = () => {
                navigator.clipboard?.writeText(text);
                setCopyButtonIcon('check');

                setTimeout(() => {
                    setCopyButtonIcon('copy');
                }, 2500);
            };

            if (text === REGENERATION_TEXT || author !== assistant) {
                return <span>{text}</span>;
            }

            return (
                <>
                    <div>
                        {HTMLReactParser(text)}
                    </div>
                    <div>
                        <Button
                            icon={copyButtonIcon}
                            stylingMode='text'
                            hint='Copy'
                            onClick={onCopyButtonClick}
                        />
                        <Button
                            icon='refresh'
                            stylingMode='text'
                            hint='Regenerate'
                            onClick={onRegenerateButtonClick}
                        />
                    </div>
                </>
            );
        }, [copyButtonIcon, onRegenerateButtonClick]);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    height={900}
                    width={500}
                    items={items}
                    showDayHeaders={false}
                    user={secondAuthor}
                    alerts={alerts}
                    messageRender={messageRender}
                />
            </div>
        );
    }
}
