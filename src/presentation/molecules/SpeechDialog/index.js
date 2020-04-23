import React, { Component } from 'react';
import CirculProgress from '../CirculProgress/index';
import httpClient from '../../tool/httpClient'
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './style.css';

const styles = theme => ({
  root: {
    width: "47vw",
    maxWidth: "47vw",
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: "50vh",
  }
});

class SpeechDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      recording: false,
      formattedMessages: [],
      stream: null
    }
    this.handleOnClose = this.handleOnClose.bind(this);
  }

  componentDidUpdate() {
    if (this.props.open && this.state.recording) {
      const elm = document.getElementsByName('speechText');
      if (elm.length > 0) elm[elm.length - 1].scrollIntoView();
    }
    if (!this.props.open && this.state.recording) {
      this.setState({ progress: false, recording: false, formattedMessages: [], stream: null });
    }
    if (this.props.open && !this.state.recording) {
      this.setState({ progress: true, recording: true }, () => {
        httpClient.get("/api/login").then(response => {
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
          this.setState({ stream: stream, progress: false });
        });
      });
    }
  }

  handleOnClose() {
    if (this.state.recording) {
      if (this.state.stream) {
        this.state.stream.stop();
        this.state.stream.removeAllListeners();
        this.state.stream.recognizeStream.removeAllListeners();
      }
      this.setState({ progress: true }, () => {
        let messages = this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
        let text = "";
        messages.forEach(msg => msg.results.forEach(result => text += result.alternatives[0].transcript));
        this.props.onClose(text);
      });
    } else {
      this.props.onClose("");
    }
  }

  render() {
    const { classes } = this.props;

    let messages = this.state.formattedMessages.filter(r => r.results
      && r.results.length && r.results[0].final);
    const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];
    const interim = (!r || !r.results || !r.results.length || r.results[0].final) ? null : r;
    if (interim) {
      messages.push(interim);
    }

    return (
      <React.Fragment>
        <CirculProgress open={this.state.progress} size={150} />
        <Dialog id="history-search-dialog" disableBackdropClick disableEscapeKeyDown open={this.props.open} >
          <DialogTitle>会話内容</DialogTitle>
          <DialogContent dividers>
            <List className={classes.root} subheader={<li />}>
              {
                this.state.formattedMessages.length == 0 &&
                <ListItem key={`${0}-${0}`}>
                  <ListItemText primary={<div name="speechText">何かしゃべってください。</div>} />
                </ListItem>
              }
              {
                this.state.formattedMessages.length != 0 &&
                messages.map((msg, i) =>
                  msg.results.map((result, j) => (
                    <ListItem key={`${i}-${j}`} name="speechText">
                      <ListItemText primary={<div name="speechText">{result.alternatives[0].transcript}</div>} />
                    </ListItem>
                  ))
                )
              }
            </List>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"
              color="secondary"
              endIcon={<SearchIcon />}
              onClick={this.handleOnClose}>停止・性格分析</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(SpeechDialog);