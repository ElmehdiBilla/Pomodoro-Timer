import { Github, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react"

function App() {

  const defaultState = {
    breakLength : 1,
    sessionLength : 2,
  }

  const [breakLength, setBreakLength] = useState(defaultState.breakLength);
  const [sessionLength, setSessionLength] = useState(defaultState.sessionLength);

  const initialTime = defaultState.sessionLength * 60;
  const [time, setTime] = useState(initialTime);
  const [totalSeconds, setTotalSeconds] = useState(initialTime);
  
  const [timerLabel, setTimerLabel] = useState('Session');
  const [playBtnClass ,setPlayBtnClass] = useState('play');
  const [timeLeftClass,setTimeLeftClass] = useState('color-blue')

  const [angle,setAngle] = useState(0);
  
  const [isPlay,setIsPlay] = useState(false);
  const [isBreak,setIsBreak] = useState(false);

  const intervalRef = useRef(null);
  const beepRef = useRef(null);

  const decrementBreak = () => {
    if(!isPlay){
      setBreakLength(prevS => Math.max(1,prevS - 1));
    }
  }

  const incrementBreak = () => {
    if(!isPlay){
      setBreakLength(prevS => Math.min(60,prevS + 1));
    }
  }

  const decrementSession = () => {
    if(!isPlay){
      setSessionLength(prevS => {
        const newTime = Math.max(1,prevS - 1);
        setTime(newTime*60);
        setTotalSeconds(newTime*60);
        setAngle(0);
        return newTime ;
      })
    }
  }

  const incrementSession = () => {
    if(!isPlay){
      setSessionLength(prevS => {
        const newTime = Math.min(60,prevS + 1);
        setTime(newTime*60);
        setTotalSeconds(newTime*60);
        setAngle(0);
        return newTime ;
      })
    }
  }

  const reset = () => {
    beepRef?.current?.pause();
    if(beepRef.current){
      beepRef.current.currentTime=0;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlay(false);
    setIsBreak(false);
    setBreakLength(defaultState.breakLength);
    setSessionLength(defaultState.sessionLength);
    
    const newInitialTime = defaultState.sessionLength * 60;
    setTime(newInitialTime);
    setTotalSeconds(newInitialTime);
    setTimerLabel('Session');
    setPlayBtnClass('play');
    setTimeLeftClass('color-blue');
    setAngle(0);
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2 ,"0")}:${seconds.toString().padStart(2, "0")}`
  }
  
  useEffect(() => {
    const newTotalSeconds = (isBreak ? breakLength : sessionLength) * 60;
    setTime(newTotalSeconds);
    setTotalSeconds(newTotalSeconds);
    setTimerLabel(isBreak ? 'Break' : 'Session');
    setTimeLeftClass('color-blue');
    setAngle(0);
  }, [isBreak,breakLength,sessionLength])
  
  useEffect(() => {
    if(isPlay){
      setPlayBtnClass('stop')
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if(prevTime === 0){
            beepRef?.current?.play();
            setTimeLeftClass('color-blue');
            setIsBreak(!isBreak);
            return prevTime;
          }else{
            const currentTime = prevTime - 1;
            if(totalSeconds > 0){
              const elapsedSeconds = totalSeconds - currentTime;
              setAngle(Math.floor((elapsedSeconds / totalSeconds) * 360));
            } else {
              setAngle(0);
            }
            if(currentTime <= 60){
              setTimeLeftClass('color-red');
            }
            return currentTime;
          }
        })
      }, 100);
    }
    else {
      setPlayBtnClass('play')
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

  },[isPlay,isBreak,totalSeconds])


  return (
    <>
      <div className='pomodoro-timer'>

        <div id="timer">
          <div 
          className='progress-circle' 
          style={{
            background: `conic-gradient(#E5E7EB ${angle}deg, #b9d6ff ${angle}deg)`
          }}
          id="progressCircle"></div>
          <div>
            <div id="timer-label">{timerLabel}</div>
            <div id="time-left" className={timeLeftClass}>{formatTime(time)}</div>
          </div>
          <div id="timer-btns">
            <button id="start_stop" className={playBtnClass} onClick={() => setIsPlay(!isPlay)}>{isPlay?<Pause />:<Play />}</button>
            <button id="reset" onClick={reset}><RotateCcw/></button>
          </div>
        </div>
        {
          !isPlay &&
          <div id='controls'>
            <div id="break-control">
              <label id="break-label">Break</label>
              <div className="buttons">
                <div className="length-controls">
                  <button id="break-decrement" onClick={decrementBreak} disabled={isPlay}>
                    <Minus/>
                  </button>
                  <div>
                    <label id="break-length">{breakLength}</label>
                  </div>
                  <button id="break-increment" onClick={incrementBreak} disabled={isPlay}>
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
            <div id="session-control">
              <label id="session-label">Session</label>
              <div className="buttons">
                <div className="length-controls">
                  <button id="session-decrement" onClick={decrementSession} disabled={isPlay}>
                    <Minus/>
                  </button>
                  <div>
                    <label id="session-length">{sessionLength}</label>
                  </div>
                  <button id="session-increment" onClick={incrementSession} disabled={isPlay}>
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        <audio
            id="beep"
            ref={beepRef}
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
            preload="auto"
        />
      </div>
      <a id="github" href="https://github.com/ElmehdiBilla"><Github /></a>
    </>
  )
}

export default App
