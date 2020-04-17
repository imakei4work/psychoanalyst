import React, { Component } from 'react';
import Header from '../../molecules/Header/index';
import Button from '@material-ui/core/Button';
import httpClient from '../../tool/httpClient'
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Sunburst } from 'react-vis';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import './style.css';

const Model = withStyles(() => ({ root: { width: '100px', fontSize: '10px' } }))(TableCell);
const Description = withStyles(() => ({ root: { width: '400px', fontSize: '10px' } }))(TableCell);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formattedMessages: [],
      stream: null,
      personality: null,
      needs: null,
      values: null
    }
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnStopClick = this.handleOnStopClick.bind(this);
    this.keywords = ["音声認識", "ディープラーニング", "技術"];
    this.dict = {
      "Agreeableness": "協調性",
      "Openness": "開放性",
      "Adventurousness": "冒険 / 経験に前向き",
      "Artistic interests": "芸術的興味",
      "Emotionality": "情動性 / 感情に自覚的 / 感情の深さ",
      "Imagination": "想像力",
      "Intellect": "知性 / 知的好奇心",
      "Authority-challenging": "自由主義 / 権威に対して挑戦的 / 多様性を許容",
      "Conscientiousness": "誠実性",
      "Achievement striving": "達成努力 / 意欲的",
      "Cautiousness": "注意深さ / 慎重 / 思慮深さ",
      "Dutifulness": "忠実さ / 従順な / 責任感",
      "Orderliness": "秩序性 / 組織的",
      "Self-discipline": "自制力 / 粘り強い",
      "Self-efficacy": "自己効力感 / 自信 / 達成感",
      "Extraversion": "外向性",
      "Assertiveness": "自己主張 / 独断的",
      "Cheerfulness": "明朗性 / 陽気 / 肯定的感情",
      "Excitement-seeking": "刺激希求性",
      "Outgoing": "親しみやすさ / 外向性 / 温情",
      "Gregariousness": "社交性 / 付き合い上手",
      "personality": "協調性",
      "Altruism": "利他主義 / 利他的",
      "Cooperation": "協調性 / 寛容 / 従順",
      "Modesty": "謙虚さ / 慎み深い",
      "Uncompromising": "道徳性 / 不屈 / 誠実",
      "Sympathy": "共感性 / 親身",
      "Trust": "信用 / 人を信じる",
      "Emotional range": "情緒不安定性",
      "Fiery": "怒り / 激情的",
      "Prone to worry": "不安 / 心配性",
      "Melancholy": "憂うつ / 悲観的 / 不機嫌",
      "Immoderation": "利己的 / わがまま",
      "Self-consciousness": "自意識過剰",
      "Susceptible to stress": "傷つきやすい / 低ストレス耐性 / ストレス感受性",
      "Excitement": "興奮",
      "Harmony": "調和",
      "Curiosity": "好奇心",
      "Ideal": "理想",
      "Closeness": "親近感",
      "Self-expression": "自己表現",
      "Liberty": "自由",
      "Love": "愛",
      "Practicality": "実用性",
      "Stability": "安定性",
      "Challenge": "挑戦",
      "Structure": "構造",
      "Self-transcendence": "自己超越 / 他人の役に立つ",
      "Conservation": "不変 / 伝統",
      "Hedonism": "快楽主義 / 人生を楽しむ",
      "Self-enhancement": "自己増進 / 成功する",
      "Openness to change": "変化許容性 / 興奮",
    }
  }

  componentDidUpdate() {
    const elements = document.getElementsByClassName('text-line');
    if (elements.length > 0)
      elements[elements.length - 1].scrollIntoView();
  }

  handleOnStopClick() {
    if (this.state.stream) {
      this.state.stream.stop();
      this.state.stream.removeAllListeners();
      this.state.stream.recognizeStream.removeAllListeners();
      this.setState({ stream: null });
    }
    let messages = this.state.formattedMessages.filter(r => r.results
      && r.results.length && r.results[0].final);
    let text = "";
    messages.forEach(msg => msg.results.forEach(result => text += result.alternatives[0].transcript));

    httpClient.post('/api/analysis', { text: text }).then(res => {
      res.personality.forEach(p => {
        p.name = this.dict[p.name];
        p.hex = "#12939A";
        p.children.forEach(c => {
          c.name = this.dict[c.name];
          c.hex = "#12939A";
        });
      });
      res.needs.forEach(n => {
        n.hex = "#12939A";
        n.name = this.dict[n.name];
        n.fullMark = 1
      });
      res.values.forEach(v => {
        v.hex = "#12939A";
        v.name = this.dict[v.name];
      });
      this.setState({
        personality: res.personality,
        needs: res.needs,
        values: res.values
      });
    });
  }

  handleOnClick() {
    httpClient.get("/api/login").then(response => {
      console.log(response);
      let stream = recognizeMicrophone({
        access_token: response.accessToken,
        token: undefined,
        smart_formatting: true,
        format: true, // adds capitals, periods, and a few other things (client-side)
        model: 'ja-JP_BroadbandModel',
        objectMode: true,
        interim_results: true,
        word_alternatives_threshold: 0.01,
        keywords: undefined,
        keywords_threshold: undefined, // note: in normal usage, you'd probably set this a bit higher
        timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
        speaker_labels: false,
        resultsBySpeaker: false,
        speakerlessInterim: false,
        url: response.serviceUrl,
      });
      stream.on('data', (msg) => {
        this.setState({ formattedMessages: this.state.formattedMessages.concat(msg) });
      }).on('error', (err, extra) => console.log(err));
      this.setState({ stream: stream });
    });
  }

  render() {
    let messages = this.state.formattedMessages.filter(r => r.results
      && r.results.length && r.results[0].final);

    const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];
    const interim = (!r || !r.results || !r.results.length || r.results[0].final) ? null : r;
    if (interim) {
      messages.push(interim);
    }

    return (
      <div className="login" >
        <Header title="音声解析・性格分析" />
        <Button variant="contained" color="secondary" onClick={this.handleOnClick}>録音開始</Button>&nbsp;
        <Button variant="contained" color="secondary" onClick={this.handleOnStopClick}>停止・性格分析</Button>
        <div className="text">
          {
            messages.map(msg =>
              msg.results.map((result, i) => (
                <div key={i} className="text-line">{result.alternatives[0].transcript}</div>
              ))
            )
          }
        </div>
        <div className="result">
          <div>
            {
              this.state.personality &&
              <div className="analysis">
                <div className="analysis-info">
                  <RadarChart outerRadius="50%" width={400} height={400} data={this.state.personality}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 1]} />
                    <Radar name="Mike" dataKey="percentile" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </div>
                <div className="analysis-info">
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <Model>パーソナリティ</Model>
                          <Description align="left">個人が世界とどのように関与しているかを一般的に記述するために最も広く使用されるモデルを表します。 このモデルには、次の 5 つの主要ディメンションが含まれます。</Description>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <Model align="left">協調性</Model>
                          <Description align="left">他人に対して思いやりを持ち協力的になる個人の傾向です。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">誠実性</Model>
                          <Description align="left">組織的な思慮深い方法で行動する個人の傾向です。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">外向性</Model>
                          <Description align="left">他人との付き合いで刺激を求める個人の傾向です。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">情緒不安定性</Model>
                          <Description align="left">神経症的傾向 または自然な反応 とも呼ばれ、個人の感情が環境に左右される程度です。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">開放性</Model>
                          <Description align="left">個人がさまざまな活動の経験に対してオープンである程度です。</Description>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            }
          </div>
          <div>
            {
              this.state.needs &&
              <div className="analysis">
                <div className="analysis-info">
                  <RadarChart outerRadius="50%" width={400} height={400} data={this.state.needs}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 1]} />
                    <Radar name="Mike" dataKey="percentile" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </div>
                <div className="analysis-info">
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <Model>ニーズ</Model>
                          <Description align="left">個人の共感を呼ぶ商品の側面を説明します。 このモデルには、12 個の特徴ニーズが含まれます。</Description>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <Model align="left">興奮</Model>
                          <Description align="left">現実から飛び出して人生を送りたい、陽気で感情豊かであり、楽しむことが好き。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">調和</Model>
                          <Description align="left">他の人たちを理解し、他の人たちの観点や感情を尊重する。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">好奇心</Model>
                          <Description align="left">発見、調査、成長への欲求がある。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">理想</Model>
                          <Description align="left">完璧性と連帯感を望む。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">親近感</Model>
                          <Description align="left">家族との結び付きや家庭を持つことを楽しむ。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">自己表現</Model>
                          <Description align="left">独自のアイデンティティーの発見と表明を楽しむ。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">自由</Model>
                          <Description align="left">ファッションや新商品に対する所有欲があり、逃避願望もある。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">愛</Model>
                          <Description align="left">1 対 1 と 1 対多のどちらであっても社会的接触を楽しむ。 人々をまとめるような製品がこの欲求を刺激する。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">実用性</Model>
                          <Description align="left">任務をこなしたい欲求があり、スキルと効率性 (身体的な表現や経験も含まれることがある) を望む。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">安定性</Model>
                          <Description align="left">物理的世界で等価のものを探す。 実用的で、試験され検証されたものを好む。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">挑戦</Model>
                          <Description align="left">達成、成功、挑戦への欲求がある。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">構造</Model>
                          <Description align="left">根拠を明示し、物事を一つにまとめることを望む。 物事がよく整理され、制御可能であることを求める。</Description>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            }
          </div>
          <div>
            {
              this.state.values &&
              <div className="analysis">
                <div className="analysis-info">
                  <RadarChart outerRadius="50%" width={400} height={400} data={this.state.values}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 1]} />
                    <Radar name="Mike" dataKey="percentile" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </div>
                <div className="analysis-info">
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <Model>価値</Model>
                          <Description align="left">個人の意思決定に影響を与える動機付け因子を説明します。このモデルには、5 つの価値が含まれます。</Description>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <Model align="left">自己超越 / 他人の役に立つ	</Model>
                          <Description align="left">他人の幸福や利益を気遣う。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">不変 / 伝統</Model>
                          <Description align="left">自己制約、秩序、および変化への抵抗を重視する。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">快楽主義 / 人生を楽しむ</Model>
                          <Description align="left">自分自身のための喜びや感覚的満足を求める。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">自己増進 / 成功する</Model>
                          <Description align="left">自分自身のための個人的成功を求める。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">変化許容性 / 興奮</Model>
                          <Description align="left">独立した行動、考え方、感覚を重視し、新しい経験を進んで受け入れる。</Description>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            }
          </div>
        </div>
      </div >
    )
  }
}
export default Login;