# Chat Module

Hệ thống chat hoàn chỉnh với các tính năng:

- **Chat 1-1** (chỉ hỗ trợ DIRECT chat)
- **Quyền chat theo role:**
  - Admin ↔ Admin
  - Admin ↔ StoreOwner
  - StoreOwner ↔ Admin
- Real-time messaging qua WebSocket
- Push notifications (Web Push) - thông báo tin nhắn mới cho web
- Read receipts
- Typing indicators

## Cài đặt

### 1. Database Migration

Chạy migration để tạo các bảng cần thiết:

```bash
npx prisma migrate dev --name add_chat_system
```

### 2. Environment Variables

Thêm các biến môi trường sau vào file `.env`:

```env
# Web Push Configuration (cho web push notifications)
# VAPID (Voluntary Application Server Identification) keys dùng để xác thực server khi gửi push notifications
# Tạo keys bằng lệnh: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=your_vapid_public_key  # Public key - được gửi đến browser để đăng ký push subscription (có thể công khai)
VAPID_PRIVATE_KEY=your_vapid_private_key  # Private key - dùng để ký và mã hóa push notifications (BẢO MẬT, không được tiết lộ)
VAPID_SUBJECT=mailto:your-email@example.com  # Email hoặc URL của server - dùng để liên hệ nếu có vấn đề với push service
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## API Endpoints

**Base URL:** `http://localhost:8000/api/v1` (hoặc domain của bạn)

**Authentication:** Tất cả endpoints yêu cầu JWT token trong header `Authorization: Bearer {token}` hoặc cookie `accessToken_{role}`

### Users & Conversations

#### `GET /api/v1/chat/users`

Lấy danh sách users có thể chat (Admin và StoreOwner)

**Response 200:**

```json
[
  {
    "id": 2,
    "name": "StoreOwner 1",
    "avatar": "https://...",
    "email": "storeowner1@example.com",
    "role": "STOREOWNER",
    "conversationId": 5 // null nếu chưa có conversation
  }
]
```

#### `GET /api/v1/chat/conversations/with/:userId`

Lấy hoặc tạo conversation với một user (tự động tạo nếu chưa có)

**Response 200:**

```json
{
  "id": 5,
  "type": "DIRECT",
  "members": [
    {
      "user": {
        "id": 1,
        "name": "Admin 1",
        "avatar": "...",
        "email": "...",
        "role": "ADMIN"
      }
    }
  ],
  "lastMessage": { ... },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /api/v1/chat/conversations`

Lấy danh sách conversations đã có (có pagination)

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response 200:**

