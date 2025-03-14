const PatriciaTrie = require("./patricia");
const fs = require("fs");
class Startup{
    constructor(eventAppendFile){
        this.log = eventAppendFile;
        this.patriciaTrie = new PatriciaTrie();
        this.onStartup();
    }

    addIfMissing(tag, url, skipAppend){
        if(tag.indexOf("*") !== -1){
            return false;
        }
        const isAdded = this.patriciaTrie.addIfMissing(encodeURIComponent(tag), encodeURIComponent(url));

        if(isAdded && !skipAppend){
            fs.appendFile(this.log, `add ${encodeURIComponent(tag)} ${encodeURIComponent(url)}\n`, () =>{});
        }

        return isAdded;
    }

    search(tag){
        let results = this.patriciaTrie.search(encodeURIComponent(tag));

        if(results && results.length > 0){
            return results.map(decodeURIComponent);
        }

        return [];
    }

    remove(tag, url, skipAppend){
        const isRemoved = this.patriciaTrie.remove(encodeURIComponent(tag), encodeURIComponent(url));

        if(isRemoved && !skipAppend){
            fs.appendFile(this.log, `remove ${encodeURIComponent(tag)} ${encodeURIComponent(url)}\n`, () => {});
        }

        return isRemoved;
    }

    getAllTags(){
        return this.patriciaTrie.getAllTags().map(decodeURIComponent);
    }

    onStartup(){
        let data = fs.readFileSync(this.log, "utf8");
        
        data.split("\n").map((d) => {
            let [operation, tag, url] = d.split(" ");
            if(operation === "add"){
                this.addIfMissing(decodeURIComponent(tag), decodeURIComponent(url), true);
            } else {
                this.remove(decodeURIComponent(tag), decodeURIComponent(url), true);
            }
        })
    }
}

module.exports = Startup;