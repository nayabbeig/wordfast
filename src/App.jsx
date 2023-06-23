import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  MdOutlineTimer,
  MdCheckCircleOutline,
  MdOutlineCancel,
  MdPlayCircleFilled,
  MdReplayCircleFilled,
} from "react-icons/md";

// import Paragraph from "./components/Paragraph";
import RS from "random-words-and-sentences";
// const RS = require("random-words-and-sentences");

const TIMER_VALUE = 60;

function App() {
  const [paragraph, setParagraph] = useState();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTypedWord, setCurrentTypedWord] = useState("");
  const [correctIndices, setCorrectIndices] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const [timer, setTimer] = useState(TIMER_VALUE);
  const [timerOn, setTimerOn] = useState(false);
  const [intervalId, setIntervalId] = useState(0);

  const inputRef = useRef(null);

  const words = useMemo(() => {
    return paragraph ? paragraph.split(" ") : [];
  }, [paragraph]);

  const currentWord = words?.[currentWordIndex];

  const isTypeTestRunnig = () => !!paragraph;

  const incrementWordIndex = () => setCurrentWordIndex(currentWordIndex + 1);
  const resetCurrentWordIndex = () => setCurrentWordIndex(0);
  const resetCorrectIndices = () => setCorrectIndices([]);

  const finish = () => {
    setParagraph("");
    setCurrentWordIndex(0);
    setCurrentTypedWord("");
    setCorrectIndices([]);
    setTimer(0);
    setTimerOn(false);
    setIntervalId("");
    clearInterval(intervalId);
  };

  const start = () => {
    if (intervalId) {
      finish();
    }
    setCorrectWords([]);
    setIncorrectWords([]);
    setShowResult(false);
    setTimer(TIMER_VALUE);
    loadParagraph();
    inputRef?.current?.focus();
  };

  const isWordCorrect = (index) => correctIndices.includes(index);

  const loadParagraph = () => {
    const sentence = RS.getRandomSentence();
    setParagraph(sentence);
  };

  const changeSentence = () => {
    setCurrentTypedWord("");
    resetCurrentWordIndex();
    resetCorrectIndices();
    loadParagraph();
  };

  const markCorrectWord = () => {
    setCorrectIndices([...correctIndices, currentWordIndex]);
    setCorrectWords([...correctWords, currentWord]);
  };

  const markIncorrectWord = () => {
    setIncorrectWords([...incorrectWords, currentWord]);
  };

  const moveToNextWord = () => {
    setCurrentTypedWord("");
    incrementWordIndex();
  };

  const removeLastCharacter = () => {
    const chars = currentTypedWord.split("");
    chars.pop();
    setCurrentTypedWord(chars.join(""));
  };

  const typeTheCharacter = (key) => {
    setCurrentTypedWord(currentTypedWord + key);
  };

  const handleTyping = (event) => {
    if (!timerOn) setTimerOn(true);
    const key = event.key;
    const specialKeys = [
      "Shift",
      "Alt",
      "Ctrl",
      "ArrowDown",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "CapsLock",
      "Enter",
      "Control",
    ];

    if (key === " ") {
      // user completed typing current sentence, give user new sentence.
      if (currentWordIndex === words.length - 1) {
        return changeSentence();
      }
      // user enters correct word
      if (currentTypedWord === currentWord) markCorrectWord();
      // user enters wrong word
      else if (currentTypedWord !== currentWord) markIncorrectWord();

      return moveToNextWord();
    }

    if (key === "Backspace") {
      return removeLastCharacter();
    }

    if (!specialKeys.includes(key)) return typeTheCharacter(key);
  };

  useEffect(() => {
    if (timerOn) {
      const id = setInterval(() => {
        setTimer((timer) => {
          if (timer - 1) return timer - 1;
          else {
            finish();
            setShowResult(true);
          }
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [timerOn]);

  useEffect(() => {
    const handleKeypressStart = (e) => {
      if (e.key === "Enter" && !isTypeTestRunnig()) {
        start();
        document.removeEventListener("keypress", handleKeypressStart);
      }
    };
    if (!paragraph) document.addEventListener("keypress", handleKeypressStart);
  }, [paragraph]);

  return (
    <Container className="user-select-none">
      <Row className="m-3 mt-5 mb-5 p-0 mx-0">
        <Col xs={1}>
          {isTypeTestRunnig() ? (
            <div onClick={start}>
              <MdReplayCircleFilled
                style={{ cursor: "pointer" }}
                color="#08E8DE"
                size={60}
              />
            </div>
          ) : (
            <div onClick={start}>
              <MdPlayCircleFilled
                style={{ cursor: "pointer" }}
                color="#0079FF"
                size={60}
              />
            </div>
          )}
        </Col>
        <Col xs={3} className="fs-1 fw-bolder px-5 text-light">
          <i>WordFast</i>
        </Col>
        <Col xs={8} className="d-flex justify-content-end align-items-center">
          <div
            style={{
              height: "40px",
              borderRadius: "50px",
              color: "#C6DA20",
              borderColor: "#C6DA20",
              border: "2px solid",
              width: "100px",
            }}
            className="mx-3 fw-bold fs-4 d-flex align-items-center p-1"
          >
            <MdCheckCircleOutline size={30} />
            <span className="p-3">{correctWords.length}</span>
          </div>
          <div
            style={{
              height: "40px",
              borderRadius: "50px",
              color: "#DA1212",
              borderColor: "#DA1212",
              border: "2px solid",
              width: "100px",
            }}
            className="mx-3 fw-bold fs-4 d-flex align-items-center p-1"
          >
            <MdOutlineCancel size={30} />
            <span className="p-3">{incorrectWords.length}</span>
          </div>
          <div
            style={{
              height: "40px",
              borderRadius: "50px",
              color: "#FFB03B",
              borderColor: "#FFB03B",
              border: "2px solid",
              width: "100px",
            }}
            className="mx-3 fw-bold fs-4 d-flex align-items-center p-1"
          >
            <MdOutlineTimer size={30} />
            <span className="p-3">{timer}</span>
          </div>
        </Col>
      </Row>

      {!!words?.length && (
        <>
          <Row>
            <Col
              className="p-3 m-3 rounded d-flex flex-wrap align-content-start"
              style={{ height: "200px", backgroundColor: "#4E9F3D" }}
            >
              {words.map((word, index) =>
                index === currentWordIndex ? (
                  <span
                    key={index}
                    className="p-1 rounded fw-bold text-light fs-5"
                    style={{ backgroundColor: "#1E5128" }}
                  >
                    {word.split("").map((char, i) => (
                      <span
                        className={
                          currentTypedWord[i]
                            ? char === currentTypedWord[i]
                              ? "text-info"
                              : "text-warning"
                            : "text-light"
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span
                    key={index}
                    style={{
                      color: isWordCorrect(index)
                        ? "#1E5128"
                        : index < currentWordIndex
                        ? "#7e2b2b"
                        : "",
                    }}
                    className="p-1 rounded fw-bold fs-5"
                  >
                    {word}
                  </span>
                )
              )}
            </Col>
          </Row>
          <Row>
            <Col className="m-3 mt-5 mb-0 p-0">
              <Form.Control
                className="fw-bolder fs-3"
                onKeyDown={handleTyping}
                value={currentTypedWord}
                autoFocus={true}
                spellCheck={false}
                ref={inputRef}
                style={{
                  backgroundColor: timer < 10 ? "#ffc107" : "#D8E9A8",
                }}
              />
            </Col>
          </Row>
        </>
      )}

      {!words?.length && !showResult && (
        <Row>
          <Col
            className="p-3 m-3 rounded d-flex flex-wrap align-content-center justify-content-center"
            style={{
              height: "200px",
              backgroundColor: "#D8E9A8",
            }}
          >
            <h1>Press Enter To Start</h1>
          </Col>
        </Row>
      )}

      {showResult && (
        <>
          <Row>
            <Col
              className="p-3 m-3 rounded d-flex flex-wrap align-content-start justify-content-center"
              style={{
                height: "150px",
                backgroundColor: "#D8E9A8",
                overflow: "auto",
              }}
            >
              {correctWords?.map((word, index) => (
                <span
                  key={index}
                  style={{
                    color: "#D8E9A8",
                    backgroundColor: "#1E5128",
                  }}
                  className="rounded fw-bold fs-5 p-1 m-1"
                >
                  {word}
                </span>
              ))}
            </Col>
          </Row>
          <Row>
            <Col
              className="p-3 m-3 rounded d-flex flex-wrap align-content-start justify-content-center"
              style={{
                height: "150px",
                backgroundColor: "#ECDBBA",
                overflow: "auto",
              }}
            >
              {incorrectWords?.map((word, index) => (
                <span
                  key={index}
                  style={{
                    color: "#ECDBBA",
                    backgroundColor: "#C84B31",
                  }}
                  className="rounded fw-bold fs-5 p-1 m-1"
                >
                  {word}
                </span>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <h1>Press Enter To Start Again</h1>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