```json
{
  "data": [
    {
      "id": 5,
      "type": "DIRECT",
      "members": [...],
      "lastMessage": {...}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

#### `GET /api/v1/chat/conversations/:id`

Lấy thông tin conversation

**Response 200:** Tương tự như `GET /api/v1/chat/conversations/with/:userId`

#### `POST /api/v1/chat/conversations`

Tạo conversation mới (chỉ chat 1-1)

**Request Body:**

```json
{
  "memberIds": [2] // Array với 1 phần tử (user ID muốn chat)
}
```

**Response 201:** Tương tự như `GET /api/v1/chat/conversations/with/:userId`

#### `POST /api/v1/chat/conversations/:id/leave`

Rời khỏi conversation

**Response 200:**

```json
{
  "message": "Đã rời khỏi conversation"
}
```

### Messages

#### `POST /api/v1/chat/messages`

Gửi tin nhắn

**Request Body:**

```json
{
  "conversationId": 5,
  "content": "Xin chào!"
}
```

**Response 201:**

```json
{
  "id": 1,
  "content": "Xin chào!",
  "senderId": 1,
  "conversationId": 5,
  "sender": {
    "id": 1,
    "name": "Admin 1",
    "avatar": "..."
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /api/v1/chat/conversations/:id/messages`

Lấy danh sách tin nhắn (có pagination)

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response 200:**

```json
{
  "data": [
    {
      "id": 1,
      "content": "Hello!",
      "senderId": 2,
      "conversationId": 5,
      "sender": {
        "id": 2,
        "name": "StoreOwner 1",
        "avatar": "..."
      },
      "readBy": [{ "userId": 1 }, { "userId": 2 }],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

**Lưu ý:** Messages được sắp xếp theo `createdAt DESC` (mới nhất trước)

#### `DELETE /api/v1/chat/messages/:id`

Xóa tin nhắn (soft delete)

**Response 200:**

```json
{
  "message": "Đã xóa tin nhắn"
}
```

### Push Notifications

#### `POST /api/v1/chat/push/subscribe`

Đăng ký push notification

**Request Body:**

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "p256dh": "...",
  "auth": "...",
  "platform": "WEB",
  "deviceId": "optional-device-id"
}
```

**Response 201:**

```json
{
  "id": 1,
  "userId": 1,
  "endpoint": "...",
  "platform": "WEB",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /api/v1/chat/push/unsubscribe`

Hủy đăng ký push notification

**Request Body:**

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

**Response 200:**

```json
{
  "message": "Đã hủy đăng ký push notification"
}
```

### Error Responses

Tất cả endpoints có thể trả về các lỗi sau:

**401 Unauthorized:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden:**

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền thực hiện hành động này"
}
```

**404 Not Found:**

```json
{
  "statusCode": 404,
  "message": "Conversation không tồn tại"
}
```

**400 Bad Request:**

```json
{
  "statusCode": 400,
  "message": "Nội dung tin nhắn không được để trống",
  "error": "Bad Request"
}
```

## WebSocket Setup

### Backend đã setup sẵn

Backend đã được cấu hình đầy đủ để hỗ trợ WebSocket:

1. **Socket.IO Adapter** - Đã được enable trong `main.ts`:

   ```typescript
   app.useWebSocketAdapter(new IoAdapter(app));
   ```

2. **ChatGateway** - Đã được setup với:
   - Namespace: `/chat`
   - CORS enabled
   - JWT Authentication tự động khi client connect
   - Tự động track connected users
   - Tự động emit events khi có tin nhắn mới

3. **Authentication** - Backend tự động:
   - Extract JWT token từ `auth.token`, `query.token`, hoặc cookie
   - Verify token và lưu user info vào socket
   - Disconnect nếu token không hợp lệ

4. **Auto Events** - Backend tự động emit:
   - `new_message` - Khi có tin nhắn mới (từ `chat.service.ts`)
   - `message_sent` - Khi tin nhắn được gửi thành công
   - `user_typing` - Khi user đang gõ

### Frontend chỉ cần kết nối

Frontend chỉ cần kết nối đến WebSocket server và lắng nghe events. Backend sẽ tự động xử lý phần còn lại.

## WebSocket Events

**WebSocket URL:** `http://localhost:8000/chat` (với Socket.IO client)

**Lưu ý:**

- Sử dụng `http://` hoặc `https://` với Socket.IO client (không dùng `ws://`)
- Port mặc định: `8000` (có thể thay đổi qua env variable `PORT`)
- Namespace: `/chat`

### Client Events

- `join_conversation` - Tham gia conversation room

  ```json
  { "conversationId": 1 }
  ```

- `leave_conversation` - Rời khỏi conversation room

  ```json
  { "conversationId": 1 }
  ```

- `send_message` - Gửi tin nhắn

  ```json
  {
    "conversationId": 1,
    "content": "Hello!"
  }
  ```

- `typing_start` - Bắt đầu gõ

  ```json
  { "conversationId": 1 }
  ```

- `typing_stop` - Dừng gõ
  ```json
  { "conversationId": 1 }
  ```

### Server Events

#### `connected` - Kết nối thành công

Emitted khi client kết nối thành công và được xác thực.

**Payload:**

```json
{
  "userId": 1,
  "message": "Connected to chat server"
}
```

#### `new_message` - Tin nhắn mới

Emitted khi có tin nhắn mới trong conversation (cho tất cả members trừ sender).

**Payload:**

```json
{
  "message": {
    "id": 1,
    "content": "Hello!",
    "senderId": 2,
    "conversationId": 5,
    "sender": {
      "id": 2,
      "name": "StoreOwner 1",
      "avatar": "..."
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `message_sent` - Tin nhắn đã gửi (cho sender)

Emitted cho sender khi tin nhắn được gửi thành công.

**Payload:** Tương tự như `new_message`

#### `message_deleted` - Tin nhắn đã bị xóa

Emitted khi một tin nhắn bị xóa.

**Payload:**

```json
{
  "conversationId": 5,
  "messageId": 1
}
```

#### `conversation_updated` - Conversation đã được cập nhật

Emitted khi conversation được cập nhật (ví dụ: lastMessage thay đổi).

**Payload:**

```json
{
  "conversation": {
    "id": 5,
    "type": "DIRECT",
    "lastMessage": {...},
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `user_typing` - User đang gõ

Emitted khi user bắt đầu/dừng gõ.

**Payload:**

```json
{
  "userId": 2,
  "conversationId": 5,
  "isTyping": true // true khi bắt đầu gõ, false khi dừng
}
```

## Authentication

Tất cả API endpoints yêu cầu JWT authentication. Gửi token qua:

- Cookie: `accessToken_{role}` (tự động)
- Header: `Authorization: Bearer {token}`
- WebSocket: `auth.token` hoặc `query.token` hoặc cookie

## Luồng Frontend (Messenger-like Flow)

### Tổng quan luồng

1. **Khởi tạo WebSocket connection** khi user đăng nhập
2. **Lấy danh sách users/conversations** để hiển thị sidebar
3. **Click vào user** → Tự động get/create conversation
4. **Load messages** của conversation
5. **Gửi/nhận tin nhắn** real-time qua WebSocket
6. **Typing indicators** và read receipts

### Chi tiết từng bước

#### 1. Khởi tạo WebSocket Connection

**Backend đã setup sẵn WebSocket server**, frontend chỉ cần kết nối:

Khi user đăng nhập thành công, kết nối WebSocket:

```typescript
import { io } from 'socket.io-client';

// Kết nối đến WebSocket server (backend đã setup sẵn)
const socket = io('http://localhost:8000/chat', {
  // Gửi JWT token để backend xác thực
  auth: {
    token: 'your_jwt_token', // Lấy từ localStorage hoặc cookie sau khi login
  },
  // Hoặc có thể dùng query parameter
  // query: {
  //   token: 'your_jwt_token',
  // },
  // Hoặc backend sẽ tự động đọc từ cookie `accessToken_{role}`
  withCredentials: true, // Để gửi cookie
});

// Backend tự động xác thực và emit 'connected' event
socket.on('connected', (data) => {
  console.log('Connected to chat server', data);
  // data: { userId: number, message: string }
});

// Lắng nghe tin nhắn mới (backend tự động emit khi có tin nhắn)
socket.on('new_message', (message) => {
  // Backend đã tự động emit event này khi có tin nhắn mới
  // message: { id, content, senderId, conversationId, createdAt, ... }
  addMessageToUI(message);
});

// Lắng nghe typing indicator (backend tự động emit)
socket.on('user_typing', (data) => {
  // data: { userId, conversationId, isTyping }
  showTypingIndicator(data.userId, data.conversationId);
});

// Lắng nghe khi tin nhắn được gửi thành công
socket.on('message_sent', (message) => {
  // Backend emit event này cho sender
  addMessageToUI(message);
});

// Xử lý lỗi kết nối
socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
  // Có thể là do token không hợp lệ hoặc hết hạn
});
```

**Lưu ý:**

- Backend tự động xác thực JWT token khi client connect
- Nếu token không hợp lệ, backend sẽ tự động disconnect client
- Backend tự động track connected users và emit events
- Frontend chỉ cần kết nối và lắng nghe events

#### 2. Lấy danh sách users có thể chat (Sidebar)

Hiển thị danh sách users trong sidebar như Messenger:

```typescript
// GET /api/v1/chat/users
const response = await fetch('/api/v1/chat/users', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const users = await response.json();
// Response:
// [
//   {
//     "id": 2,
//     "name": "StoreOwner 1",
//     "avatar": "https://...",
//     "email": "storeowner1@example.com",
//     "role": "STOREOWNER",
//     "conversationId": 5  // null nếu chưa có conversation
//   },
//   {
//     "id": 3,
//     "name": "Admin 2",
//     "avatar": "https://...",
//     "email": "admin2@example.com",
//     "role": "ADMIN",
//     "conversationId": null
//   }
// ]

// Hiển thị trong sidebar
users.forEach((user) => {
  renderUserInSidebar(user);
});
```

**Lưu ý:** `conversationId` cho biết đã có conversation với user đó hay chưa. Nếu `null` thì chưa có, click vào sẽ tự động tạo mới.

#### 3. Click vào user để mở chat

Khi user click vào một user trong sidebar:

```typescript
async function openChatWithUser(targetUserId: number) {
  // GET /api/v1/chat/conversations/with/:userId
  // Endpoint này tự động:
  // - Tìm conversation đã có → trả về
  // - Chưa có → tạo mới → trả về
  const response = await fetch(
    `/api/v1/chat/conversations/with/${targetUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const conversation = await response.json();
  // Response:
  // {
  //   "id": 5,
  //   "type": "DIRECT",
  //   "members": [
  //     {
  //       "user": {
  //         "id": 1,
  //         "name": "Admin 1",
  //         "avatar": "...",
  //         "email": "...",
  //         "role": "ADMIN"
  //       }
  //     },
  //     {
  //       "user": {
  //         "id": 2,
  //         "name": "StoreOwner 1",
  //         "avatar": "...",
  //         "email": "...",
  //         "role": "STOREOWNER"
  //       }
  //     }
  //   ],
  //   "lastMessage": { ... },
  //   "createdAt": "...",
  //   "updatedAt": "..."
  // }

  // Lưu conversation hiện tại
  currentConversation = conversation;

  // Join WebSocket room để nhận tin nhắn real-time
  socket.emit('join_conversation', { conversationId: conversation.id });

  // Load messages
  await loadMessages(conversation.id);
}
```

#### 4. Load messages của conversation

```typescript
async function loadMessages(conversationId: number, page = 1, limit = 50) {
  // GET /api/v1/chat/conversations/:id/messages?page=1&limit=50
  const response = await fetch(
    `/api/v1/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();
  // Response:
  // {
  //   "data": [
  //     {
  //       "id": 1,
  //       "content": "Hello!",
  //       "senderId": 2,
  //       "sender": { ... },
  //       "createdAt": "...",
  //       "readBy": [ ... ]
  //     },
  //     ...
  //   ],
  //   "meta": {
  //     "page": 1,
  //     "limit": 50,
  //     "total": 100
  //   }
  // }

  // Hiển thị messages trong chat window
  displayMessages(data.data);

  // Nếu có nhiều messages, có thể implement infinite scroll
  if (data.meta.total > page * limit) {
    // Load more khi scroll lên
  }
}
```

#### 5. Gửi tin nhắn

Có 2 cách gửi tin nhắn:

**Cách 1: Qua WebSocket (khuyến nghị - real-time hơn)**

```typescript
function sendMessage(conversationId: number, content: string) {
  // Emit qua WebSocket
  socket.emit('send_message', {
    conversationId,
    content,
  });

  // Lắng nghe confirmation
  socket.once('message_sent', (message) => {
    // Tin nhắn đã được gửi thành công
    // Có thể hiển thị trong UI ngay lập tức (optimistic update)
    addMessageToUI(message);
  });
}
```

**Cách 2: Qua REST API**

```typescript
async function sendMessage(conversationId: number, content: string) {
  const response = await fetch('/api/v1/chat/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId,
      content,
    }),
  });

  const message = await response.json();
  // Tin nhắn sẽ tự động được emit qua WebSocket cho các user khác
  // Nhưng sender cũng sẽ nhận được qua WebSocket event 'message_sent'
}
```

#### 6. Nhận tin nhắn real-time

```typescript
// Đã setup ở bước 1
socket.on('new_message', (message) => {
  // Kiểm tra xem message có thuộc conversation đang mở không
  if (message.conversationId === currentConversation?.id) {
    // Hiển thị tin nhắn mới trong chat window
    addMessageToUI(message);

    // Scroll xuống cuối
    scrollToBottom();
  } else {
    // Hiển thị notification badge trên conversation trong sidebar
    showUnreadBadge(message.conversationId);
  }
});
```

#### 7. Typing Indicators

```typescript
let typingTimeout: NodeJS.Timeout;

// Khi user bắt đầu gõ
function onInputChange(conversationId: number) {
  // Emit typing_start
  socket.emit('typing_start', { conversationId });

  // Clear timeout cũ
  clearTimeout(typingTimeout);

  // Sau 3 giây không gõ thì emit typing_stop
  typingTimeout = setTimeout(() => {
    socket.emit('typing_stop', { conversationId });
  }, 3000);
}

// Khi user dừng gõ (blur, submit)
function onInputBlur(conversationId: number) {
  clearTimeout(typingTimeout);
  socket.emit('typing_stop', { conversationId });
}

// Lắng nghe typing từ user khác
socket.on('user_typing', (data) => {
  // data: { userId, conversationId, isTyping }
  if (data.conversationId === currentConversation?.id) {
    if (data.isTyping) {
      showTypingIndicator(data.userId);
    } else {
      hideTypingIndicator(data.userId);
    }
  }
});
```

#### 8. Read Receipts

```typescript
// Khi user xem conversation, mark messages as read
async function markAsRead(conversationId: number) {
  // Backend tự động mark as read khi:
  // - User join conversation room
  // - User load messages
  // - User gửi tin nhắn trong conversation
  // Có thể gọi API để đảm bảo:
  // GET /api/v1/chat/conversations/:id/messages
  // (Backend tự động mark as read khi load messages)
}
```

#### 9. Đăng ký Web Push Notifications

```typescript
// Khi user cho phép notifications
async function subscribePushNotifications() {
  // Lấy VAPID public key từ backend (có thể lưu trong env)
  const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';

  // Đăng ký với browser
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  // Gửi subscription lên server
  const response = await fetch('/api/v1/chat/push/subscribe', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth')),
      platform: 'WEB',
    }),
  });
}

// Helper functions
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}
```

### Tóm tắt luồng hoàn chỉnh

```
1. User đăng nhập
   ↓
2. Kết nối WebSocket + Lắng nghe events
   ↓
3. Load danh sách users (GET /api/v1/chat/users)
   ↓
4. User click vào một user trong sidebar
   ↓
5. Get/Create conversation (GET /api/v1/chat/conversations/with/:userId)
   ↓
6. Join WebSocket room (socket.emit('join_conversation'))
   ↓
7. Load messages (GET /api/v1/chat/conversations/:id/messages)
   ↓
8. User gõ tin nhắn → Emit typing_start
   ↓
9. User gửi tin nhắn → socket.emit('send_message')
   ↓
10. Nhận tin nhắn mới → socket.on('new_message')
   ↓
11. (Optional) Đăng ký push notifications
```

### Ví dụ sử dụng REST API

**Gửi tin nhắn qua REST:**

```typescript
POST /api/v1/chat/messages
{
  "conversationId": 5,
  "content": "Xin chào!"
}
```

### Đăng ký push notification (Web)

```typescript
POST /api/v1/chat/push/subscribe
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "p256dh": "...",
  "auth": "...",
  "platform": "WEB"
}
```

**Lưu ý:**

- `p256dh` và `auth` là bắt buộc cho Web Push
- `endpoint` là URL từ browser push subscription API
- Chỉ hỗ trợ platform `WEB`

## Cấu trúc Database

- `Conversation` - Cuộc trò chuyện
- `ConversationMember` - Thành viên trong conversation
- `Message` - Tin nhắn
- `MessageRead` - Trạng thái đã đọc
- `PushSubscription` - Đăng ký push notification

## Lưu ý quan trọng

1. **Web Push VAPID Keys:**
   - Tạo bằng lệnh: `npx web-push generate-vapid-keys`
   - `VAPID_PUBLIC_KEY`: Công khai, được gửi đến browser khi đăng ký push
   - `VAPID_PRIVATE_KEY`: Bảo mật, dùng để ký push notifications (không được tiết lộ)
   - `VAPID_SUBJECT`: Email hoặc URL của server (ví dụ: `mailto:admin@example.com`)

2. **WebSocket Authentication:**
   - Tự động xác thực qua JWT token khi client connect
   - Token có thể gửi qua `auth.token`, `query.token`, hoặc cookie
   - Nếu token không hợp lệ, client sẽ bị disconnect

3. **Hạn chế:**
   - Hệ thống chỉ hỗ trợ chat text, chưa hỗ trợ upload file
   - Chỉ hỗ trợ Web Push, không hỗ trợ mobile push notifications
   - Chỉ hỗ trợ chat 1-1 (DIRECT), chưa hỗ trợ group chat

4. **Pagination:**
   - Messages và Conversations hỗ trợ pagination
   - Mặc định: Messages (limit: 50), Conversations (limit: 20)
   - Response format: `{ data: [...], meta: { page, limit, total, totalPages } }`

5. **Read Receipts:**
   - Tự động mark as read khi:
     - User join conversation room
     - User load messages
     - User gửi tin nhắn trong conversation

6. **Real-time Updates:**
   - Tất cả tin nhắn mới được emit qua WebSocket tự động
   - Không cần polling để check tin nhắn mới
   - Typing indicators được emit real-time

## Swagger Documentation

API documentation có sẵn tại: `http://localhost:8000/api` (Swagger UI)

Tại đây bạn có thể:

- Xem tất cả endpoints
- Test API trực tiếp
- Xem request/response schemas
