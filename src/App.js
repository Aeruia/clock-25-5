
import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timer: "Session",
      timeLeft: `mm:ss`,
      active: false,
      secondsSession: 25 * 60,
      secondsBreak: 5 * 60,
      myInterval: ''
    }
  }

  displayTimeLeft = (seconds) => {
    let secondsDisplayed = seconds % 60;
    let minutesDisplayed = Math.floor(seconds / 60);
    return (minutesDisplayed < 10 ? '0' + minutesDisplayed : minutesDisplayed) + ":" + (secondsDisplayed < 10 ? "0" + secondsDisplayed : secondsDisplayed);

  }

  runTimer = () => {
    const beep = document.getElementById("beep");


    if (!this.state.active) {
      let sec;
      if (this.state.timer === 'Session') {
        sec = this.state.secondsSession;
      }
      if (this.state.timer === 'Break') {
        sec = this.state.secondsBreak;
      }
      if (this.state.seconds) {
        sec = this.state.seconds
      }
      this.setState({ active: true });
      this.state.myInterval = setInterval(() => {
        sec -= 1;

        if (sec > 0 && this.state.active) {

          this.setState({ seconds: sec, timeLeft: this.displayTimeLeft(sec) })
        }
        if (sec === 0 && this.state.timer === 'Session') {
          beep.currentTime = 0;
          beep.play();
          this.setState({ timeLeft: this.displayTimeLeft(sec), timer: 'Break' })
          sec = this.state.secondsBreak + 1;
        }
        if (sec === 0 && this.state.timer === 'Break') {
          beep.currentTime = 0;
          beep.play();
          this.setState({ timeLeft: this.displayTimeLeft(sec), timer: 'Session' })
          sec = this.state.secondsSession + 1;
        }

      }, 1000)
    } else {
      this.setState({ active: false });
      clearInterval(this.state.myInterval);
    }
  }

  changeStartPauseButton = () => {
    const startPauseButton = document.getElementById('start_stop');
    if (this.state.active) {
      startPauseButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
    }
  }

  handleSessionLength = (e) => {
    if (e.target.innerHTML === '-' && this.state.sessionLength > 1) {
      if (!this.state.active) {
        this.setState({ secondsSession: (this.state.sessionLength - 1) * 60, timeLeft: this.displayTimeLeft((this.state.sessionLength - 1) * 60) })
      }
      this.setState({ sessionLength: this.state.sessionLength - 1 })

    } else if (e.target.innerHTML === '+' && this.state.sessionLength < 60) {
      if (!this.state.active) {
        this.setState({ secondsSession: (this.state.sessionLength + 1) * 60, timeLeft: this.displayTimeLeft((this.state.sessionLength + 1) * 60) })
      }
      this.setState({ sessionLength: this.state.sessionLength + 1 })
    }
  }
  componentDidMount() {
    this.setState({
      timeLeft: this.displayTimeLeft(this.state.sessionLength * 60),
      secondsSession: this.state.sessionLength * 60,
    })
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  reset = () => {
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
    clearInterval(this.state.myInterval);
    this.setState({ active: false, sessionLength: 25, breakLength: 5, timer: 'Session', secondsSession: 25 * 60, timeLeft: this.displayTimeLeft(25 * 60), secondsBreak: 5 * 60 });
  }
  render() {
    const { active, breakLength, sessionLength, timeLeft, timer } = this.state;
    return (
      <div className="App">
        <h1><strong>Clock 25 - 5</strong></h1>
        <div className="clock">
          <div className="break">
            <h2 id="break-label">Break Length</h2>
            <div className="buttons">
              <button className="button" id="break-decrement" onClick={() => { if (breakLength > 1) { this.setState({ breakLength: breakLength - 1, secondsBreak: (breakLength - 1) * 60 }) } }} disabled={active ? true : false}>-</button>
              <div id="break-length">{breakLength}</div>
              <button className="button" id="break-increment" onClick={() => { if (breakLength < 60) { this.setState({ breakLength: breakLength + 1, secondsBreak: (breakLength - 1) * 60 }) } }} disabled={active ? true : false}>+</button>
            </div>
          </div>
          <div className="session">
            <h2 id="session-label">Session Length</h2>
            <div className="buttons">
              <button className="button" id="session-decrement" onClick={this.handleSessionLength} disabled={active ? true : false}>-</button>
              <div id="session-length">{sessionLength}</div>
              <button className="button" id="session-increment" onClick={this.handleSessionLength} disabled={active ? true : false}>+</button>
            </div>
          </div>
        </div>
        <div className="display">
          <h2 id="timer-label">{timer}</h2>
          <div id="time-left">{timeLeft}</div>
          <div className="buttons">
            <button className="button" id="start_stop" onClick={this.runTimer}>{active ? <i className="fa fa-pause" aria-hidden="true"></i> : <i className="fa fa-play" aria-hidden="true"></i>}</button>
            <button className="button" id="reset" onClick={this.reset}><i className="fa fa-refresh" aria-hidden="true"></i></button>
          </div>
        </div>
        <audio id="beep" src="https://www.soundjay.com/button/sounds/button-2.mp3"></audio>

      </div>
    );
  }
}

export default App;
