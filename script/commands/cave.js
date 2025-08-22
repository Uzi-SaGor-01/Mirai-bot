/*
@credit Trankhuong
@modified credit
*/
const fs = require("fs");
module.exports.config = {
    name: "cave",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "SaGor",
    description: "Work in a cave in a country and earn money",
    commandCategory: "MONEY",
    cooldowns: 2000000000,
    envConfig: {
        cooldown: 2000000000
    },
    denpendencies: {
        "fs": "",
        "request": ""
    }
};
module.exports.languages = {
    "vi": {
        "cooldown": "⚡️You have already worked, come back in %1 minutes %2 seconds."      
    },
    "en": {
        "cooldown": "Come back in: %1 minutes and %2 seconds."
    }
}
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/cache/`;
    if (!fs.existsSync(dirMaterial + "cache")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "cave.jpg")) request("https://i.postimg.cc/N0D5CTrg/Picsart-22-07-11-15-11-59-573.png").pipe(fs.createWriteStream(dirMaterial + "cave.jpg"));
}

module.exports.handleReply = async ({ 
    event:e, 
    api, 
    handleReply, 
    Currencies }) => {
    const { threadID, messageID, senderID } = e;
    let data = (await Currencies.getData(senderID)).data || {};
    if (handleReply.author != e.senderID) 
        return api.sendMessage("- Sit back, this is not your work!", e.threadID, e.messageID)

    var a = Math.floor(Math.random() * 5000) + 900; 
    var b = Math.floor(Math.random() * 5000) + 800; 
    var c = Math.floor(Math.random() * 5000) + 700; 
    var x = Math.floor(Math.random() * 5000) + 600; 
    var y = Math.floor(Math.random() * 5000) + 500; 
    var f = Math.floor(Math.random() * 5000) + 400; 

    var msg = "";
    switch(handleReply.type) {
        case "choosee": {
            switch(e.body) {
                case "1": msg = `You worked in caves in Vietnam and earned ${a}$`;
                await Currencies.increaseMoney(e.senderID, parseInt(a)); 
                break;             
                case "2": msg = `You worked in caves in China and earned ${b}$`; 
                await Currencies.increaseMoney(e.senderID, parseInt(b)); 
                break;
                case "3": msg = `You worked in caves in Japan and earned ${c}$`; 
                await Currencies.increaseMoney(e.senderID, parseInt(c)); 
                break;
                case "4": msg = `You worked in caves in Thailand and earned ${x}$`; 
                await Currencies.increaseMoney(e.senderID, parseInt(x)); 
                break;
                case "5": msg = `You worked in caves in the USA and earned ${y}$`; 
                await Currencies.increaseMoney(e.senderID, parseInt(y)); 
                break;
                case "6": msg = `You worked in caves in Cambodia and earned ${f}$`; 
                await Currencies.increaseMoney(e.senderID, parseInt(f)); 
                break;
                default: break;
            };
            const choose = parseInt(e.body);
            if (isNaN(e.body)) 
                return api.sendMessage("⚡Which country do you want to work in the cave?", e.threadID, e.messageID);
            if (choose > 6 || choose < 1) 
                return api.sendMessage("⚡You must choose a number between 1 and 6!", e.threadID, e.messageID); 
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`${msg}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        };
    }
}

module.exports.run = async ({  
    event:e, 
    api, 
    handleReply, 
    Currencies }) => {
    const { threadID, messageID, senderID } = e;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        return api.sendMessage(`⚡You have just worked in the cave, take a rest before working again!`, e.threadID, e.messageID);
    } else {    
        var msg = {
            body: "========== CAVE =========="+`\n`+
                "\n1 ≻ Vietnam" +
                "\n2 ≻ China" +
                "\n3 ≻ Japan" +
                "\n4 ≻ Thailand" +
                "\n5 ≻ USA" +
                "\n6 ≻ Cambodia" +
                `\n\n📌Reply with the number to work in a country!`,
                attachment: fs.createReadStream(__dirname + `/cache/cave.jpg`)
        }
        return api.sendMessage(msg,e.threadID,  (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: e.senderID,
                messageID: info.messageID
            })  
        })
    }
}
