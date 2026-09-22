(() => {
  const RECORD_SEPARATOR = String.fromCharCode(0x1e);
  const NativeWebSocket = window.WebSocket;
  const HANDSHAKE_RESPONSE = {};

  const isCollaborativeEditingHub = (url) => /dataGridCollaborativeEditingHub/i.test(String(url));

  class CollaborativeEditingHubSocket {
    constructor(url) {
      this.url = url;
      this.readyState = NativeWebSocket.CONNECTING;

      setTimeout(() => {
        this.readyState = NativeWebSocket.OPEN;
        if (this.onopen) {
          this.onopen({ target: this });
        }
      });
    }

    send(data) {
      String(data)
        .split(RECORD_SEPARATOR)
        .filter((frame) => frame.length)
        .forEach((frame) => this.reply(JSON.parse(frame)));
    }

    reply(message) {
      if (message.protocol) {
        this.dispatch(HANDSHAKE_RESPONSE);
      }
    }

    dispatch(message) {
      if (this.onmessage) {
        this.onmessage({ data: JSON.stringify(message) + RECORD_SEPARATOR });
      }
    }

    close() {
      this.readyState = NativeWebSocket.CLOSED;
      if (this.onclose) {
        this.onclose({ wasClean: true, code: 1000, reason: '' });
      }
    }
  }

  window.WebSocket = function WebSocket(url, protocols) {
    return isCollaborativeEditingHub(url)
      ? new CollaborativeEditingHubSocket(url)
      : new NativeWebSocket(url, protocols);
  };

  window.WebSocket.CONNECTING = NativeWebSocket.CONNECTING;
  window.WebSocket.OPEN = NativeWebSocket.OPEN;
  window.WebSocket.CLOSING = NativeWebSocket.CLOSING;
  window.WebSocket.CLOSED = NativeWebSocket.CLOSED;
})();
