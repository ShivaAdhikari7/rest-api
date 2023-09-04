# RestAPI

RestAPI provides API endpoint to signup, login searching, pagination, CRUD functionality for both Records and the User. The API endpoint is made using Node.js, Express.js and to store the data MySQL server is used.

## How to install

1. Clone the project `git clone https://github.com/ShivaAdhikari7/rest-api`.

2. Install all the dependencies `npm install` or `npm i`.

3. Make the folder named `uploads/images` in root directory where the uploaded images will be stored.

4. Run the project `npm run server`.

5. To run the test file `npm run test`.

After these steps, the localhost server on port 90 will start - [localhost](http://localhost:90).

## Postman API documentation link :

https://documenter.getpostman.com/view/24315428/2s9Y5eLdoq

## API endpoints for:

## User:

1. SingUp user: POST: [signup](http://localhost:90/api/users/signup/)

2. Login User: POST: [login](http://localhost:90/api/users/login/)

3. Get the data of All Users: GET: [getAllUsers](http://localhost:90/api/users)

4. Update the User: PATCH: [updateUser](http://localhost:90/api/users/)

5. Delete the User: DELETE: [deleteUser](http://localhost:90/api/users/)

6. Get Single User by unique identifier: GET: [getUser](http://localhost:90/api/users/)

7. Search User by email or name: GET: [getAllUsers](http://localhost:90/api/users/?email='')

## Record:

1. Create the Order: POST: [createRecord](http://localhost:90/api/records/)

2. Get All Record data: GET: [getAllRecords](http://localhost:90/api/records/)

3. Update the Record: PATCH: [updateRecord](http://localhost:90//api/records/:id)

4. Delete the Record: DELETE: [deleteRecord](http://localhost:90/api/records/:id)

5. Get Single Record by unique identifier: GET: [getRecordById](http://localhost:90/api/records/:id)

6. Search User by phone, email or name and pagination: GET: [getAllRecords](http://localhost:90/api/records/?phone=""&email=""&page=1&limit=1)

7. Get Record of the user by own unique identifier: GET: [getRecordByUserId](http://localhost:90/records/user/:id)
