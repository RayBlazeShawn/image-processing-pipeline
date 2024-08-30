const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const message = err.message || 'Something went wrong!';

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
