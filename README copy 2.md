# Finance Module

Module quản lý thanh toán (Payment) với các tính năng:

- **STOREOWNER** tạo payment và lưu vào database
- **Danh sách Payment** với filter theo `PaymentStatus`, `paymentMonth`, `paymentYear`
- **Admin tạo thông báo** → Broadcast qua WebSocket đến tất cả STOREOWNER real-time
- **STOREOWNER nhận thông báo** qua WebSocket và hiển thị form điền payment

## Cài đặt

### 1. Database Migration

Chạy migration để tạo các bảng cần thiết:

```bash
npx prisma migrate dev --name add_finance_module
npx prisma generate
```

## API Endpoints

**Base URL:** `http://localhost:8000/api/v1`

### Payments

#### `POST /api/v1/finance/payments`

STOREOWNER tạo payment

**Request Body:**

```json
{
  "storeId": 1,
  "paymentMonth": 12,
  "paymentYear": 2024,
  "amount": 1000000,
  "owed": 500000,
  "status": "PARTIAL",
  "paidAt": "2024-12-25T00:00:00.000Z"
}
```

**Response 201:**

```json
{
  "id": 1,
  "storeId": 1,
  "paymentMonth": 12,
  "paymentYear": 2024,
  "amount": 1000000,
  "owed": 500000,
  "status": "PARTIAL",
  "paidAt": "2024-12-25T00:00:00.000Z",
  "store": {
    "id": 1,
    "name": "Store 1",
    "type": "RETAIL"
  },
  "createdAt": "2024-12-25T00:00:00.000Z",
  "updatedAt": "2024-12-25T00:00:00.000Z"
}
```

#### `GET /api/v1/finance/payments`

Lấy danh sách payments với filter

**Query Parameters:**

- `status` (optional): `PAID` | `PARTIAL` | `UNPAID`
- `paymentMonth` (optional): 1-12
- `paymentYear` (optional): 2000+
- `storeId` (optional): Store ID (chỉ Admin)
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response 200:**

```json
{
  "data": [
    {
      "id": 1,
      "storeId": 1,
      "paymentMonth": 12,
      "paymentYear": 2024,
      "amount": 1000000,
      "owed": 500000,
      "status": "PARTIAL",
      "paidAt": "2024-12-25T00:00:00.000Z",
      "store": {
        "id": 1,
        "name": "Store 1",
        "type": "RETAIL"
      }
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

### Notifications

#### `POST /api/v1/finance/notifications`

Admin tạo payment notification (tự động broadcast qua WebSocket đến tất cả STOREOWNER)

**Request Body:**

```json
{
  "title": "Yêu cầu thanh toán tháng 12/2024",
  "message": "Vui lòng thanh toán tiền thuê tháng 12/2024",
  "paymentMonth": 12,
  "paymentYear": 2024
}
```

**Response 201:**

```json
{
  "id": 1,
  "title": "Yêu cầu thanh toán tháng 12/2024",
  "message": "Vui lòng thanh toán tiền thuê tháng 12/2024",
  "paymentMonth": 12,
  "paymentYear": 2024,
  "createdBy": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com"
  },
  "createdAt": "2024-12-25T00:00:00.000Z"
}
```

## WebSocket Events

**WebSocket URL:** `http://localhost:8000/finance`

### Client Events

Không có client events (chỉ lắng nghe)

### Server Events

#### `connected` - Kết nối thành công

```json
{
  "userId": 1,
  "role": "STOREOWNER",
  "message": "Connected to finance server"
}
```

#### `payment_notification` - Thông báo payment từ Admin

Emitted khi Admin tạo payment notification → Tất cả STOREOWNER nhận được real-time

**Payload:**

```json
{
  "title": "Yêu cầu thanh toán tháng 12/2024",
  "message": "Vui lòng thanh toán tiền thuê tháng 12/2024",
  "paymentMonth": 12,
  "paymentYear": 2024,
  "notificationId": 1,
  "createdAt": "2024-12-25T00:00:00.000Z"
}
```

## Frontend Integration (React + TanStack Query)

### 1. Setup WebSocket Connection

Tạo hook để kết nối WebSocket:

```typescript
// hooks/useFinanceSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface PaymentNotification {
  title: string;
  message: string;
  paymentMonth: number;
  paymentYear: number;
  notificationId?: number;
  createdAt: string;
}

export function useFinanceSocket(
  token: string,
  onPaymentNotification?: (notification: PaymentNotification) => void,
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Kết nối đến finance WebSocket
    const socket = io("http://localhost:8000/finance", {
      auth: {
        token,
      },
      withCredentials: true,
    });

    socketRef.current = socket;

    // Lắng nghe kết nối thành công
    socket.on("connected", (data) => {
      console.log("Connected to finance server", data);
    });

    // Lắng nghe payment notification từ Admin
    socket.on("payment_notification", (notification: PaymentNotification) => {
      console.log("Payment notification received:", notification);
      onPaymentNotification?.(notification);
    });

    // Xử lý lỗi
    socket.on("connect_error", (error) => {
      console.error("Finance WebSocket connection error:", error);
    });

    // Cleanup khi unmount
    return () => {
      socket.disconnect();
    };
  }, [token, onPaymentNotification]);

  return socketRef.current;
}
```

