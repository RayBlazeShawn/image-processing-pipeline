# **Image Processing Pipeline**

## **Project Overview**

This project is a backend system designed to process images asynchronously from a CSV file. It handles the complete workflow from file upload, image processing, and status tracking, to storing and managing processed images. The system is built using Node.js, Express, MongoDB, Redis, Bull, and Sharp, making it a robust solution for handling large volumes of image processing tasks.

## **Features**

- **CSV File Upload:** Upload a CSV file containing product details and image URLs.
- **Asynchronous Image Processing:** Efficiently processes images using a worker-based architecture with Bull and Redis.
- **Status Tracking:** Track the processing status of each request, with statuses updated from "Processing" to "Processed" once all images are handled.
- **Error Handling:** Robust error handling ensures that issues like duplicate requests or failed image processing are managed gracefully.

## **Technologies Used**

- **Node.js & Express:** Backend framework and server.
- **MongoDB:** Database to store request information, including image URLs and processing status.
- **Redis & Bull:** Queue management system for handling asynchronous image processing jobs.
- **Sharp:** Image processing library for resizing and compressing images.
- **Multer:** Middleware for handling file uploads.

## **Project Structure**

```plaintext
├── app.js                   # Main server file
├── controllers
│   └── uploadController.js  # Handles CSV upload and initiates image processing
├── middlewares
│   └── errorHandler.js      # Custom error handling middleware
├── models
│   └── requestModel.js      # MongoDB model for storing request and image information
├── queues
│   ├── imageQueue.js        # Bull queue setup for image processing jobs
│   └── imageWorker.js       # Worker script that processes images from the queue
├── routes
│   ├── statusRoutes.js      # API routes for checking the status of a request
│   └── uploadRoutes.js      # API routes for uploading the CSV file
├── services
│   └── imageProcessor.js    # Handles image downloading, processing, and saving
└── utils
    └── asyncHandler.js      # Utility to handle async operations in Express routes
```

## **Getting Started**

### **Prerequisites**

- **Node.js:** v18.17.0 or higher
- **MongoDB:** Connection string to your MongoDB instance
- **Redis:** Installed and running locally or on a server

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RayBlazeShawn/image-processing-pipeline.git
   cd image-processing-pipeline
   
2. Install dependencies:

    ```bash
    npm install
    ```

3.  Set up MongoDB:

Before running the application, update the MongoDB connection string in `app.js` and `queues/imageWorker.js` with your own MongoDB connection details:

```javascript
mongoose.connect('your-mongodb-connection-string-here');
```

4. Start Redis using Docker:

    ```bash
    docker run --name redis -p 6379:6379 -d redis
    ```

5. Run the application::

    ```bash
    npm start
    ```

6. Run the worker separately:

    ```bash
    node queues/imageWorker.js
    ```

### Postman Collection

To make it easier to test the API, you can import the provided Postman collection:

1. Download the Postman collection JSON file from [this link](https://drive.google.com/file/d/1h50xpLcAqudIep7pPz4dW1TgO45AewAk/view?usp=drive_link).

2. Open Postman, and click on the `Import` button in the upper left corner.

3. Select the `Choose Files` option and import the downloaded JSON file.

4. Once imported, you will see the collection named "Image Processing Pipeline" in your Postman collections with the following folder structure:

    - **Upload**
        - POST uploadCSV
    - **Status**
        - GET checkStatus
### Redis Setup with Docker

To run Redis using Docker, follow these steps:

1. **Pull the Redis image from Docker Hub:**

   If you haven't already pulled the Redis image, do so with the following command:

    ```bash
    docker pull redis
    ```

2. **Run the Redis container:**

   Start a Redis container named `redis` using the following command. This will run Redis in detached mode (`-d`) and map the container’s port 6379 to your local machine’s port 6379:

    ```bash
    docker run --name redis -p 6379:6379 -d redis
    ```

3. **Verify that the Redis container is running:**

   Use the following command to check that your Redis container is up and running:

    ```bash
    docker ps
    ```

   You should see an entry with `redis` in the `NAMES` column and a status indicating that it’s up.

4. **Access Redis CLI (Optional):**

   If you need to interact with Redis directly via the command line, you can access the Redis CLI inside the running container:

    ```bash
    docker exec -it redis redis-cli
    ```

   This will start an interactive session with Redis where you can run Redis commands. To exit the Redis CLI, simply type `exit`.


After following these steps, your Redis server will be running and accessible at `localhost:6379`, ready to handle the queue for your image processing tasks.
