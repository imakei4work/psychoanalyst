import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../../molecules/Header/index';
import SpeechDialog from '../../molecules/SpeechDialog/index';
import Button from '@material-ui/core/Button';
import httpClient from '../../tool/httpClient'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import './style.css';

const Model = withStyles(() => ({ root: { width: '100px', fontSize: '11px' } }))(TableCell);
const Description = withStyles(() => ({ root: { width: '500px', fontSize: '11px' } }))(TableCell);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      personality: null,
      needs: null,
      values: null,
      tones: null
    }
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDialogOnClose = this.handleDialogOnClose.bind(this);
    this.handleOnAnalysis = this.handleOnAnalysis.bind(this);
  }

  handleDialogOnClose(text) {
    if (!text) {
      this.setState({ open: false });
    } else {
      httpClient.post('/api/analysis', { text: text }).then(res => {
        res.personality.forEach(p => {
          p.hex = "#12939A";
          p.children.forEach(c => c.hex = "#12939A");
        });
        res.needs.forEach(n => n.hex = "#12939A");
        res.values.forEach(v => v.hex = "#12939A");
        res.tones.forEach(t => t.hex = "#12939A");
        this.setState({
          personality: res.personality,
          needs: res.needs,
          values: res.values,
          tones: res.tones,
          open: false
        });
      }).catch(() => {
        alert("エラーが発生しました。もう一度やり直してください");
        this.setState({ open: false });
      });
    }
  }

  handleOnClick() {
    this.setState({ open: true });
  }

  handleOnAnalysis() {
    this.props.history.push("/analysis");
  }

  render() {
    return (
      <div className="login" >
        <Header title="音声解析・性格分析" />
        <SpeechDialog open={this.state.open} onClose={this.handleDialogOnClose} />
        <Button variant="contained" color="secondary" onClick={this.handleOnClick}>録音開始</Button>&nbsp;
        <Button variant="contained" color="primary" onClick={this.handleOnAnalysis}>動画解析</Button>
        <div className="result">
          <div>
            {
              this.state.personality &&
              <div className="analysis">
                <div className="analysis-info">
                  <RadarChart outerRadius="50%" width={500} height={500} data={this.state.personality}>
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
                  <RadarChart outerRadius="50%" width={500} height={500} data={this.state.needs}>
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
                  <RadarChart outerRadius="50%" width={500} height={500} data={this.state.values}>
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
                          <Model align="left">自己超越</Model>
                          <Description align="left">他人の幸福や利益を気遣う。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">不変</Model>
                          <Description align="left">自己制約、秩序、および変化への抵抗を重視する。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">快楽主義</Model>
                          <Description align="left">自分自身のための喜びや感覚的満足を求める。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">自己増進</Model>
                          <Description align="left">自分自身のための個人的成功を求める。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">変化許容性</Model>
                          <Description align="left">独立した行動、考え方、感覚を重視し、新しい経験を進んで受け入れる。</Description>
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
              this.state.tones &&
              <div className="analysis">
                <div className="analysis-info">
                  <BarChart
                    width={500}
                    height={300}
                    data={this.state.tones}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="percentile" fill="#8884d8" background={{ fill: '#eee' }} />
                  </BarChart>
                </div>
                <div className="analysis-info">
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <Model>トーン</Model>
                          <Description align="left">トーンや感情を分析します。</Description>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <Model align="left">怒り</Model>
                          <Description align="left">怒りは、不当行為、対立、屈辱、怠慢、裏切りから呼び起こされます。 能動的な怒りの場合、人は言葉や暴力でターゲットを攻撃します。 受動的な怒りの場合、人は黙って不機嫌になり、緊張と敵意を感じます。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">不安</Model>
                          <Description align="left">不安は、差し迫った危険に対する反応です。 これは、何らかの負の刺激に対する反応として引き起こされる生存メカニズムです。 不安は、軽い用心である場合や、極度の恐怖である場合があります。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">喜び</Model>
                          <Description align="left">喜び (つまり幸福) には、楽しみ、満足、娯楽という微妙な違いがあります。 喜びは、幸福、心の平穏、愛、安全、安心という感覚をもたらします。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">悲しみ</Model>
                          <Description align="left">悲しみは、喪失と損害の感情を示します。 人が静かで、意欲的でなく、引きこもっているときは、悲しみを感じているということを推測できます。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">分析的</Model>
                          <Description align="left">分析的トーンは、物事に対する人の論理的思考と分析的態度を示します。 分析的な人は、知的、理性的、きちょうめん、無感情、あるいは冷淡であると受け取られる可能性があります。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">自信</Model>
                          <Description align="left">自信トーンは、人の確信の度合いを示します。 自信のある人は、堂々としている、落ち着いている、希望に満ちている、あるいは尊大であると受け取られる可能性があります。</Description>
                        </TableRow>
                        <TableRow>
                          <Model align="left">ためらい</Model>
                          <Description align="left">ためらいトーンは、人の内気さの度合いを示します。 ためらう人は、不審、はっきりしない、あるいは疑わしいと受け取られる可能性があります。</Description>
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
export default withRouter(Login);