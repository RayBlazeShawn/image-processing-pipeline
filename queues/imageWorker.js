const mongoose = require('mongoose');
const imageQueue = require('./imageQueue');
const processImage = require('../services/imageProcessor');
const Request = require('../models/requestModel');

mongoose.connect('your-mongodb-connection-string-here', {
}).then(() => console.log('Worker connected to MongoDB'))
    .catch(err => console.error('Worker failed to connect to MongoDB', err));

imageQueue.process(async (job) => {
    const { imageUrl, requestId } = job.data;
    try {
        const outputPath = await processImage(imageUrl);

        const updateResult = await Request.updateOne(
            { requestId },
            { $push: { outputImageUrls: outputPath } }
        );

        const request = await Request.findOne({ requestId });
        if (request.inputImageUrls.length === request.outputImageUrls.length) {
            await Request.updateOne(
                { requestId },
                { status: 'Processed' }
            );
        }
    } catch (error) {
        console.error(`Error processing image for requestId ${requestId}:`, error);
    }
});
