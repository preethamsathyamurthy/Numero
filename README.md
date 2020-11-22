Numero Metric App

* Numero metric app cumulates all the metric passed to it.

* The application takes in an array of numbers as input.

* The application gives back a cumulation of all the metrics passed to it at exactly 5 minutes, 10 minutes and 30 minutes before the execution.

  

[toc]

## Architecture



![Architechture](https://dev-to-uploads.s3.amazonaws.com/i/9zhouwhw5zcysdinhznn.jpg)



## Technical details

* The web server of the application is written using ExpressJS framework on top of Node JS and the database used is MongoDB.

* Mongoose is used as an MongoDB Object Data Manager (**ODM**) for our node web application.

* We use Jest and SuperTest for testing our web server end-points.

* Both the web server and database are are deployed as docker containers.

* We can also deploy only the node container and use an external mongoDB.

  

## Deployment Instructions

### Pre-Requisites

* Docker Engine 19.03.0+
  * Current Docker compose version is 3.8.
  * For other versions of Docker Engine, change the docker compose version appropriately as provided [here](https://docs.docker.com/compose/compose-file/).
* Node js
  * Preferred Version : 14.15.0

### Deployment

* Clone the repository https://github.com/preethamsathyamurthy/Numero.git

* Change into the repository

  * ```bash 
    cd numero
    ```

* Docker Compose

  * #### Building and Deploying the app

    * ```bash
      docker-compose up -d --build
      ```

    * Two containers would be spun up.

      * Web Server Image:  numero_web
      * DB Server image: mongo
      * You can access the web application in  http:\\\localhost:5000

  * If we want to run the application locally `skip if not needed`

    * ```bash
      npm install
      ```

    * Now the dependencies will be installed

    * To run in

      * Production: npm start
      * Test: npm test
      * Dev: npm run dev

## Usage

* The application has two methods

  * #### POST /metric

    * **Input:**

      ```json
      {
      
      	"data" : type: numbers[] (length 1-5)
      
      }
      ```

      * (i.e.) an array of numbers of length 1 to 5.

    * **Expected Response:**

      * Status 201 - Created
      * Array of objects where each object contains the number inserted, id and timestamp of insertion.

    * **Example:** 

      ```json 
      {
      
      	"data" : [11,12,13,4]
      
      }
      ```

  * #### GET /metric

    * **Input:** `No-Input`
      * Gets all numbers inserted via POST request in the last exactly in the last 5, 10 and 30 minutes).
    * **Expected Response:**
      * Status 200 - OK
      * Array of numbers (cumulation of numbers which were inserted exactly in the last 5, 10 and 30 minutes).

* The application will be accessible via localhost:5000

  * http:\\\localhost:5000

* We can use any HTTP REST API client to use the application.

  * In our case we will use POSTMAN.
    * POST /metric
    * ![Post Method](https://dev-to-uploads.s3.amazonaws.com/i/18ci5r6a94kspg591nuj.PNG)
    * GET /metric
    * ![Postman Get](https://dev-to-uploads.s3.amazonaws.com/i/f73ropqkweasht162ogk.PNG)

  

### Testing the app

* ```bash
  docker-compose -f docker-compose.test.yml run --service-ports web npm test
  ```

* The output will be similar to below if all the test cases succeed.

  ```bash
  > Numero@1.0.0 test
  > env-cmd -f ./config/test.env jest
  
    console.log
      mongodb://mongo:27017/metrics-test
  
        at Object.<anonymous> (db/connection.js:7:9)
  
    console.log
      MongoDB database connection established successfully
  
        at NativeConnection.<anonymous> (db/connection.js:13:11)
  
  PASS tests/app.test.js
    Test the numero module
      ✓ POST method should not accept an input of datatype other than {'data': numbers[]} (46 ms)
      ✓ POST method should not accept array with lenth greater than 5 (3 ms)
      ✓ POST method should not accept an empty array (3 ms)
      ✓ POST method should accept an input of datatype {'data': numbers[]} (44 ms)
      ✓ GET method should not accept any value as input in the body (5 ms)
      ✓ GET method should return a cumulation of numbers exactly 5 ,10 and 30 minutes before execution in an array or be empty if no value (15 ms)
  
  Test Suites: 1 passed, 1 total
  Tests:       6 passed, 6 total
  Snapshots:   0 total
  Time:        1.358 s
  Ran all test suites.
  ```



## Special Use-cases

* If you want to change the backend DB,

  * change the configuration in 
    * ./config/[dev-prod-test].env
    * Choose the file based on the environment
    * change the MONGODB_URI 's  value

* If you want to change the port,

  * change the configuration in the same file as above
    * change the PORT 's value

* If you want to build and run without compose,

  * set up the db configuration and ports appropriately as seen in the points above

  * In the Numero metric app folder, run

    * ```bash
      docker build -t <image:tag> .
      ```

  * After the image is built, to perform tests,

    * ```bash
      docker run -it --entrypoint sh <image:tag>
      npm test
      ```

    

## Folder Structure Explanation

* `/` - This folder contains the main js, docker and docker-compose and node package files.
* `/config/` - This folder contains the configuration files pertaining to an environment.
* `/db/` - Contains all Database related files
  * `/db/models` - Contains all db models
* `/tests` - This folder contains all the test files.



---



