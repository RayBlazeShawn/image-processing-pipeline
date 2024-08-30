const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const processImage = async (imageUrl) => {
    try {

        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data, 'binary');

        const outputFileName = `compressed-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads/', outputFileName);
        await sharp(buffer)
            .resize({ width: 800 })
            .toFile(outputPath);

        return outputPath;
    } catch (error) {
        console.error(`Error processing image from URL ${imageUrl}:`, error);
        throw new Error('Image processing failed');
    }
};

module.exports = processImage;
