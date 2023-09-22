const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth'); 
const todoRouter = require('./routes/todo');
const { mainModule } = require("process");
const dotenv = require("dotenv");


dotenv.config();

const app = express();

mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_URI || 'mongodb://localhost:27017/your-database-name';

main().catch((err) => console.log(err));
async function main(){
    await mongoose.connect(mongoDB);
}

app.use(express.json());
app.use(bodyParser.json());

app.use('/auth', authRouter); 
app.use('/test', todoRouter);

app.get('/', function(req, res) {
    res.send("Go to /auth/register or /auth/login");
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;