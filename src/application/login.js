const { IamTokenManager, IamAuthenticator } = require('ibm-watson/auth');
const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');

const tokenManager = new IamTokenManager({
  apikey: 'MZdmc21GHyc0rmKWziFENKHCfbKn1GCnYCtrc8tMYM67',
});
const serviceUrl = "https://api.jp-tok.speech-to-text.watson.cloud.ibm.com/instances/3d0ee6eb-cc67-4174-b2d9-addbce96b51d";

module.exports.login = async (req, res) => {
  try {
    const accessToken = await tokenManager.getToken();
    res.json({
      accessToken,
      serviceUrl,
    });
  } catch (err) {
    next(err);
  }
}


const personalityInsights = new PersonalityInsightsV3({
  version: '2020-02-22',
  authenticator: new IamAuthenticator({
    apikey: 'w10DOjjoIm1X86b-WregpYFO5qgKpwtxwCBlcmlxKvcK',
  }),
  url: 'https://api.jp-tok.personality-insights.watson.cloud.ibm.com/instances/9cda58f8-b6f2-487a-b1f4-34c739d91554',
});

module.exports.analysis = async (req, res) => {
  let text = req.body.text;
  const profileParams = {
    content: {
      contentItems: [
        {
          "content": text,
          "contenttype": "text/plain",
          "created": 1447639154000,
          "id": "666073008692314113",
          "language": "ja"
        }
      ]
    },
    contentType: 'application/json'
  };

  personalityInsights.profile(profileParams)
    .then(profile => {
      res.send({
        personality: profile.result.personality,
        needs: profile.result.needs,
        values: profile.result.values
      });
    })
    .catch(err => {
      console.log('error:', err);
    });
}