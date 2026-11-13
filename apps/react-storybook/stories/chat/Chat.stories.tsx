import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Chat, ChatTypes, ToolCallOptions } from 'devextreme-react/chat'
import { Button, Toast } from 'devextreme-react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
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
    toolCallsUser,
    toolCallsAssistant,
    suggestionCards,
    systemPrompt,
    getAIResponse,
    type ModelMessage,
} from './data';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import HTMLReactParser from 'html-react-parser';

import './styles.css';
import { Toolbar as ToolCallsToolbar, Item as ToolCallsToolbarItem } from 'devextreme-react/toolbar';
import { Guid } from 'devextreme-react/cjs/common';
import { Message } from 'devextreme/artifacts/npm/devextreme/ui/chat';
import type { ItemClickEvent as ButtonGroupItemClickEvent, Item as ButtonGroupItem } from 'devextreme/ui/button_group';

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
                wrapperAttr={{
                    class: 'chat-popup-integration'
                }}
                position={{
                    my: 'right bottom',
                    at: 'right bottom',
                    offset: '-20 -20',
                }}
                wrapperAttr={{ class: 'chat-popup-wrapper' }}
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

export const Editing: Story = {
    args: {
        user: firstAuthor,
        activeStateEnabled: true,
        hoverStateEnabled: true,
        focusStateEnabled: true,
        width: "600px",
        height: "600px",
        allowDeleting: true,
        allowUpdating: true,
        useCustomMessageRender: false,
        cancelMessageEditingStart: false,
        cancelMessageDeleting: false,
        allowOnlyLatinTextOnEdit: false,
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
        useCustomMessageRender: {
            control: 'boolean',
            name: 'Use Custom Message Renderer',
        },
        cancelMessageEditingStart: {
            control: 'boolean',
            name: 'Emulate Message Editing Cancellation',
        },
        cancelMessageDeleting: {
            control: 'boolean',
            name: 'Emulate Message Deleting Cancellation',
        },
        allowOnlyLatinTextOnEdit: {
            control: 'boolean',
            name: 'Allow only latin letters in message editing',
        }
    },
    render: ({
        width,
        height,
        user,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
        allowDeleting,
        allowUpdating,
        useCustomMessageRender,
        cancelMessageEditingStart,
        cancelMessageDeleting,
        allowOnlyLatinTextOnEdit,
    }) => {
        const messages = useMemo(() => {
            const initial = initialMessages.map(item => ({
                ...item,
                id: `dx-${new Guid()}`,
            }));
            initial[4].isDeleted = true;
            initial[5].isDeleted = true;
            initial[6].isDeleted = true;
            return initial;
        }, [initialMessages]);

        const [toastConfig, setToastConfig] = useState({
            visible: false,
            message: '',
        });

        const messagesRef = React.useRef([...messages]);

        const dataSource = useMemo(() => new DataSource({
            store: new CustomStore({
                load: () => new Promise(resolve => setTimeout(() => resolve([...messagesRef.current]), 500)),
                insert: (message) => {
                    message.id = `dx-${new Guid()}`;
                    if (message.author.id === user?.id) {
                        message.author = {
                            ...message.author,
                            ...user,
                        }
                    }
                    messagesRef.current.push(message);
                    return new Promise<void>(resolve => setTimeout(resolve, 200));
                },
                key: 'id',
            }),
            paginate: false,
        }), [user]);

        const onUndoClick = useCallback((message: Message) => {
            const store = dataSource.store();
            store.push([{ type: 'update', key: message.id, data: { isDeleted: false } }]);
        }, [dataSource]);

        const messageRender = useCallback(({ message }) => {
            if(message.isDeleted === true) {
                return (
                    <div
                        className="dx-chat-messagebubble-content dx-chat-messagebubble-deleted"
                        style={{
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                            fontStyle: 'italic',
                        }}
                    >
                        <div className="dx-icon dx-icon-cursorprohibition"></div>
                        <div>This message was deleted</div>
                        { user?.id === message.author.id &&
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                onUndoClick(message);
                            }}>Undo</a>
                        }
                    </div>
                );
            }

            return <div>{message.text}</div>;
        }, [user]);

        const showToast = useCallback((message: string) => {
            setToastConfig({
                visible: true,
                message,
            });
        }, []);

        const onToastHiding = useCallback(() => {
            setToastConfig({
                visible: false,
                message: '',
            });
        }, []);

        const validateMessage = (message: string) => message.match(/^[a-zA-Z0-9.,!? ]+$/);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    editing={{ allowDeleting, allowUpdating }}
                    width={width}
                    height={height}
                    dataSource={dataSource}
                    reloadOnChange={false}
                    user={user}
                    onMessageEntered={(e) => {
                        e.component.getDataSource().store().push([{ type: 'insert', data: e.message }]);
                    }}
                    onMessageEditingStart={async (e) => {
                        if (cancelMessageEditingStart) {
                            showToast('Message editing not allowed');
                            e.cancel = true;
                        }
                    }}
                    onMessageEditCanceled={() => {
                        showToast('Message editing is canceled');
                    }}
                    onMessageDeleting={(e) => {
                        if (cancelMessageDeleting) {
                            showToast('Message deleting was canceled');
                            e.cancel = true;
                        }
                    }}
                    onMessageDeleted={(e) => {
                        e.component.getDataSource().store().push([{ type: 'update', key: e.message.id, data: { isDeleted: true } }]);
                    }}
                    onMessageUpdating={async (e) => {
                        if (allowOnlyLatinTextOnEdit) {
                            if (!validateMessage(e.text ?? '')) {
                                showToast('Only latin allowed in message');
                                e.cancel = true;
                            }
                        }
                    }}
                    onMessageUpdated={(e) => {
                        e.component.getDataSource().store().push([{ type: 'update', key: e.message.id, data: { text: e.text, isEdited: true } }]);
                    }}
                    activeStateEnabled={activeStateEnabled}
                    focusStateEnabled={focusStateEnabled}
                    hoverStateEnabled={hoverStateEnabled}
                    {...(useCustomMessageRender && { messageRender })} 
                />
                <Toast
                    {...toastConfig}
                    onHiding={onToastHiding}
                    displayTime={600}
                />
            </div>
        );
    }
};

