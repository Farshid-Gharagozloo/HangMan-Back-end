const express = require('express');
const router = express.Router();
const fs = require('fs');

const filepath = "./data/words.json";

const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


function getword(selectedid) {
    const words = fs.readFileSync(filepath);
    const wordsList = JSON.parse(words);
    const selectedword = wordsList.filter((word) => {
        return Number(word.id) === selectedid;
    })
    return selectedword;
}   

function getWordsList (){
    const words = fs.readFileSync(filepath);
    const wordsList = JSON.parse(words);
    return wordsList;
}


function setWord (newlist) {
    fs.writeFileSync(filepath, JSON.stringify(newlist));
}


router
    .route("/:id")
    .get((req, res) => {
        const requestedId = Number(req.params.id);
        const selectedWord = getword(requestedId);

        return res.json(selectedWord);

    });


router
    .route("/")
    .get((req, res) => {
        return res.json(getWordsList ())
    })
    .post (upload.single('image'), (req, res) => {

        if (!req.body.word || !req.file.filename) {
            return res.status(400).json({
                error: `Missing required fields`
            })
        }

        const image_url = 'http://localhost:8080/images/' + String(req.file.filename);

        listOfWords = getWordsList();
        const newword = {
            id : (listOfWords.length),
            name : req.body.word,
            image : image_url
        }


        for (let i=0; i<listOfWords.length; i++){
            if (listOfWords[i].name === newword.name){
                return res.status(400).json({
                    error: `This data is already added`
                });
            }
        }


        listOfWords.push(newword);
        setWord(listOfWords);

        res.status(201).json(listOfWords);
    });

module.exports = router;