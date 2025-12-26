# Operations Hub Demo

**Operations Hub Demo** is a demonstration version of an internal tool designed to help small and medium businesses manage tasks, requests, and simple orders.  
The project includes a Java/Spring Boot backend, a React/TypeScript frontend, and a PostgreSQL database.

---

## 🚀 Features (MVP)

- CRUD for users (create, delete, view)  
- Demo Tasks module  
- REST API with Swagger documentation  
- Simple frontend page to interact with users

---

## 🛠 Technology Stack

**Backend:**

- Java 21, Spring Boot 3  
- PostgreSQL  
- JPA / Hibernate  
- Spring Web (REST)  
- Flyway for database migrations  

**Frontend:**

- React 18 + TypeScript  
- Vite  
- Axios for API calls  

**Infrastructure:**

- Docker & docker-compose  

---

## 📂 Project Structure

operations-hub-demo/  
├─ operations-hub-backend/   
├─ operations-hub-ui/   
├─ docker-compose.yml   
├─ README.md  
└─ LICENSE

---

## 🔧 Local Development (without Docker)

Clone the repository:

```
git clone https://github.com/your-username/operations-hub-demo.git
cd operations-hub-demo
```

Backend:

```
cd operations-hub-backend  
mvn clean package  
mvn spring-boot:run  
```

Frontend:

```
cd operations-hub-ui
npm install
npm run dev
```

## Access the app:

UI: http://localhost:5173

API: http://localhost:8081/api/users

Swagger: http://localhost:8081/swagger-ui.html