export const FileAttachments: Story = {
  args: {
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
  },
  render: ({
    width,
    height,
    disabled,
    rtlEnabled,
    user,
    visible,
    activeStateEnabled,
    hoverStateEnabled,
    focusStateEnabled,
  }) => {
    const [messages, setMessages] = useState<ChatTypes.Message[]>([
      {
        id: 1,
        author: firstAuthor,
        text: 'Files attached in a very long message: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel tempus orci, sit amet tempor tortor. Etiam ut aliquam nisi.',
        attachments: [
          { name: 'report.pdf', size: 1024 * 512 },
          { name: 'presentation.pptx', size: 1024 * 1024 },
          { name: 'photo.jpg', size: 1024 * 300 },
          { name: 'song.mp3', size: 1024 * 300 },
        ],
      },
      {
        id: 2,
        author: secondAuthor,
        text: 'Files, short message',
        attachments: [
          { name: 'report.pdf', size: 1024 * 512 },
          { name: 'song.mp3', size: 1024 * 1024 },
        ],
      },
    ]);

    const [toastConfig, setToastConfig] = useState({
      visible: false,
      message: '',
    });

    const onAttachmentDownloadClick = useCallback((e: ChatTypes.AttachmentDownloadClickEvent) => {
      const { attachment } = e;

      setToastConfig({
        visible: true,
        message: `Downloading ${attachment?.name}...`,
      });

      setTimeout(() => {
        setToastConfig({
          visible: true,
          message: `${attachment?.name} downloaded successfully`,
        });
      }, 1000);
    }, []);

    const onMessageEntered = useCallback(
      ({ message }) => {
        setMessages((prev) => [...prev, message]);
      },
      []
    );

    const onToastHiding = useCallback(() => {
      setToastConfig({ visible: false, message: '' });
    }, []);

    const fileUploaderOptions = useMemo(() => ({
        uploadFile: (file: File) => {
          setToastConfig({
            visible: true,
            message: `Uploading ${file.name}...`,
          });
          setTimeout(() => {
            setToastConfig({
              visible: true,
              message: `${file.name} uploaded successfully`,
            });
          }, 1000);
        }
    }), []);

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Chat
          width={width}
          height={height}
          items={messages}
          disabled={disabled}
          rtlEnabled={rtlEnabled}
          user={user}
          visible={visible}
          activeStateEnabled={activeStateEnabled}
          focusStateEnabled={focusStateEnabled}
          hoverStateEnabled={hoverStateEnabled}
          onAttachmentDownloadClick={onAttachmentDownloadClick}
          onMessageEntered={onMessageEntered}
          fileUploaderOptions={fileUploaderOptions}
        />
        <Toast
          {...toastConfig}
          onHiding={onToastHiding}
          displayTime={1000}
        />
      </div>
    );
  },
};

