const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/requestModel');
const imageQueue = require('../queues/imageQueue');
const asyncHandler = require("../utils/asyncHandler");

const upload = multer({ dest: 'uploads/' });

const uploadCSV = asyncHandler(async (req, res) => {
    const file = req.file;
    const results = [];

    fs.createReadStream(file.path)
        .pipe(csv())
        .on('headers', (headers) => {
            if (!headers.includes('Input Image Urls')) {
                throw new Error('Missing required column: Input Image Urls');
            }
        })
        .on('data', (data) => {
            if (data['Input Image Urls']) {
                const inputUrlsArray = data['Input Image Urls'].split(',');
                results.push({ productName: data['Product Name'], inputUrlsArray });
            } else {
                console.error('Missing Input Image Urls in data:', data);
            }
        })
        .on('end', async () => {
            for (const result of results) {
                let requestId;

                while (true) {
                    requestId = uuidv4();
                    const existingRequest = await Request.findOne({ requestId });
                    if (!existingRequest) {
                        break;
                    }
                    console.warn(`Duplicate requestId ${requestId} found, generating a new one...`);
                }

                try {
                    const newRequest = new Request({
                        requestId,
                        productName: result.productName,
                        inputImageUrls: result.inputUrlsArray,
                        status: 'Processing',
                    });

                    await newRequest.save();
                    result.inputUrlsArray.forEach((imageUrl) => {
                        imageQueue.add({ imageUrl, requestId });
                    });
                } catch (error) {
                    console.error(`Error saving request for product ${result.productName}:`, error);
                    if (error.code === 11000) {
                        console.error('Duplicate requestId detected, aborting operation.');
                        return res.status(400).json({ message: 'Duplicate requestId detected during processing.' });
                    } else {
                        throw error;
                    }
                }
            }
            res.json({ message: 'CSV processed successfully' });
        });
});

module.exports = { uploadCSV, upload };
