
const Startup = require("./src/startup-engine");
const express = require("express");

let app = express();

function searchArgV(str){
    for(let i = 0; i < process.argv.length; i++){
        if(process.argv[i] === str){
            return process.argv[i+1];
        }
    }
}

let API_KEY = process.env["TRIE_APIKEY"] || "abc123";
let PORT = parseInt(process.env["TRIE_PORT"] || 8882)
let LOGFILE = process.env["TRIE_LOG_PATH"] || "./index.log";

let patricia = new Startup(LOGFILE);

let middleware = (req, res, next) => {
    const {apiKey} = req.query;
    if(apiKey === API_KEY){
        next();
        return;
    }
    res.status(401).send();
}
app.use(express.text());
app.put("/add/:tag", middleware, (req, res) => {
    const {tag} = req.params;
    const url = req.body;

    if(url === undefined){
        res.status(400).send();
        return;
    }
    let result = patricia.addIfMissing(tag, url);
    res.json(result);
})

app.delete("/delete/:tag", middleware, (req, res) => {
    const {tag} = req.params;
    const url = req.body;
    if(url === undefined){
        res.status(400).send();
        return;
    }
    let result = patricia.remove(tag, url);
    res.json(result);
})

app.get("/search/:tag", middleware, (req, res) => {
    const tag = req.params.tag;
    const values = patricia.search(tag);
    res.json(values);
})

app.listen(PORT, (e) => {
    if(e){
        console.log(e);
    } else {
        console.log(`App started on port ${PORT}`);
    }

});