export const ControlledMode: Story = {
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
            defaultValue: firstAuthor.name,
        },
        inputFieldText: {
            control: 'text',
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
        user,
        items,
        inputFieldText,
        visible,
        hint,
        activeStateEnabled,
        hoverStateEnabled,
        focusStateEnabled,
    }) => {
        const [messages, setMessages] = useState(items);
        const [text, setText] = useState(inputFieldText ?? '');

        const onMessageEntered = useCallback(({ message }) => {
            setMessages((prev) => [...prev, message]);
        }, []);

        const onInputFieldTextChanged = useCallback((e: ChatTypes.InputFieldTextChangedEvent) => {
            setText(e.value ?? '');
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
                    visible={visible}
                    hint={hint}
                    activeStateEnabled={activeStateEnabled}
                    focusStateEnabled={focusStateEnabled}
                    hoverStateEnabled={hoverStateEnabled}
                    inputFieldText={text}
                    onInputFieldTextChanged={onInputFieldTextChanged}
                    onMessageEntered={onMessageEntered}
                >
                </Chat>
            </div>
        );
    }
}

export const SendButtonOptions: Story = {
    args: {
        action: 'send',
        icon: 'arrowright',
        enableOnClick: false,
    },
    argTypes: {
        action: {
            control: 'select',
            options: ['send', 'custom'],
        },
        icon: {
            control: 'text',
        },
        enableOnClick: {
            name: 'Enable onClick handler',
            control: 'boolean',
        },
    },
    render: ({ action, icon, enableOnClick }) => {
        const [messages, setMessages] = useState<ChatTypes.Message[]>([...initialMessages]);
        const [lastClick, setLastClick] = useState<string>('—');

        const onMessageEntered = useCallback(({ message }: ChatTypes.MessageEnteredEvent) => {
            setMessages((prev) => [...prev, message]);
        }, []);

        const sendButtonOptions = useMemo<ChatTypes.SendButtonProperties>(() => ({
            action,
            icon,
            ...(enableOnClick && {
                onClick: () => setLastClick(new Date().toLocaleTimeString()),
            }),
        }), [action, icon, enableOnClick]);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div>
                    Last onClick fired at: <strong>{lastClick}</strong>
                </div>
                <Chat
                    width={400}
                    height={500}
                    items={messages}
                    user={secondAuthor}
                    onMessageEntered={onMessageEntered}
                    sendButtonOptions={sendButtonOptions}
                />
            </div>
        );
    },
};

const suggestionItems: ButtonGroupItem[] = [
    { text: '📦 Track my orders' },
    { text: '⭐ Check in-stock favorites' },
    { text: '🔄 Start a return' },
    { text: '🔍 Find my order' },
    { text: '💳 Payment & billing help with Soul' },
];

