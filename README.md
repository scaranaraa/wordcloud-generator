# wordcloud-generator
 A wordcloud generator for nodejs

## Installation
### npm
```bash
npm install wordcloud-generator
```

### yarn
```bash
yarn add wordcloud-generator
```

## Examples

![alt text](examples/wordcloud.png)

## Usage

### String
```js
import {generate} from "wordcloud-generator";

const wordstring = "The quick brown fox jumps over the lazy dog";
await generate(wordstring, true, "wordcloud.png")
```

### Array of words
```js
import {generate} from "wordcloud-generator";

const words = ["word1", "word2", "word3"];
await generate(words, true, "wordcloud.png")
```

### Map of strings and frequencies
```js
import {generate} from "wordcloud-generator";

const words = {
  "word1": 10,
  "word2": 20,
  "word3": 30,
};
await generate(words, true, "wordcloud.png")
```
