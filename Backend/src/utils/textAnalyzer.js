import natural from "natural";

const analyzerText = (text) => {
  if (!text || typeof text !== "string") {
    throw new TypeError("Invalid input: Text must be a non-empty string.");
  }

  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text).length;

  return {
    originalText: text, // Keep the original structure
    wordCount: words, // Provide a word count
  };
};

export { analyzerText };