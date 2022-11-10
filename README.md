# Based on:
# React SPA with TS, node and Surreal DB

This is a basic proyect template for a react single page application 
using node and typescript as backend and Surreal DB as database

## Installation

```bash
git clone https://github.com/Martoxdlol/react_spa_ts_node_surrealdb_template

cd react_spa_ts_node_surrealdb_template

npm install

npm run dev

# open http://localhost:3300
```

## Structure

### **./frontend**
React app using **[parceljs](https://parceljs.org/)** (much faster than create-react-app).

It´s using a [react-router-history-pro](https://www.npmjs.com/package/react-router-history-pro) as router. You can replace it if you want.

### **./server**
Backend using typescript and ts-node
It handle basic oauth authentication and sessions.
Sessions are store in database using custom express-session store.

### ./shared**

This is a package that can bea accessed both in frontend and server that contains configuration and other shared code.

### **Internationalization**

This app can use strings in multiple languages. **./shared/strings/app_strings.ts** stores all app strings (execpt errors).

Errors strings are stored in **./shared/errors/error_strings.ts**

#### **Errors**

There are default error types stored in **./shared/errors/errors.ts**. They are used in frontend and server.

### Database

It´s using [SurrealDB](https://surrealdb.com/) as it's database. It can be changed (**./server/database/database.ts**). 

Note that using npm run dev will start surrealdb with a temporal dev config. SurrealDB must be installed first.

#### **Dev data**

Every time yo run `npm run dev` the database gets resetted. And script stored in **./server/dev_data/initialize_dev_database.ts** gets executed

#### **Connect to dev database via terminal**

```bash
npm run connect_db
```