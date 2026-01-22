# API Documentation - Chain Store Management System (Backend)

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 1. ADMIN - Rental Management

### 1.1 List All Rentals

**Endpoint:** `GET /rentals`  
**Auth:** Admin only  
**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by rental code

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "code": "RENTAL_001",
      "owner": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "area": {
        "id": 1,
        "code": "A101",
        "floor": {
          "level": 1
        }
      },
      "store": {
        "id": 1,
        "name": "Royal Tea"
      },
      "startDate": "2025-02-01T00:00:00Z",
      "endDate": "2025-12-31T00:00:00Z",
      "rentalFee": 25000000,
      "environmentFee": 1000000,
      "securityFee": 500000,
      "paymentCycle": "YEARLY",
      "admin": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "status": "ACTIVE",
      "contractFile": "contract.pdf",
      "createdAt": "2025-01-20T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

### 1.2 Get Rental Detail

**Endpoint:** `GET /rentals/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Rental ID

**Response:**

```json
{
  "id": 1,
  "code": "RENTAL_001",
  "owner": { ... },
  "area": { ... },
  "store": { ... },
  "startDate": "2025-02-01T00:00:00Z",
  "endDate": "2025-12-31T00:00:00Z",
  "status": "ACTIVE",
  "contractFile": "contract.pdf",
  "createdAt": "2025-01-20T10:30:00Z"
}
```

---

### 1.3 Update Rental

**Endpoint:** `PATCH /rentals/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Rental ID

**Request Body:**

```json
{
  "startDate": "2025-02-01",
  "endDate": "2025-12-31",
  "status": "ACTIVE",
  "contractFile": "contract.pdf",
  "areaId": 1
}
```

**Response:** Updated rental object

---

### 1.4 Send Invoice (Create StoreInvoice)

**Endpoint:** `PATCH /rentals/:id/send-invoice`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Rental ID

**Response:**

