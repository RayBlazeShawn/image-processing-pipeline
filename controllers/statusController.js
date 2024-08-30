const Request = require('../models/requestModel');
const asyncHandler = require('../utils/asyncHandler');

const checkStatus = asyncHandler(async (req, res) => {
        const { requestId } = req.params;
        const request = await Request.findOne({ requestId });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

    res.json({
        status: request.status,
        outputImageUrls: request.outputImageUrls,
    });
});

module.exports = { checkStatus };
