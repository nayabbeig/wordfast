import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

// import Paragraph from "./components/Paragraph";
import RS from "random-words-and-sentences";
// const RS = require("random-words-and-sentences");

function App() {
  const [paragraph, setParagraph] = useState();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTypedWord, setCurrentTypedWord] = useState("");
  const [correctIndices, setCorrectIndices] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);

  const [timer, setTimer] = useState(60);
  const [timerOn, setTimerOn] = useState(false);
  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    if (timerOn) {
      let id;
      id = setInterval(() => {
        setTimer((timer) => {
          if (timer) return timer - 1;
          else {
            clearInterval(id);
            setParagraph("");
          }
        });
      }, 1000);

      setIntervalId(id);

      return () => clearInterval(id);
    } else if (intervalId) {
      clearTimeout(intervalId);
    }
  }, [timerOn]);

  const words = useMemo(() => {
    return paragraph ? paragraph.split(" ") : [];
  }, [paragraph]);

  console.log(currentWordIndex, words?.[currentWordIndex]);
  const currentWord = words?.[currentWordIndex];

  const incrementWordIndex = () => setCurrentWordIndex(currentWordIndex + 1);
  const resetWordIndex = () => setCurrentWordIndex(0);
  const resetCorrectIndices = () => setCorrectIndices([]);

  const handleTyping = (event) => {
    if (!timerOn) setTimerOn(true);
    const key = event.key;

    if (key === " ") {
      if (currentWordIndex === words.length - 1) {
        setCurrentTypedWord("");
        resetWordIndex();
        resetCorrectIndices([]);
        loadParagraph();
        return;
      }
      if (currentTypedWord === currentWord) {
        setCorrectIndices([...correctIndices, currentWordIndex]);
        setCorrectWords([...correctWords, currentWord]);
      } else {
        setIncorrectWords([...incorrectWords, currentWord]);
      }
      setCurrentTypedWord("");
      incrementWordIndex();
    } else if (key === "Backspace") {
      const chars = currentTypedWord.split("");
      chars.pop();
      setCurrentTypedWord(chars.join(""));
    } else {
      const keys = [
        "Shift",
        "Alt",
        "Ctrl",
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
      ];
      if (!keys.includes(key)) setCurrentTypedWord(currentTypedWord + key);
    }
  };

  const start = () => {
    loadParagraph();
  };

  const stop = () => {
    setTimerOn(false);
    setIntervalId(null);
    setTimer(60);
    setParagraph("");
    setCurrentTypedWord("");
    resetWordIndex();
    setCorrectIndices([]);
  };

  const isWordCorrect = (index) => correctIndices.includes(index);

  const loadParagraph = () => {
    const sentence = RS.getRandomSentence();
    setParagraph(sentence);
    console.log(sentence);
    // return "sdfsf";
  };

  return (
    <Container>
      <Row>
        <Col md={1} className="m-3 mt-5 mb-0 p-0">
          {intervalId ? (
            <Button onClick={stop}>Stop</Button>
          ) : (
            <Button onClick={start}>Start</Button>
          )}
        </Col>
        {
          <>
            <Col
              md={3}
              className="my-3 mt-5 mb-0 p-0 fw-bold fs-4 text-success"
            >
              Correct: {correctWords.length}
            </Col>
            <Col md={3} className="my-3 mt-5 mb-0 p-0 fw-bold fs-4 text-danger">
              Incorrect: {incorrectWords.length}
            </Col>
            <Col md={1} className="my-3 mt-5 mb-0 p-0 fw-bold fs-4">
              {timer}
            </Col>
          </>
        }
      </Row>

      {!!words?.length && (
        <>
          {`(currentWord: ${currentWord}, currentWordIndex: ${currentWordIndex}, words.length${words.length})`}
          <Row>
            <Col
              md={8}
              className="border p-3 m-3 rounded overflow-auto"
              style={{ height: "300px" }}
            >
              {words.map((word, index) =>
                index === currentWordIndex ? (
                  <span
                    key={index}
                    className="p-1 rounded bg-secondary fw-bold text-light fs-5"
                  >
                    {word}{" "}
                  </span>
                ) : (
                  <span
                    key={index}
                    className={`p-1 rounded fw-bold fs-5 ${
                      isWordCorrect(index)
                        ? "text-success"
                        : index < currentWordIndex
                        ? "text-danger"
                        : ""
                    }`}
                  >
                    {word}{" "}
                  </span>
                )
              )}
            </Col>
          </Row>
          <Row>
            <Col md={8} className="m-3 mt-5 mb-0 p-0">
              <Form.Control
                className="fw-bolder fs-3 bg-light"
                onKeyDown={handleTyping}
                value={currentTypedWord}
                autoFocus={true}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