### 2. TanStack Query Hooks

Tạo custom hooks với TanStack Query:

```typescript
// hooks/useFinance.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaymentStatus } from "@prisma/client";

const API_BASE = "http://localhost:8000/api/v1";

// Types
interface CreatePaymentDto {
  storeId: number;
  paymentMonth: number;
  paymentYear: number;
  amount: number;
  owed: number;
  status: PaymentStatus;
  paidAt: string;
}

interface GetPaymentsParams {
  status?: PaymentStatus;
  paymentMonth?: number;
  paymentYear?: number;
  storeId?: number;
  page?: number;
  limit?: number;
}

interface CreatePaymentNotificationDto {
  title: string;
  message: string;
  paymentMonth: number;
  paymentYear: number;
}

// API functions
async function createPayment(token: string, dto: CreatePaymentDto) {
  const response = await fetch(`${API_BASE}/finance/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create payment");
  }

  return response.json();
}

async function getPayments(token: string, params: GetPaymentsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.status) queryParams.append("status", params.status);
  if (params.paymentMonth)
    queryParams.append("paymentMonth", String(params.paymentMonth));
  if (params.paymentYear)
    queryParams.append("paymentYear", String(params.paymentYear));
  if (params.storeId) queryParams.append("storeId", String(params.storeId));
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));

  const response = await fetch(
    `${API_BASE}/finance/payments?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get payments");
  }

  return response.json();
}

async function createPaymentNotification(
  token: string,
  dto: CreatePaymentNotificationDto,
) {
  const response = await fetch(`${API_BASE}/finance/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create notification");
  }

  return response.json();
}

// React Query Hooks
export function useCreatePayment(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePaymentDto) => createPayment(token, dto),
    onSuccess: () => {
      // Invalidate payments query để refetch
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useGetPayments(token: string, params: GetPaymentsParams = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(token, params),
  });
}

export function useCreatePaymentNotification(token: string) {
  return useMutation({
    mutationFn: (dto: CreatePaymentNotificationDto) =>
      createPaymentNotification(token, dto),
  });
}
```

### 3. Component Examples

#### STOREOWNER - Hiển thị và tạo Payment

```typescript
// components/PaymentForm.tsx
import { useState } from 'react';
import { useCreatePayment, useGetPayments } from '@/hooks/useFinance';
import { PaymentStatus } from '@prisma/client';

interface PaymentFormProps {
  token: string;
  storeId: number;
  paymentMonth: number;
  paymentYear: number;
  onSuccess?: () => void;
}

export function PaymentForm({
  token,
  storeId,
  paymentMonth,
  paymentYear,
  onSuccess,
}: PaymentFormProps) {
  const [amount, setAmount] = useState(0);
  const [owed, setOwed] = useState(0);
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.PARTIAL);
  const [paidAt, setPaidAt] = useState(
    new Date().toISOString().split('T')[0],
  );

  const createPayment = useCreatePayment(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPayment.mutateAsync({
        storeId,
        paymentMonth,
        paymentYear,
        amount,
        owed,
        status,
        paidAt: new Date(paidAt).toISOString(),
      });

      alert('Tạo payment thành công!');
      onSuccess?.();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Số tiền thanh toán:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          min={0}
        />
      </div>

      <div>
        <label>Số tiền còn nợ:</label>
        <input
          type="number"
          value={owed}
          onChange={(e) => setOwed(Number(e.target.value))}
          required
          min={0}
        />
      </div>

      <div>
        <label>Trạng thái:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus)}
        >
          <option value={PaymentStatus.PAID}>Đã thanh toán</option>
          <option value={PaymentStatus.PARTIAL}>Thanh toán một phần</option>
          <option value={PaymentStatus.UNPAID}>Chưa thanh toán</option>
        </select>
      </div>

      <div>
        <label>Ngày thanh toán:</label>
        <input
          type="date"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={createPayment.isPending}>
        {createPayment.isPending ? 'Đang tạo...' : 'Tạo Payment'}
      </button>
    </form>
  );
}
```

#### STOREOWNER - Danh sách Payments với Filter

```typescript
// components/PaymentList.tsx
import { useState } from 'react';
import { useGetPayments } from '@/hooks/useFinance';
import { PaymentStatus } from '@prisma/client';

