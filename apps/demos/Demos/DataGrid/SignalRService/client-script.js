(() => {
  const RECORD_SEPARATOR = String.fromCharCode(0x1e);
  const NativeWebSocket = window.WebSocket;
  const HANDSHAKE_RESPONSE = {};
  const INVOCATION = 1;
  const COMPLETION = 3;

  const isLiveUpdateHub = (url) => /liveUpdateSignalRHub/i.test(String(url));

  class LiveUpdateHubSocket {
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
        return;
      }

      if (message.type === INVOCATION && message.target === 'getAllStocks') {
        this.dispatch({
          type: COMPLETION,
          invocationId: message.invocationId,
          result: [],
        });
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
    return isLiveUpdateHub(url)
      ? new LiveUpdateHubSocket(url)
      : new NativeWebSocket(url, protocols);
  };

  window.WebSocket.CONNECTING = NativeWebSocket.CONNECTING;
  window.WebSocket.OPEN = NativeWebSocket.OPEN;
  window.WebSocket.CLOSING = NativeWebSocket.CLOSING;
  window.WebSocket.CLOSED = NativeWebSocket.CLOSED;
})();
