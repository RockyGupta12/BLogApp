const logger=require('../utils/logger')
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const requestLogger=(request,rerspone,next)=>{
    logger.info("Method",request.method)
    logger.info("Path",request.path)
    logger.info("Body",request.body)
    logger.info("---")
    next()
}

const unknownendpoint=(request,response)=>{
    response.status(404).send({error:"unknown endpoint"})
}      

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
     
    if (error.name === "castError") {
      return response.status(400).json({ error: "Malformated Id" });
    } else if (error.name === "validationError") {
      return response.status(400).json({ error: "validationError" });
    } else if (error.name === "jsonWebTokenError") {
      return response.status(401).json({ error: "Invalid Token" });
    }
    return response.status(401).json({ error: "Internal Server Error" });
  // next(error);
  };

  const getTokenFrom = (request) => {
    const Authorization = request.get("Authorization");
    logger.info(Authorization)
    if (Authorization && Authorization.startsWith("Bearer ")) {
      return Authorization.replace("Bearer ", "");
    }
    return null;
  };
  
  const tokenExtractor = async (request, response, next) => {
    try {
      const token = getTokenFrom(request);
      logger.info(token);
      if (!token) {
        return response.status(400).json({ error: "No token found" });
      }
      const decodedToken = await jwt.verify(token, process.env.SECRET);
  
      if (!decodedToken.id) {
        return response.status(400).json({ error: "Invalid Token" });
      }
    
      const user = await User.findById(decodedToken.id);
      if (!user) {
        return response.status(400).json({ error: "User not found" });
      }
      logger.info(user);
      request.user = user;
      next(); // Move this line here to ensure it's only called after user is set
    } catch (error) {
      next(error);
    }
  };
  
  module.exports={
    requestLogger,
    unknownendpoint,
    errorHandler,
    tokenExtractor
  }