export const Suggestions: Story = {
    args: {
        sendImmediately: false,
        stylingMode: 'outlined',
    },
    argTypes: {
        sendImmediately: {
            name: 'Send immediately on suggestion click',
            control: 'boolean',
        },
        stylingMode: {
            name: 'Suggestions styling mode',
            control: 'select',
            options: ['contained', 'outlined', 'text'],
        },
    },
    render: ({ sendImmediately, stylingMode }) => {
        const [messages, setMessages] = useState<ChatTypes.Message[]>([]);
        const [inputFieldText, setInputFieldText] = useState('');

        const onMessageEntered = useCallback(({ message }: ChatTypes.MessageEnteredEvent) => {
            setMessages((prev) => [...prev, message]);
            setInputFieldText('');
        }, []);

        const suggestions = useMemo<ChatTypes.Properties['suggestions']>(() => ({
            items: suggestionItems,
            stylingMode,
            onItemClick: (e: ButtonGroupItemClickEvent) => {
                if (sendImmediately) {
                    setMessages((prev) => [...prev, {
                        timestamp: new Date(),
                        author: firstAuthor,
                        text: e.itemData?.text,
                    }]);
                } else {
                    setInputFieldText(e.itemData?.text ?? '');
                }
            },
        }), [sendImmediately, stylingMode]);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chat
                    width={740}
                    height={500}
                    items={messages}
                    user={firstAuthor}
                    inputFieldText={inputFieldText}
                    onMessageEntered={onMessageEntered}
                    suggestions={suggestions}
                />
            </div>
        );
    },
};

type ToolCallExpanded = 'Default' | 'Expanded' | 'Collapsed';

interface ToolCallsStoryArgs {
    expandAll?: boolean;
    showInMessageTemplate?: boolean;
    useMessageTemplate?: boolean;
    name?: string;
    status?: 'Default' | 'success' | 'error';
    expanded?: ToolCallExpanded;
    arguments?: Record<string, unknown>;
    result?: string;
}

const ALERT_TIMEOUT = 1000 * 60;

type ToolCallsMessage = ChatTypes.Message;

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;

    return 'Unknown error';
};

const getFirstToolCallOverrides = ({
    name, status, expanded, arguments: toolCallArguments, result,
}: Pick<ToolCallsStoryArgs, 'name' | 'status' | 'expanded' | 'arguments' | 'result'>): Partial<ChatTypes.ToolCall> => ({
    ...(name === undefined ? {} : { name }),
    ...(status === undefined || status === 'Default' ? {} : { status }),
    ...(expanded === undefined || expanded === 'Default' ? {} : { expanded: expanded === 'Expanded' }),
    ...(toolCallArguments === undefined ? {} : { arguments: toolCallArguments }),
    ...(result === undefined ? {} : { result }),
});

// The controls change the first tool call of the first message that has tool calls
const applyFirstToolCallOverrides = (
    messages: ToolCallsMessage[],
    overrides: Partial<ChatTypes.ToolCall>,
): ToolCallsMessage[] => {
    let applied = false;

    return messages.map((message) => {
        const { toolCalls } = message as ChatTypes.TextMessage;

        if (applied || !toolCalls?.length) {
            return message;
        }

        applied = true;

        const [firstToolCall, ...otherToolCalls] = toolCalls;

        return { ...message, toolCalls: [{ ...firstToolCall, ...overrides }, ...otherToolCalls] } as ToolCallsMessage;
    });
};

// The messages of the AI service (the first one is the system prompt) are kept apart from the Chat messages
const createHistory = (): ModelMessage[] => [{ role: 'system', content: systemPrompt }];

