const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { log } = require("console");
const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
app.use(cors({
  origin:["http://localhost:5000/","https://tonytore.github.io/dictionary-frontend/"]
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/:searchWord", (req, res) => {
  const requsetedWord = req.params.searchWord;
  const dictionary = loadDictionary("Oxford_English_Dictionary.txt");
 
  //console.log(dictionary);
  const meaning = getMeaning(requsetedWord, dictionary)
 
  res.json({meaning});
});

app.get("/", (req, res) => {
  //const name = req.body.searchWord
  const dictionary = loadDictionary("Oxford_English_Dictionary.txt");
  const meaning = getMeaning("Impetuous", dictionary);
  // res.render("page1",{originalValue:key,content:meaning})
  res.json({ dictionary });
});

// app.post('/',(req,res)=>{
//   res.send('congrat')
//   console.log(req.body.searchWord);
// })


app.listen(process.env.port, () => {
  console.log(`server is connected on port ${process.env.port || 5000} `);
});

function loadDictionary(filename) {
  const content = fs.readFileSync(filename, "utf8");
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  let dictionary = {};
  let currentWord = "";
  let currentMeaning = "";

  lines.forEach((line) => {
    const parts = line.trim().split(/\s{2,}/);
    if (parts.length === 2) {
      if (currentWord !== "" && currentMeaning !== "") {
        dictionary[currentWord] = currentWord + currentMeaning;
      }

      currentWord = parts[0];
      currentMeaning = parts[1];
    } else if (currentWord !== "") {
      currentMeaning += " " + line.trim();
    }
  });

  return dictionary;
}



function getMeaning(word, dictionary) {
  return dictionary[word] || "Meaning not found.";
}

function getOriginal(word, dictionaryKey) {
  return dictionaryKey[word] || "Meaning not found.";
}

// Usage example
// const dictionary = loadDictionary('sample_dictionary.txt');
// const meaning = getMeaning('Aardvark', dictionary);
// console.log(meaning);
