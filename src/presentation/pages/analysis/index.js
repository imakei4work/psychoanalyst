import React, { Component } from 'react';
import Header from '../../molecules/Header/index';
import Button from '@material-ui/core/Button';
import httpClient from '../../tool/httpClient';
import FileSelect from '../../molecules/FileSelect/index';
import CirculProgress from '../../molecules/CirculProgress/index'
import './style.css';

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      maxCols: 0,
      filename: '',
      file: null,
      circul: false
    }
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnFileSelected = this.handleOnFileSelected.bind(this);
  }

  handleOnClick() {
    if (!this.state.filename || !this.state.file) {
      alert("アップロードファイルを選択してください");
      return;
    }
    this.setState({ circul: true }, () => {
      let data = new FormData();
      data.append("target", this.state.file);
      httpClient.postFile("/api/upload", data)
        .then(response => {
          if (response.message === "success")
            return httpClient.post('/api/videoanalysis', { message: response.message })
        })
        .then(data => {
          const labels = data.speaker_labels;
          const maxCols = data.speaker_labels.reduce((v, c) => v < c.speaker ? c.speaker : v, 0);
          const conv = [];
          let temp = null;
          data.results.forEach(d => {
            d.alternatives.forEach(a => {
              a.timestamps.forEach(t => {
                const label = labels.find(l => l.from == t[1] && l.to == t[2]);
                if (label.confidence >= 0.4) { // 信頼度40%以上
                  if (!temp) temp = { time: label.from, text: t[0], speaker: label.speaker };
                  else if (temp.speaker == label.speaker) temp.text += t[0];
                  else {
                    conv.push(temp);
                    temp = { time: label.from, text: t[0], speaker: label.speaker };
                  }
                }
              });
            });
          });
          this.setState({ result: conv, maxCols: maxCols, circul: false })
        })
        .catch(error => {
          alert(error);
          this.setState({ circul: false });
        });
    })
  }

  handleOnFileSelected(file) {
    this.setState({ filename: file.name, file: file });
  }

  render() {
    let rows = [];
    for (let i = 0; i < this.state.maxCols + 1; i++) rows.push(i);
    return (
      <div className="analysispage">
        <Header title="動画解析" />
        <CirculProgress open={this.state.circul} size={100} />
        <div className="analysisbutton">
          <div className="analysisfileselect">
            <FileSelect
              onFileSelected={this.handleOnFileSelected}
              filename={this.state.filename}
            />
          </div>
          <div className="analysisstart">
            <Button
              variant="contained"
              component="span"
              size="small"
              color="primary"
              onClick={this.handleOnClick}>解析開始</Button>
          </div>
        </div>
        <div className="result">
          {
            this.state.result.length > 0 &&
            <table border="2">
              <tr>
                {
                  rows.map(r => <td>{"Speaker " + r}</td>)
                }
              </tr>
              {
                this.state.result.map(c => (
                  <tr>
                    {
                      rows.map(r => (
                        <td width="200">
                          <div>{r == c.speaker ? "時間:" + c.time : ""}</div>
                          <div>{r == c.speaker ? c.text : ""}</div>
                        </td>
                      ))
                    }
                  </tr>
                ))
              }
            </table>
          }
        </div>
      </div>
    )
  }
}
export default Analysis;