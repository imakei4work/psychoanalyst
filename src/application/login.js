const { IamTokenManager, IamAuthenticator } = require('ibm-watson/auth');
const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');

const tokenManager = new IamTokenManager({ apikey: 'MZdmc21GHyc0rmKWziFENKHCfbKn1GCnYCtrc8tMYM67' });
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
const languageTranslator = new LanguageTranslatorV3({
  version: '2020-02-22',
  authenticator: new IamAuthenticator({
    apikey: 'WzgfEFVpaVL1KOI6bulL8RLu5nkXqYYkSqfwq2aRpOlU',
  }),
  url: 'https://api.jp-tok.language-translator.watson.cloud.ibm.com/instances/45e6a430-dcfc-455d-8de5-c2867669616c',
  disableSslVerification: true,
});
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2020-02-22',
  authenticator: new IamAuthenticator({
    apikey: 'iFXsU4rWC6KyuGsUh85-qH5xaNlYlctY8_fR0H9VwHWo',
  }),
  url: 'https://api.jp-tok.tone-analyzer.watson.cloud.ibm.com/instances/1608882a-8ded-4e22-a516-434b16a94985',
});


module.exports.analysis = async (req, res) => {
  let text = req.body.text;
  try {

    // Personality Insight
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
    let profile = await personalityInsights.profile(profileParams);

    // Language Translator
    const translateParams = {
      text: text,
      modelId: 'ja-en',
    };
    let translate = await languageTranslator.translate(translateParams);
    let english = translate.result.translations.map(t => t.translation).reduce((accumu, current) => accumu + current);
    console.log(english);
    // Tone Analyzer
    const toneParams = {
      toneInput: { 'text': english },
      contentType: 'application/json',
    };
    let tone = await toneAnalyzer.tone(toneParams);
    let toneConv = [
      { en: "anger", name: "怒り", percentile: 0 },
      { en: "fear", name: "不安", percentile: 0 },
      { en: "joy", name: "喜び", percentile: 0 },
      { en: "sadness", name: "悲しみ", percentile: 0 },
      { en: "analytical", name: "分析的", percentile: 0 },
      { en: "confident", name: "自信", percentile: 0 },
      { en: "tentative", name: "ためらい", percentile: 0 }
    ];
    tone.result.document_tone.tones.forEach(t => {
      let c = toneConv.find(tc => tc.en == t.tone_id);
      if (c) c.percentile = t.score;
    });

    res.send({
      personality: profile.result.personality,
      needs: profile.result.needs,
      values: profile.result.values,
      tones: toneConv
    });

  } catch (error) {
    console.log('error:', error);
  }
}


