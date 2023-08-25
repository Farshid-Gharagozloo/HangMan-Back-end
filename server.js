const express = require("express");
const app = express();
const wordsRoutes = require("./routes/words");

const cors = require("cors");


app.use(cors());

const port = process.env.PORT || 8080;
app.use(express.static('public'));
// app.use(cors( { origin: process.env.CORS_ORIGIN }));

const wordsArray = require("./data/words.json");
app.use(express.json());

app.use("/words", wordsRoutes);

app.get("/random", (req, res, next) => {
    const random = Math.floor(Math.random() * wordsArray.length);
    res.send(wordsArray[random]);
  });


app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});


