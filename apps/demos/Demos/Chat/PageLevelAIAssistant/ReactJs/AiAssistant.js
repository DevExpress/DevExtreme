import React, { useCallback, useMemo, useRef, useState } from 'react';
import Chat from 'devextreme-react/chat';
import Popup, { Position } from 'devextreme-react/popup';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import { ArrayStore, DataSource } from 'devextreme-react/common/data';
import { routeMessage } from './chat-router.js';
import { emptyViewMessage } from './data.js';
const chatStore = new ArrayStore({ key: 'id' });
const chatDataSource = new DataSource({ store: chatStore, paginate: false });
const chatSuggestionItems = [
    { text: 'Show Completed Tasks', prompt: 'Show Completed Tasks' },
    { text: 'Change State to Texas', prompt: 'Change State to Texas' },
];
const chatUser = { id: 'user' };
const popupWrapperAttr = { class: 'chat-popup' };
function EmptyView() {
    return (<>
      <div className="dx-chat-messagelist-empty-image dx-ai-chat__empty-image"/>
      <div className="ai-chat-empty-message">{emptyViewMessage}</div>
      <div className="ai-chat-empty-prompt">
        <div>Update employee <b>Form</b> fields.</div>
        <div>Filter or sort tasks, display or hide <b>DataGrid</b> columns, or clear all filters and sorting.</div>
      </div>
    </>);
}
export default function AiAssistant({ formRef, gridRef, aiIntegration }) {
    const clearButtonInstance = useRef(null);
    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const updateClearButtonState = useCallback(() => {
        clearButtonInstance.current?.option('disabled', chatDataSource.items().length === 0);
    }, []);
    const pushMessage = useCallback((message) => {
        chatStore.push([{ type: 'insert', data: { id: Date.now() + Math.random(), timestamp: new Date(), ...message } }]);
    }, []);
    const handleUserMessage = useCallback((message) => {
        const form = formRef.current?.instance();
        const grid = gridRef.current?.instance();
        if (!form || !grid) {
            return;
        }
        setDisabled(true);
        clearButtonInstance.current?.option('disabled', true);
        routeMessage(String(message.text), { form, gridInstance: grid, aiIntegration, pushMessage }).finally(() => {
            setDisabled(false);
            updateClearButtonState();
        });
    }, [aiIntegration, formRef, gridRef, pushMessage, updateClearButtonState]);
    const onMessageEntered = useCallback(({ message }) => {
        handleUserMessage(message);
    }, [handleUserMessage]);
    const onSuggestionItemClick = useCallback(({ itemData }) => {
        if (!itemData?.prompt) {
            return;
        }
        const suggestionMessage = {
            author: chatUser,
            text: itemData.prompt,
        };
        pushMessage(suggestionMessage);
        handleUserMessage(suggestionMessage);
    }, [handleUserMessage, pushMessage]);
    const clearChat = useCallback(() => {
        chatStore.clear();
        chatDataSource.reload();
        updateClearButtonState();
    }, [updateClearButtonState]);
    const onPopupShowing = useCallback(() => setVisible(true), []);
    const onPopupHiding = useCallback(() => setVisible(false), []);
    const onClearButtonInitialized = useCallback((event) => {
        if (event.component) {
            clearButtonInstance.current = event.component;
            updateClearButtonState();
        }
    }, [updateClearButtonState]);
    const toolbarItems = useMemo(() => [{
            widget: 'dxButton',
            toolbar: 'top',
            location: 'after',
            cssClass: 'ai-chat-clear-button',
            options: {
                icon: 'clearhistory',
                hint: 'Clear chat',
                disabled: true,
                onClick: clearChat,
                onInitialized: onClearButtonInitialized,
            },
        }], [clearChat, onClearButtonInitialized]);
    const suggestions = useMemo(() => ({
        items: chatSuggestionItems,
        onItemClick: onSuggestionItemClick,
        disabled,
    }), [disabled, onSuggestionItemClick]);
    return (<>
      <SpeedDialAction icon="sparkle" label="AI Assistant" visible={!visible} onClick={onPopupShowing}/>
      <Popup title="AI Assistant" visible={visible} width={400} height="90%" dragEnabled={true} resizeEnabled={true} showCloseButton={true} shading={false} wrapperAttr={popupWrapperAttr} onHiding={onPopupHiding} toolbarItems={toolbarItems}>
        <Position my="right top" at="right top" of=".demo-container" offset="-20 20"/>
        <Chat height="100%" showAvatar={false} user={chatUser} showUserName={false} speechToTextEnabled={true} reloadOnChange={true} dataSource={chatDataSource} disabled={disabled} suggestions={suggestions} emptyViewRender={EmptyView} onMessageEntered={onMessageEntered}/>
      </Popup>
    </>);
}
