import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Paragraph = ({ words = [], currentWordIndex = 0 }) => (
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
          <span key={index}>{word} </span>
        )
      )}
    </Col>
  </Row>
);

export default Paragraph;
