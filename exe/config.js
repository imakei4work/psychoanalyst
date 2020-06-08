const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

ffmpeg.setFfmpegPath(path.join(__dirname, 'ffmpeg.exe'));
module.exports = ffmpeg;