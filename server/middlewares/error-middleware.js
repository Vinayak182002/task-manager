const errorMiddleware = (err,req,res,next) =>{
    const status = err.status || 500;
    const message = err.message || "Backend Error!";
    const extraDetails = err.extraDetails || "Extra Details in error";
    // console.log(message);
    
    return res.status(status).json({status,message,extraDetails});
}

module.exports = errorMiddleware;