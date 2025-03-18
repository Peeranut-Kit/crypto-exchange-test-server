# crypto_exchange_test_server

# ER Diagram
https://drive.google.com/file/d/1ioOqhNdYQzOG6IUY8hjC6_xTc6LC7btn/view?usp=sharing

# Project
This project is developed by using ExpressJS library with MongoDB and Mongoose

## Setup Project and Run
1. ```git clone https://github.com/Peeranut-Kit/crypto_exchange_test_server.git```

2. ```cd crypto_exchange_test_server```

3. ```npm install```

4. ```docker-compose up -d```

5. ```node seed.js (seed ข้อมูล เพื่อใช้ในการทดสอบ)```

## API Endpoints
### User
POST /api/v1/users/register
Register a new user.

POST /api/v1/users/login
Login an existing user.

GET /api/v1/users/me
Get the details of the logged-in user. (Protected route)

GET /api/v1/users/logout
Logout the current user. (Protected route)

### Currency
GET /api/v1/currency
Get all available currencies.

POST /api/v1/currency
Add a new currency.

### Wallets
GET /api/v1/wallets
Get all wallets of the logged-in user. (Protected route)

POST /api/v1/wallets
Add a new wallet for the logged-in user. (Protected route)

### Orders
GET /api/v1/orders
Get all orders of the logged-in user. (Protected route)

POST /api/v1/orders
Create a new order. (Protected route)

### Transactions
GET /api/v1/transactions
Get all transactions for the logged-in user. (Protected route)

POST /api/v1/transactions
Create a new transaction. (Protected route)


Each of these endpoints has different methods and access control based on user authentication and authorization. Make sure to use proper credentials when accessing protected routes.