```json
{
  "message": "Gửi hóa đơn thành công",
  "invoice": {
    "id": 5,
    "storeId": 1,
    "invoiceCode": "INV-1705747200000",
    "monthYear": "2025-01-20T10:30:00Z",
    "contractFee": 26500000,
    "electricityFee": null,
    "waterFee": null,
    "totalAmount": 26500000,
    "status": "DEBIT",
    "dueDate": "2025-03-20T10:30:00Z",
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

---

## 2. ADMIN - Facility Management

### 2.1 Create Facility

**Endpoint:** `POST /admin/facilities`  
**Auth:** Admin only

**Request Body:**

```json
{
  "name": "Air Conditioner",
  "areaId": 1,
  "price": 5000000,
  "note": "New AC system"
}
```

**Response:**

```json
{
  "message": "Tạo cơ sở vật chất thành công",
  "facility": {
    "id": 1,
    "name": "Air Conditioner",
    "areaId": 1,
    "status": "ACTIVE",
    "price": 5000000,
    "note": "New AC system",
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

**Note:** Automatically logs to PaymentHistory with:

- `note`: "Tạo cơ sở vật chất: {name}"
- `amount`: price
- `direction`: OUT

---

### 2.2 List Facilities

**Endpoint:** `GET /admin/facilities`  
**Auth:** Admin only  
**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `areaId` (optional) - Filter by area

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Air Conditioner",
      "areaId": 1,
      "area": {
        "id": 1,
        "code": "A101",
        "floor": {
          "level": 1
        }
      },
      "status": "ACTIVE",
      "price": 5000000,
      "note": "New AC system",
      "createdAt": "2025-01-20T10:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### 2.3 Get Facility Detail

**Endpoint:** `GET /admin/facilities/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Facility ID

**Response:**

```json
{
  "id": 1,
  "name": "Air Conditioner",
  "areaId": 1,
  "area": {
    "id": 1,
    "code": "A101",
    "acreage": 100,
    "floor": {
      "level": 1
    }
  },
  "status": "ACTIVE",
  "price": 5000000,
  "note": "New AC system",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

---

### 2.4 Update Facility

**Endpoint:** `PATCH /admin/facilities/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Facility ID

**Request Body:**

```json
{
  "name": "Air Conditioner System",
  "status": "MAINTENANCE",
  "price": 6000000,
  "note": "Under maintenance"
}
```

**Response:**

```json
{
  "message": "Cập nhật cơ sở vật chất thành công",
  "facility": {
    "id": 1,
    "name": "Air Conditioner System",
    "status": "MAINTENANCE",
    "price": 6000000,
    "note": "Under maintenance"
  }
}
```

**Note:** When status is changed, logs to PaymentHistory:

- `note`: "Sửa {status.toLowerCase()} cho cơ sở vật chất"
- `amount`: price
- `direction`: OUT

---

### 2.5 Delete Facility

**Endpoint:** `DELETE /admin/facilities/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Facility ID

**Response:**

```json
{
  "message": "Xóa cơ sở vật chất thành công"
}
```

---

## 3. ADMIN - Mall Staff Management

### 3.1 Create Mall Staff

**Endpoint:** `POST /admin/mall-staff`  
**Auth:** Admin only

**Request Body:**

```json
{
  "position": "Manager",
  "salary": 50000000,
  "phone": "0123456789",
  "email": "staff@example.com",
  "birth": "1990-01-15",
  "gender": "Male"
}
```

**Response:**

```json
{
  "message": "Tạo nhân sự thành công",
  "staff": {
    "id": 1,
    "position": "Manager",
    "salary": 50000000,
    "phone": "0123456789",
    "email": "staff@example.com",
    "birth": "1990-01-15T00:00:00Z",
    "gender": "Male",
    "isActive": true,
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

---

### 3.2 List All Mall Staff

**Endpoint:** `GET /admin/mall-staff`  
**Auth:** Admin only  
**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "position": "Manager",
      "salary": 50000000,
      "phone": "0123456789",
      "email": "staff@example.com",
      "birth": "1990-01-15T00:00:00Z",
      "gender": "Male",
      "isActive": true,
      "createdAt": "2025-01-20T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### 3.3 Get Mall Staff Detail

**Endpoint:** `GET /admin/mall-staff/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Staff ID

**Response:**

```json
{
  "id": 1,
  "position": "Manager",
  "salary": 50000000,
  "phone": "0123456789",
  "email": "staff@example.com",
  "birth": "1990-01-15T00:00:00Z",
  "gender": "Male",
  "isActive": true,
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

---

### 3.4 Update Mall Staff

**Endpoint:** `PATCH /admin/mall-staff/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Staff ID

**Request Body:**

```json
{
  "position": "Senior Manager",
  "salary": 60000000,
  "phone": "0123456789",
  "email": "staff@example.com",
  "birth": "1990-01-15",
  "gender": "Male",
  "isActive": true
}
```

**Response:** Updated staff object

---

### 3.5 Delete Mall Staff

**Endpoint:** `DELETE /admin/mall-staff/:id`  
**Auth:** Admin only  
**Parameters:**

- `id` (path) - Staff ID

**Response:**

```json
{
  "message": "Xóa nhân sự thành công"
}
```

---

### 3.6 Salary Settlement

**Endpoint:** `POST /admin/mall-staff/salary-settlement`  
**Auth:** Admin only

**Request Body:**

```json
{
  "note": "January salary settlement"
}
```

**Response:**

```json
{
  "message": "Quyết toán lương thành công",
  "result": {
    "totalAmount": 1250000000,
    "staffCount": 25,
    "note": "January salary settlement"
  }
}
```

**Note:** Creates PaymentHistory entry for each active staff member:

- `note`: Provided note
- `amount`: Staff salary
- `direction`: OUT

---

### 3.7 Get Total Salary Information

**Endpoint:** `GET /admin/mall-staff/total-salary-info/all`  
**Auth:** Admin only

**Response:**

```json
{
  "totalSalary": 1250000000,
  "staffCount": 25
}
```

---

## 4. STORE OWNER - Invoice Management

### 4.1 List Store Invoices

**Endpoint:** `GET /store-owner/invoices/:storeId`  
**Auth:** Store Owner only  
**Parameters:**

- `storeId` (path) - Store ID

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "invoiceCode": "INV-1705747200000",
      "monthYear": "2025-01-20T10:30:00Z",
      "contractFee": 26500000,
      "electricityFee": 500000,
      "waterFee": 200000,
      "totalAmount": 27200000,
      "status": "DEBIT",
      "dueDate": "2025-03-20T10:30:00Z",
      "createdAt": "2025-01-20T10:30:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### 4.2 Get Invoice Detail

**Endpoint:** `GET /store-owner/invoices/:storeId/:invoiceId/detail`  
**Auth:** Store Owner only  
**Parameters:**

- `storeId` (path) - Store ID
- `invoiceId` (path) - Invoice ID

**Response:**

```json
{
  "id": 1,
  "storeId": 1,
  "invoiceCode": "INV-1705747200000",
  "monthYear": "2025-01-20T10:30:00Z",
  "contractFee": 26500000,
  "electricityFee": 500000,
  "waterFee": 200000,
  "totalAmount": 27200000,
  "status": "DEBIT",
  "dueDate": "2025-03-20T10:30:00Z",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z",
  "store": {
    "id": 1,
    "name": "Royal Tea",
    "type": "F&B"
  }
}
```

---

### 4.3 Pay Invoice (Change Status DEBIT → PAID)

**Endpoint:** `PATCH /store-owner/invoices/:storeId/:invoiceId/pay`  
**Auth:** Store Owner only  
**Parameters:**

- `storeId` (path) - Store ID
- `invoiceId` (path) - Invoice ID

**Response:**

```json
{
  "message": "Thanh toán hóa đơn thành công",
  "invoice": {
    "id": 1,
    "invoiceCode": "INV-1705747200000",
    "status": "PAID",
    "totalAmount": 27200000,
    "updatedAt": "2025-01-20T11:00:00Z"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền truy cập resource này",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy resource",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Không thể xử lý yêu cầu",
  "error": "Internal Server Error"
}
```

---

## Common Status Values

### PaymentStatus

- `PAID` - Invoice has been paid
- `DEBIT` - Invoice is unpaid/pending

### FacilityStatus

- `ACTIVE` - Facility is operational
- `MAINTENANCE` - Facility is under maintenance
- `BROKEN` - Facility is broken/inoperable

### RentalStatus

- `ACTIVE` - Rental contract is active
- `INACTIVE` - Rental contract is inactive
- `EXPIRED` - Rental contract has expired

### PaymentCycle

- `YEARLY` - Annual payment cycle
- `ONETIME` - One-time payment

---

## Notes for Frontend Development

1. **Authentication:**
   - Store JWT token in localStorage or sessionStorage
   - Include token in all API requests
   - Handle token expiration and refresh flows

2. **Pagination:**
   - Default page is 1, default limit is 10
   - Response includes `total`, `page`, `limit`, and `totalPages`

3. **Date Handling:**
   - All dates are in ISO 8601 format (UTC)
   - Handle timezone conversion on frontend as needed

4. **Payment History:**
   - Automatically logged for:
     - Facility creation
     - Facility status changes
     - Salary settlement

5. **Authorization:**
   - Admin: Full access to all admin endpoints
   - Store Owner: Access to store-specific invoice endpoints only
   - Store Staff: Limited access based on store role

---

## Example API Calls

### Using cURL

**Create a Facility:**

```bash
curl -X POST http://localhost:3000/api/admin/facilities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Air Conditioner",
    "areaId": 1,
    "price": 5000000,
    "note": "New AC system"
  }'
```

**List Rentals:**

```bash
curl -X GET "http://localhost:3000/api/rentals?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Pay Invoice:**

```bash
curl -X PATCH http://localhost:3000/api/store-owner/invoices/1/1/pay \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Version Information

- **API Version:** 1.0
- **Last Updated:** January 22, 2026
- **Supported Frameworks:** NestJS
- **Database:** PostgreSQL with Prisma ORM
