const express= require('express');
const dotenv= require('dotenv');
const cors= require('cors');
const mongoose= require('mongoose');
const authRoute= require('./routes/auth');
const postRoute= require('./routes/post');
const userRoute= require('./routes/users');

const app = express();

dotenv.config();
app.use(cors());

app.use(express.json());


//all API Routes
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);

const PORT= process.env.PORT || 9001;

app.listen(PORT, ()=>{
console.log(`Server is running at Port ${PORT}`);
});

//CONNECT WITH MONGODB

mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log("MongoDb Connected");
}).catch((err)=>{
    console.log(err.message)
});