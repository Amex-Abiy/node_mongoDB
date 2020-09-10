const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    if (err.name == 'DisconnectedError') {
        const message = 'Could not connect to DB';
        error = new ErrorResponse(message, 408)
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error!'
    })
}

module.exports = errorHandler;