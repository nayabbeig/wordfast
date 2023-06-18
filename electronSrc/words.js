const fs = require("fs");

const wordListPath = require("word-list");

const wordArray = fs.readFileSync(wordListPath, "utf8").split("\n");
console.log(wordArray.length);

const getWords = (numberOfWords = 250) => {
  let count = 0;
  const words = [];
  while (count < numberOfWords) {
    const index = Math.ceil(Math.random() * 100000);
    console.log(index);
    const word = wordArray[index];
    words.push(word);
    count++;
  }

  return words;
};

const getParagraph = () => {
  const words = getWords();
  return words.join(" ");
};

module.exports = {
  getWords,
  getParagraph,
};
