import React, { useState, useCallback } from 'react';
import {Chat, ChatTypes} from 'devextreme-react/chat'
import type {Meta, StoryObj} from '@storybook/react';

import { author_info_1, author_info_2, initialMessages } from './data';

import { Button } from 'devextreme-react';
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

export const Common: Story = {
    args: {
        items: initialMessages,
        user: author_info_1,
        ...commonArgs,
    },
    argTypes: {
        user: {
            control: 'select',
            options: [author_info_1.name, author_info_2.name],
            mapping: {
                [author_info_1.name]: author_info_1,
                [author_info_2.name]: author_info_2,
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
        user: author_info_2,
        ...commonArgs,
        width: '100%',
        height: '100%'
    },
    argTypes: {
        user: {
            control: 'select',
            options: [author_info_1.name, author_info_2.name],
            mapping: {
                [author_info_1.name]: author_info_1,
                [author_info_2.name]: author_info_2,
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
        
        const [popupWithScrollViewVisible, setPopupWithScrollViewVisible] = useState(false);
        
        const showPopupWithScrollView = useCallback(() => {
            setPopupWithScrollViewVisible(true);
        }, [setPopupWithScrollViewVisible]);
        
        const hide = useCallback(() => {
            setPopupWithScrollViewVisible(false);
        }, [setPopupWithScrollViewVisible]);
        
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    text="Show Chat In Popup"
                    width={300}
                    type="default"
                    onClick={showPopupWithScrollView}
                />
                
                <Popup
                    width={400}
                    height={500}
                    visible={popupWithScrollViewVisible}
                    onHiding={hide}
                    hideOnOutsideClick={true}
                    showCloseButton={true}
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
            </div>
        );
    }
}
