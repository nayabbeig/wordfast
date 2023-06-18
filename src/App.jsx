import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import Paragraph from "./components/Paragraph";

function App() {
  const [paragraph, setParagraph] = useState();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTypedWord, setCurrentTypedWord] = useState("");
  const [correctIndices, setCorrectIndices] = useState([]);

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

  const currentWord = words?.[currentWordIndex];

  const incrementWordIndex = () => setCurrentWordIndex(currentWordIndex + 1);

  const handleTyping = (event) => {
    const key = event.key;
    if (key === " ") {
      if (currentTypedWord === currentWord) {
        setCorrectIndices([...correctIndices, currentWordIndex]);
      }
      setCurrentTypedWord("");
      incrementWordIndex();
    } else if (key === "Backspace") {
      const chars = currentTypedWord.split("");
      chars.pop();
      setCurrentTypedWord(chars.join(""));
    } else {
      setCurrentTypedWord(currentTypedWord + key);
    }
  };

  const start = () => {
    loadParagraph?.(setParagraph);
    setTimerOn(true);
  };

  const stop = () => {
    setTimerOn(false);
    setIntervalId(null);
    setTimer(60);
    setParagraph("");
    setCurrentTypedWord("");
    setCurrentWordIndex(0);
    setCorrectIndices([]);
  };

  const isWordCorrect = (index) => correctIndices.includes(index);

  const loadParagraph = window.electronAPI?.loadParagraph;
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
              Correct: {correctIndices.length}
            </Col>
            <Col md={3} className="my-3 mt-5 mb-0 p-0 fw-bold fs-4 text-danger">
              Incorrect: {currentWordIndex - correctIndices.length}
            </Col>
            <Col md={1} className="my-3 mt-5 mb-0 p-0 fw-bold fs-4">
              {timer}
            </Col>
          </>
        }
      </Row>

      {!!words?.length && (
        <>
          <Row>
            <Col
              md={8}
              className="border p-3 m-3 rounded overflow-auto"
              style={{ height: "300px" }}
            >
              {words.map((word, index) =>
                index === currentWordIndex ? (
                  <strong key={index}>{word} </strong>
                ) : (
                  <span
                    key={index}
                    className={`${
                      isWordCorrect(index)
                        ? "text-success fw-bold"
                        : index < currentWordIndex
                        ? "text-danger fw-bold"
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
