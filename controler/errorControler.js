const appError = require('./../utils/appError');
const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path} is ${err.value}.`;
    return new appError(message, 400);
}
const handleDuplicateFieldsDB = err => {
    // console.log("here");
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // console.log(value);
    const message = `Duplicate field value: ${value}. please use another value.`;
    return new appError(message, 400);
}

const handleValidationErrorDb = err => {
    // console.log("here");

    const errors = Object.values(err.errors).map(val => val.message);
    console.log(errors);
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // console.log(value);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError(message, 400);
}
 
const handleJWTError = err => new appError('Invalid token. Please login in again! ',401);

const handleJWTExpiredError = err=>{
    // console.log('--------------------------');
    return new appError('Session expired, Login again',401);
} 

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}
const sendErrorProd = (err, res)=>{
    // Operational, trusted error: send message to client
    if(err.isOperational){

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Progarmming or other unknown error: don't leak error details
    else{

        // 1) log error
        console.error('ERROR ', err);

        // 2) send generate message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong! '
        })
    }

}
module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV ==='development'){
        sendErrorDev(err, res);
    }
    else if( process.env.NODE_ENV === 'production'){
        let error = {...err};

        if(err.name === 'CastError') error = handleCastErrorDB(error, res);
        // console.log(err.code);
        if(err.code === 11000) error = handleDuplicateFieldsDB(err, res);

        if(err.name === 'ValidationError') error = handleValidationErrorDb(err, res);

        if(err.name === 'JsonWebTokenError') error = handleJWTError(err,res);
        // console.log(err.name);

        if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(err, res);
        sendErrorProd(error, res);
    }

}