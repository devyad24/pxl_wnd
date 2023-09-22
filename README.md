## User Authentication and Authroization
This is a RESTful api for user authentication and authorization.
### Run on local machine
1. Clone this repository.
2. `npm install` to install all the dependencies.
3. Connect to mongodb and paste the uri into the code where its accessing `process.env.DB_URI` or you can create your own .env file and set the variable.
4. Once connected to database run the application by `node app.js`.
5. Open Postman and test the routes provided in the [documentation](https://documenter.getpostman.com/view/24061042/2s9YCBv9sw).