interface PaymentListProps {
  token: string;
}

export function PaymentList({ token }: PaymentListProps) {
  const [status, setStatus] = useState<PaymentStatus | undefined>();
  const [paymentMonth, setPaymentMonth] = useState<number | undefined>();
  const [paymentYear, setPaymentYear] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetPayments(token, {
    status,
    paymentMonth,
    paymentYear,
    page,
    limit: 20,
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div>
      <h2>Danh sách Payments</h2>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={status || ''}
          onChange={(e) =>
            setStatus(
              e.target.value ? (e.target.value as PaymentStatus) : undefined,
            )
          }
        >
          <option value="">Tất cả trạng thái</option>
          <option value={PaymentStatus.PAID}>Đã thanh toán</option>
          <option value={PaymentStatus.PARTIAL}>Thanh toán một phần</option>
          <option value={PaymentStatus.UNPAID}>Chưa thanh toán</option>
        </select>

        <input
          type="number"
          placeholder="Tháng (1-12)"
          min={1}
          max={12}
          value={paymentMonth || ''}
          onChange={(e) =>
            setPaymentMonth(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        />

        <input
          type="number"
          placeholder="Năm"
          min={2000}
          value={paymentYear || ''}
          onChange={(e) =>
            setPaymentYear(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        />
      </div>

      {/* Payment List */}
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Tháng/Năm</th>
            <th>Số tiền</th>
            <th>Còn nợ</th>
            <th>Trạng thái</th>
            <th>Ngày thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((payment: any) => (
            <tr key={payment.id}>
              <td>{payment.store.name}</td>
              <td>
                {payment.paymentMonth}/{payment.paymentYear}
              </td>
              <td>{payment.amount.toLocaleString()} đ</td>
              <td>{payment.owed.toLocaleString()} đ</td>
              <td>{payment.status}</td>
              <td>{new Date(payment.paidAt).toLocaleDateString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {data && (
        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </button>
          <span>
            Trang {page} / {data.meta.totalPages}
          </span>
          <button
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
```

#### STOREOWNER - Nhận Payment Notification qua WebSocket

```typescript
// components/PaymentNotificationHandler.tsx
import { useState, useEffect } from 'react';
import { useFinanceSocket } from '@/hooks/useFinanceSocket';
import { PaymentForm } from './PaymentForm';

interface PaymentNotification {
  title: string;
  message: string;
  paymentMonth: number;
  paymentYear: number;
  notificationId?: number;
  createdAt: string;
}

interface PaymentNotificationHandlerProps {
  token: string;
  storeId: number;
}

export function PaymentNotificationHandler({
  token,
  storeId,
}: PaymentNotificationHandlerProps) {
  const [notification, setNotification] =
    useState<PaymentNotification | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Kết nối WebSocket và lắng nghe notifications
  useFinanceSocket(token, (notification) => {
    // Hiển thị notification
    setNotification(notification);
    setShowForm(true);

    // Có thể hiển thị toast/alert
    alert(
      `${notification.title}\n${notification.message}\nTháng: ${notification.paymentMonth}/${notification.paymentYear}`,
    );
  });

  return (
    <div>
      {/* Hiển thị notification nếu có */}
      {notification && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f0f0f0',
            marginBottom: '16px',
            borderRadius: '8px',
          }}
        >
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <p>
            Tháng/Năm: {notification.paymentMonth}/{notification.paymentYear}
          </p>
          <button onClick={() => setShowForm(true)}>
            Điền form thanh toán
          </button>
        </div>
      )}

      {/* Hiển thị form khi user click */}
      {showForm && notification && (
        <div>
          <h3>Form thanh toán</h3>
          <PaymentForm
            token={token}
            storeId={storeId}
            paymentMonth={notification.paymentMonth}
            paymentYear={notification.paymentYear}
            onSuccess={() => {
              setShowForm(false);
              setNotification(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
```

#### ADMIN - Tạo Payment Notification

```typescript
// components/CreatePaymentNotification.tsx
import { useState } from 'react';
import { useCreatePaymentNotification } from '@/hooks/useFinance';

interface CreatePaymentNotificationProps {
  token: string;
}

export function CreatePaymentNotification({
  token,
}: CreatePaymentNotificationProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMonth, setPaymentMonth] = useState(12);
  const [paymentYear, setPaymentYear] = useState(2024);

  const createNotification = useCreatePaymentNotification(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createNotification.mutateAsync({
        title,
        message,
        paymentMonth,
        paymentYear,
      });

      alert('Đã tạo thông báo và gửi đến tất cả STOREOWNER!');
      // Reset form
      setTitle('');
      setMessage('');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tạo Payment Notification</h2>

      <div>
        <label>Tiêu đề:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Yêu cầu thanh toán tháng 12/2024"
        />
      </div>

      <div>
        <label>Nội dung:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Vui lòng thanh toán tiền thuê tháng 12/2024"
        />
      </div>

      <div>
        <label>Tháng:</label>
        <input
          type="number"
          min={1}
          max={12}
          value={paymentMonth}
          onChange={(e) => setPaymentMonth(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Năm:</label>
        <input
          type="number"
          min={2000}
          value={paymentYear}
          onChange={(e) => setPaymentYear(Number(e.target.value))}
          required
        />
      </div>

      <button type="submit" disabled={createNotification.isPending}>
        {createNotification.isPending
          ? 'Đang tạo...'
          : 'Tạo thông báo (Gửi đến tất cả STOREOWNER)'}
      </button>
    </form>
  );
}
```

### 4. Complete Example - STOREOWNER Dashboard

```typescript
// pages/StoreOwnerDashboard.tsx
import { useState } from 'react';
import { useGetPayments } from '@/hooks/useFinance';
import { useFinanceSocket } from '@/hooks/useFinanceSocket';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentList } from '@/components/PaymentList';

export function StoreOwnerDashboard() {
  const token = localStorage.getItem('token') || '';
  const storeId = 1; // Lấy từ user context hoặc props

  const [notification, setNotification] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Lắng nghe payment notifications từ Admin
  useFinanceSocket(token, (notification) => {
    setNotification(notification);
    // Tự động mở form khi nhận được notification
    setShowPaymentForm(true);
  });

  return (
    <div>
      <h1>Dashboard - STOREOWNER</h1>

      {/* Hiển thị notification nếu có */}
      {notification && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h3>🔔 {notification.title}</h3>
          <p>{notification.message}</p>
          <p>
            <strong>Tháng/Năm:</strong> {notification.paymentMonth}/
            {notification.paymentYear}
          </p>
          <button onClick={() => setShowPaymentForm(true)}>
            Điền form thanh toán ngay
          </button>
        </div>
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <div>
          <h2>Form thanh toán</h2>
          <PaymentForm
            token={token}
            storeId={storeId}
            paymentMonth={notification?.paymentMonth || new Date().getMonth() + 1}
            paymentYear={notification?.paymentYear || new Date().getFullYear()}
            onSuccess={() => {
              setShowPaymentForm(false);
              setNotification(null);
            }}
          />
        </div>
      )}

      {/* Payment List */}
      <PaymentList token={token} />
    </div>
  );
}
```

### 5. Complete Example - ADMIN Dashboard

```typescript
// pages/AdminDashboard.tsx
import { CreatePaymentNotification } from '@/components/CreatePaymentNotification';
import { PaymentList } from '@/components/PaymentList';

export function AdminDashboard() {
  const token = localStorage.getItem('token') || '';

  return (
    <div>
      <h1>Dashboard - ADMIN</h1>

      {/* Tạo Payment Notification */}
      <div style={{ marginBottom: '40px' }}>
        <CreatePaymentNotification token={token} />
      </div>

      {/* Danh sách Payments (Admin có thể xem tất cả) */}
      <PaymentList token={token} />
    </div>
  );
}
```

## Luồng hoạt động

### STOREOWNER Flow:

1. **Kết nối WebSocket** khi vào dashboard
2. **Lắng nghe `payment_notification`** event
3. **Nhận notification từ Admin** → Hiển thị thông báo với `paymentMonth` và `paymentYear`
4. **Click vào thông báo** → Mở form điền payment
5. **Điền form** với thông tin payment
6. **Submit** → Tạo payment qua API
7. **Xem danh sách payments** với filter

### ADMIN Flow:

1. **Tạo payment notification** qua form
2. **Backend tự động:**
   - Lưu notification vào DB
   - Broadcast qua WebSocket đến tất cả STOREOWNER đang online
3. **STOREOWNER nhận được** notification real-time
4. **Xem danh sách payments** của tất cả stores (có thể filter)

## Lưu ý

1. **WebSocket Connection:**
   - STOREOWNER tự động join room `storeowners` khi connect
   - Admin tự động join room `admins` khi connect
   - Notification chỉ được broadcast đến STOREOWNER

2. **Payment Validation:**
   - Mỗi store chỉ có thể tạo 1 payment cho mỗi tháng/năm
   - STOREOWNER chỉ có thể tạo payment cho stores mình sở hữu

3. **Filter Payments:**
   - STOREOWNER: Chỉ xem payments của stores mình sở hữu
   - ADMIN: Xem tất cả payments (có thể filter theo storeId)

4. **Real-time Notifications:**
   - Notification được broadcast ngay khi Admin tạo
   - STOREOWNER offline sẽ không nhận được (có thể implement queue sau)
