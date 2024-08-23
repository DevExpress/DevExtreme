import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';

export interface AvatarOptions {
  name?: string;
}

class Avatar extends Component<AvatarOptions> {
  _getAvatarInitials(name: string): string {
    const initials = name.charAt(0).toUpperCase();

    return initials;
  }

  render(): InfernoNode {
    return (
      <div className={CHAT_MESSAGE_AVATAR_CLASS}>
        <div className={CHAT_MESSAGE_AVATAR_INITIALS_CLASS}>
          {this.props.name && this._getAvatarInitials(this.props.name)}
        </div>
      </div>
    );
  }
}

export default Avatar;
