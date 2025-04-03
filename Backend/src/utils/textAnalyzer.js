import natural from 'natural';

const analyzerText = (text) => {
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text).length;

    return {
        originalText: text,
        wordCount
    };
};

export{
    analyzerText
}