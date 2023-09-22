const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth'); // Import your authentication routes
const { mainModule } = require("process");
const dotenv = require("dotenv");


dotenv.config();

// Create an Express.js app
const app = express();

// Connect to MongoDB
mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_URI || 'mongodb://localhost:27017/your-database-name';

main().catch((err) => console.log(err));
async function main(){
    await mongoose.connect(mongoDB);
}

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRouter); // Mount the authentication routes under /auth


app.get('/', function(req, res) {
    res.send("Go to /auth/register or /auth/login");
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
