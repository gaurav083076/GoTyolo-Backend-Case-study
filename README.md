# GoTyolo Backend Case Study

REST API for GoTyolo travel platform - Trip discovery, filtering & booking.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| Docker | Containerization |

### Why this stack?

- **Node.js + Express**: Fast development, large ecosystem, excellent for REST APIs
- **MongoDB**: Flexible schema, good for travel data with varying categories
- **Mongoose**: Easy data validation and relationships
- **Docker**: Consistent environment, easy deployment

## Setup & Run Instructions

### Prerequisites

- Docker Desktop installed and running
- Git

### Steps to run

1. Clone the repository:
```bash
git clone https://github.com/gaurav083076/GoTyolo-Backend-Case-study.git
cd GoTyolo-Backend-Case-study
```

2. Start the application:
```bash
docker-compose up --build
```

3. Seed the database (run in new terminal):
```bash
docker exec -it backendcasestudy-app-1 node src/seed/seed.js
```

4. API is now running at: `http://localhost:7777`

### Stop the application

```bash
docker-compose down
```

### Clean up (remove volumes)

```bash
docker-compose down -v
```

## API Documentation

### Base URL

```
http://localhost:7777
```

### Endpoints

#### 1. GET /trips

Fetch list of published trips with filters and sorting.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| destination | string | Filter by destination |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| startDate | date | Trips starting from this date |
| category | string | Category ID |
| sortBy | string | Sort by `price` or `startDate` |
| order | string | `asc` or `desc` |

**Example Request:**
```
GET /trips?destination=ladakh&minPrice=10000&maxPrice=30000&sortBy=price&order=asc
```

**Example Response:**
```json
{
  "trips": [
    {
      "_id": "6963e81c1bdefaf2ba58fe92",
      "title": "Ladakh Bike Trip",
      "destination": "ladakh",
      "startDate": "2025-03-15T00:00:00.000Z",
      "endDate": "2025-03-22T00:00:00.000Z",
      "price": 25000,
      "maxCapacity": 20,
      "availableSeat": 20,
      "status": "Published",
      "categories": ["6963e81c1bdefaf2ba58fe8d"]
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

#### 2. GET /trips/:id

Fetch detailed information about a specific trip.

**Example Request:**
```
GET /trips/6963e81c1bdefaf2ba58fe92
```

**Example Response:**
```json
{
  "_id": "6963e81c1bdefaf2ba58fe92",
  "title": "Ladakh Bike Trip",
  "destination": "ladakh",
  "startDate": "2025-03-15T00:00:00.000Z",
  "endDate": "2025-03-22T00:00:00.000Z",
  "price": 25000,
  "maxCapacity": 20,
  "availableSeat": 20,
  "status": "Published",
  "categories": [
    { "name": "adventure" },
    { "name": "weekend" }
  ]
}
```

**Status Codes:**
- 200: Success
- 400: Invalid trip ID
- 404: Trip not found
- 500: Server error

---

#### 3. POST /trips

Create a new trip.

**Request Body:**
```json
{
  "title": "Goa Beach Trip",
  "destination": "Goa",
  "startDate": "2025-04-10",
  "endDate": "2025-04-15",
  "price": 15000,
  "maxCapacity": 25,
  "availableSeat": 25,
  "status": "Published",
  "categories": ["6963e81c1bdefaf2ba58fe8d"]
}
```

**Example Response:**
```json
{
  "message": "Trip added successfully",
  "data": {
    "_id": "6963f1234bdefaf2ba58fe99",
    "title": "Goa Beach Trip",
    "destination": "goa",
    "startDate": "2025-04-10T00:00:00.000Z",
    "endDate": "2025-04-15T00:00:00.000Z",
    "price": 15000,
    "maxCapacity": 25,
    "availableSeat": 25,
    "status": "Published",
    "categories": ["6963e81c1bdefaf2ba58fe8d"]
  }
}
```

**Validations:**
- End date must be after start date
- Available seats cannot exceed max capacity
- Category IDs must be valid

**Status Codes:**
- 201: Created
- 400: Validation error
- 500: Server error

---

#### 4. POST /trips/:id/book

Book a seat on a trip.

**Example Request:**
```
POST /trips/6963e81c1bdefaf2ba58fe92/book
```

**Example Response (Success):**
```json
{
  "message": "Booking successful",
  "availableSeat": 19
}
```

**Example Response (No seats):**
```json
{
  "message": "No seat available"
}
```

**Business Rules:**
- Only published trips can be booked
- Only future trips can be booked
- Prevents overbooking (atomic operation)

**Status Codes:**
- 200: Booking successful
- 400: Invalid trip ID
- 409: No seats available / Trip not bookable
- 500: Server error

---

### Additional Endpoints (Helper)

#### GET /categories

Fetch all categories.

**Response:**
```json
{
  "categories": [
    { "_id": "6963e81c1bdefaf2ba58fe8d", "name": "adventure" },
    { "_id": "6963e81c1bdefaf2ba58fe8e", "name": "cultural" }
  ]
}
```

#### POST /categories

Create a new category.

**Request Body:**
```json
{
  "name": "Beach"
}
```

## Project Structure

```
Backend Case Study/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── category.js
│   │   └── trip.js
│   ├── routes/
│   │   ├── category.js
│   │   └── trip.js
│   ├── seed/
│   │   └── seed.js
│   └── app.js
├── .env
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Sample Data

The seed script creates:

**Categories:**
- Adventure
- Cultural
- Women-Only
- Weekend
- International

**Trips:**
- Ladakh Bike Trip (Adventure, Weekend)
- Rajasthan Heritage Tour (Cultural)
- Goa Weekend Getaway (Weekend)
- Thailand Trip (International) - Draft
