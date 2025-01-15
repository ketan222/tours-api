class appError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail': 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);                // when new object will be created and contructor function will be called and this function call will not appear in the err.stack
    }

}
module.exports = appError;