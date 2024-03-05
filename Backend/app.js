const express = require("express");
const app = express();
const cors=require('cors')
const mongoose=require('mongoose')
const config=require("./utils/config")
const logger=require("./utils/logger")
const middleware=require("./utils/middleware");
const userRouter=require("./controllers/users")
const blogRouter = require("./controllers/blogs");

mongoose.set('strictQuery',true)

mongoose.connect(config.MONGO_URI)
.then(response=>{
    logger.info("Connected to MongoDB")
})
.catch(error=>{
    logger.error(error)
})

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static('public'))

app.use("/api/users",userRouter);

app.use(middleware.tokenExtractor)
app.use('/api/blogs',blogRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownendpoint)

module.exports=app;