export const ToolCallsVisualization: StoryObj<ToolCallsStoryArgs> = {
    name: 'Tool Calls Visualization',
    parameters: {
        controls: { expanded: true },
    },
    args: {
        expandAll: false,
        showInMessageTemplate: false,
        useMessageTemplate: false,
        status: 'Default',
        expanded: 'Default',
    },
    argTypes: {
        expandAll: { name: 'toolCallOptions.expandAll', control: 'boolean' },
        showInMessageTemplate: {
            name: 'toolCallOptions.showInMessageTemplate',
            description: 'Takes effect only when messageTemplate is used (enable "messageTemplate" below)',
            control: 'boolean',
        },
        useMessageTemplate: {
            name: 'messageTemplate',
            description: 'Renders messages with a custom template',
            control: 'boolean',
        },
        name: {
            name: 'toolCalls[0].name',
            description: 'The controls below change the first tool call of the first message that has tool calls. Ask the assistant something first',
            control: 'text',
        },
        status: {
            name: 'toolCalls[0].status',
            control: { type: 'inline-radio' },
            options: ['Default', 'success', 'error'],
        },
        expanded: {
            name: 'toolCalls[0].expanded',
            description: 'Default: the state is defined by toolCallOptions.expandAll',
            control: { type: 'inline-radio' },
            options: ['Default', 'Expanded', 'Collapsed'],
        },
        arguments: {
            name: 'toolCalls[0].arguments',
            description: 'Example: { "country": "UK", "city": "London" }. An empty object hides the field',
            control: 'object',
        },
        result: {
            name: 'toolCalls[0].result',
            description: 'Example: 15\u00b0C (59\u00b0F). An empty string hides the field',
            control: 'text',
        },
    },
    render: ({
        expandAll,
        showInMessageTemplate,
        useMessageTemplate,
        name,
        status,
        expanded,
        arguments: toolCallArguments,
        result,
    }) => {
        const overrides = getFirstToolCallOverrides({
            name, status, expanded, arguments: toolCallArguments, result,
        });
        const overridesRef = useRef(overrides);

        overridesRef.current = overrides;

        const storeRef = useRef<ToolCallsMessage[]>([]);
        const historyRef = useRef<ModelMessage[]>(createHistory());
        const [alerts, setAlerts] = useState<ChatTypes.Alert[]>([]);
        const [typingUsers, setTypingUsers] = useState<ChatTypes.User[]>([]);
        const [busy, setBusy] = useState(false);
        const busyRef = useRef(false);
        const cardRef = useRef<HTMLDivElement>(null);
        const wasBusyRef = useRef(false);

        useEffect(() => {
            const messageBox = cardRef.current?.querySelector('.dx-chat-messagebox');

            // inert closes the keyboard too: pointer-events alone leaves Enter working in the focused input
            messageBox?.toggleAttribute('inert', busy);

            if (wasBusyRef.current && !busy) {
                messageBox?.querySelector('textarea')?.focus();
            }

            wasBusyRef.current = busy;
        }, [busy]);

        const dataSource = useMemo(() => new DataSource({
            store: new CustomStore({
                key: 'id',
                load: () => Promise.resolve(applyFirstToolCallOverrides(storeRef.current, overridesRef.current)),
                insert: (message: ToolCallsMessage) => {
                    if (!storeRef.current.some(({ id }) => id === message.id)) {
                        storeRef.current.push(message);
                    }

                    return Promise.resolve(message);
                },
            }),
            paginate: false,
        }), []);

        const pushMessage = useCallback((message: ToolCallsMessage) => {
            const messages = applyFirstToolCallOverrides([...storeRef.current, message], overridesRef.current);

            storeRef.current.push(message);
            dataSource.store().push([{ type: 'insert', data: messages[messages.length - 1] }]);
        }, [dataSource]);

        const overridesKey = JSON.stringify(overrides);

        useEffect(() => {
            dataSource.reload();
        }, [dataSource, overridesKey]);

        const messageRender = useCallback(({ message }: { message: ChatTypes.Message }) => (
            <div>
                <b>Custom template: </b>
                {(message as ChatTypes.TextMessage).text}
            </div>
        ), []);

        const showError = useCallback((message: string) => {
            setAlerts([{ message }]);
            setTimeout(() => setAlerts([]), ALERT_TIMEOUT);
        }, []);

        const sendToAI = useCallback(async (text: string) => {
            const history = historyRef.current.length;

            busyRef.current = true;
            setBusy(true);
            historyRef.current.push({ role: 'user', content: text });
            setTypingUsers([toolCallsAssistant]);

            try {
                const { text: answer, toolCalls } = await getAIResponse(historyRef.current);

                historyRef.current.push({ role: 'assistant', content: answer });

                pushMessage({
                    id: Date.now(),
                    timestamp: new Date(),
                    author: toolCallsAssistant,
                    text: answer,
                    ...(toolCalls.length ? { toolCalls } : {}),
                });
            } catch (error) {
                historyRef.current.length = history;
                showError(getErrorMessage(error));
            } finally {
                setTypingUsers([]);
                busyRef.current = false;
                setBusy(false);
            }
        }, [pushMessage, showError]);

        const onMessageEntered = useCallback(({ message }: { message: ToolCallsMessage }) => {
            if (busyRef.current) {
                return;
            }

            pushMessage({ id: Date.now(), ...message });

            if (!alerts.length) {
                sendToAI(message.text ?? '');
            }
        }, [pushMessage, sendToAI, alerts.length]);

        const sendSuggestion = useCallback((prompt: string) => {
            if (busyRef.current) {
                return;
            }

            pushMessage({ id: Date.now(), timestamp: new Date(), author: toolCallsUser, text: prompt });

            if (!alerts.length) {
                sendToAI(prompt);
            }
        }, [pushMessage, sendToAI, alerts.length]);

        const clear = useCallback(() => {
            storeRef.current.length = 0;
            historyRef.current = createHistory();
            setAlerts([]);
            setTypingUsers([]);
            dataSource.reload();
        }, [dataSource]);

        const renderEmptyView = useCallback(() => (
            <div>
                <div className="dx-chat-messagelist-empty-message">Chat is Empty</div>
                <div className="dx-chat-messagelist-empty-prompt">Click a tile below to call a function.</div>
                <div className="chat-suggestion-cards">
                    {suggestionCards.map((card) => (
                        <button
                            key={card.title}
                            type="button"
                            className="chat-suggestion-card"
                            onClick={() => sendSuggestion(card.prompt)}
                        >
                            <div className="chat-suggestion-card-title">{card.title}</div>
                            <div className="chat-suggestion-card-prompt">{card.description}</div>
                        </button>
                    ))}
                </div>
            </div>
        ), [sendSuggestion]);

        return (
            <div className="tool-calls-demo">
                <div className="ai-chat-card" ref={cardRef}>
                    <ToolCallsToolbar>
                        <ToolCallsToolbarItem location="before" text="AI Assistant" cssClass="ai-chat-title" />
                        <ToolCallsToolbarItem location="after">
                            <Button
                                icon="clearhistory"
                                stylingMode="text"
                                hint="Clear chat"
                                disabled={busy}
                                onClick={clear}
                            />
                        </ToolCallsToolbarItem>
                    </ToolCallsToolbar>
                    <Chat
                        className={busy ? 'chat-disabled' : undefined}
                        user={toolCallsUser}
                        height={710}
                        dataSource={dataSource}
                        reloadOnChange={false}
                        showAvatar
                        showDayHeaders={false}
                        speechToTextEnabled
                        alerts={alerts}
                        typingUsers={typingUsers}
                        onMessageEntered={onMessageEntered}
                        emptyViewRender={renderEmptyView}
                        {...(useMessageTemplate && { messageRender })}
                    >
                        <ToolCallOptions 
                            expandAll={expandAll} 
                            showInMessageTemplate={showInMessageTemplate} 
                        />
                    </Chat>
                </div>
            </div>
        );
    },
};
