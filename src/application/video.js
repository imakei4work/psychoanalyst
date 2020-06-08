const ffmpeg = require('../../exe/config');
const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const sampledata = require('../../sample');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: 'MZdmc21GHyc0rmKWziFENKHCfbKn1GCnYCtrc8tMYM67',
  }),
  url: 'https://api.jp-tok.speech-to-text.watson.cloud.ibm.com/instances/3d0ee6eb-cc67-4174-b2d9-addbce96b51d',
});


module.exports.analysis = async (req, res) => {
  ffmpeg('mp4/target.mp4')
    .toFormat('mp3')
    .saveToFile('mp3/target.mp3')
    .on('error', (error) => { console.log(error); return res.status(500).send(error); })
    .on('start', () => console.log('convert start.'))
    .on('codecData', data => console.log(data))
    .on('progress', progress => console.log(progress))
    .on('end', () => {
      const recognizeParams = {
        audio: fs.createReadStream('mp3/target.mp3'),
        contentType: 'audio/mp3',
        model: 'ja-JP_BroadbandModel',
        wordAlternativesThreshold: 0.9,
        timestamps: true,
        speakerLabels: true,
      };
      speechToText.recognize(recognizeParams).then(response => {
        try {
          fs.unlinkSync('mp4/target.mp4');
          fs.unlinkSync('mp3/target.mp3');
        } catch (error) {
          // 無視
        }
        res.send(response.result);
      });
    });
}


/**
 * ファイルアップロード処理.
 */
module.exports.upload = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let targetFile = req.files.target;
  targetFile.mv('mp4/target.mp4', error => {
    if (error) return res.status(500).send(err);
    else console.log("copy success.");
  });
  res.send({ message: "success" });
}