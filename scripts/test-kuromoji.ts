import kuromoji from "kuromoji";
import path from "path";

const dictPath = path.join(process.cwd(), "node_modules", "kuromoji", "dict");

kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
  if (err) {
    console.error(err);
    return;
  }
  const text = "夜に駆ける";
  const tokens = tokenizer.tokenize(text);
  const reading = tokens.map(t => t.reading || t.surface_form).join("");
  // kuromoji reading is in Katakana, so we might need to convert it to Hiragana or just use Katakana for both
  console.log(`Original: ${text}`);
  console.log(`Reading (Katakana): ${reading}`);
});
