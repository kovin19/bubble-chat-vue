let websocket: WebSocket | null = null;

type WebSocketEvents = {
    onOpen?: () => void;
    onError?: () => void;
    onClose?: () => void;
    onMessage?: (event: MessageEvent) => void;
}

export function connectToWebSocket(events?: WebSocketEvents) {
    websocket = new WebSocket(`ws://localhost:8000/ws/chat`)

    websocket.onopen = () => events?.onOpen?.();
    websocket.onerror = () => events?.onError?.();
    websocket.onclose = () => events?.onClose?.();
    websocket.onmessage = e => events?.onMessage?.(e);

    return websocket;
}

export function sendMessage(message: Blob) {
    websocket?.send(message);
}

export function closeWebSocket() {
    websocket?.close();
}