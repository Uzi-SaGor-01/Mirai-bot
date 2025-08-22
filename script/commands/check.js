const axios = require("axios");
module.exports.config = {
	name: "calculate",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "SaGor",
	description: "Bot utility commands for statistics and info",
	commandCategory: "services",
	usages: "calculate [option]",
	cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.run = async ({ args, api, event, Currencies, client }) => {
   const { threadID, senderID, messageID, type, mentions } = event;
   const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Baghdad").format("HH:mm:ss")
   if (args.length == 0) return api.sendMessage(`     ===  Calculate  === \n----------------\n[💌] => calculate uptime => shows bot uptime\n----------------\n[💌] => calculate my messages => counts your messages or the person you replied to\n----------------\n[💌] => calculate groups => counts the number of groups the bot is in\n----------------\n[💌] => calculate all => counts top active users\n----------------\n[💌] => calculate covid => shows global covid cases\n----------------\n----------------\n        === 「${timeNow}」 ===`, event.threadID, event.messageID);

    var arr = [];
    var mention = Object.keys(event.mentions);
    const data = await api.getThreadInfo(event.threadID);

    if (args[0] == "ndfb") { // kick users with undefined gender
        const find = data.adminIDs.find(el => el.id == event.senderID && api.getCurrentUserID());
        if (!find) return api.sendMessage(`[💌] => You must be an admin to use this command!`, event.threadID);

        let storage = [];
        for (const value of data.userInfo) storage.push({"id" : value.id, "gender": value.gender});
        for (const user of storage) {
            if (user.gender == undefined) api.removeUserFromGroup(user.id, event.threadID)
        }
        return;
    } else if (args[0] == "del") { // remove members by message count
        const find = data.adminIDs.find(el => el.id == event.senderID && api.getCurrentUserID());
        if (!find) return api.sendMessage(`You must be an admin to use this command!`, event.threadID);
        if (!args[1]) return api.sendMessage(`[💌] => Usage: calculate del [message count]`, event.threadID);

        let storage = [];
        for (const value of data.userInfo) storage.push({"id" : value.id, "name": value.name});
        for (const user of storage) {
            const countMess = (await Currencies.getData(user.id)).exp;
            if (typeof countMess == "undefined") await Currencies.setEXP(mention, parseInt(0))
            if (countMess <= args[1]) setTimeout(function() { api.removeUserFromGroup(user.id,event.threadID) }, 2000);
        }
        return;
    } else if (args[0] == "covid") { // global covid statistics
        const axios_1 = require("axios");
        const moment = require("moment-timezone");
        var time = moment.tz("Asia/Baghdad").format("YYYY");
        let fetchdata = await axios_1.get("https://static.pipezero.com/covid/data.json");
        var jsondata = (await fetchdata.data).total;
        var iq = (await fetchdata.data).overview[6];
        var year = iq.date + '-' + time;
        var world = jsondata.world,
            nhiemtg = world.cases,
            chettg = world.death,
            hoiphuctg = world.recovered,
            nhiemvn = iq.cases,
            chetvn = iq.death,
            hoiphucvn = iq.recovered,
            dieutrivn = iq.treating,
            nhiemvn7days = iq.avgCases7day,
            hoiphucvn7days = iq.avgRecovered7day,
            chetvn7days = iq.avgDeath7day,
            ptchetvn = Math.round((chetvn * 100) / nhiemvn),
            pthoiphucvn = Math.round((hoiphucvn * 100) / nhiemvn),
            ptchettg = Math.round((chettg * 100) / nhiemtg),
            pthoiphuctg = Math.round((hoiphuctg * 100) / nhiemtg),
            pthoiphucvn = pthoiphucvn.toString().split(".")[0],
            ptdieutrivn = (100 - pthoiphucvn - ptchetvn).toString().split(".")[0];
        ptchetvn = ptchetvn.toString().split(".")[0];
        pthoiphuctg = pthoiphuctg.toString().split(".")[0];
        ptchettg = ptchettg.toString().split(".")[0];
        return api.sendMessage(
            "====== Global Covid Cases ======\n\n" +
            `😷 Cases: ${nhiemtg}\n\n` +
            `💚 Recovered: ${hoiphuctg} (${pthoiphuctg}%)\n\n` +
            `💀 Deaths: ${chettg} (${ptchettg}%)\n\n` +
            `Date: ${year}`,
            event.threadID, event.messageID
        );
    } else if (args[0] == "groups") {
        if (event.senderID != 1661725739) return api.sendMessage(`You do not have permission`, event.threadID, event.messageID)
        let number = [];
        api.getThreadList(50, null, ["INBOX"], (err, list) => getInfo({ list }))
        api.getThreadList(50, null, ["OTHER"], (err, list) => getInfo({ list }))
        api.getThreadList(50, null, ["PENDING"], (err, list) => getInfo({ list }))
        api.getThreadList(50, null, ["unread"], (err, list) => getInfo({ list }))
        var getInfo = ({ list }) => {
            list.forEach(info => {
                if (info.name == "" || info.participants < 8 || info.imageSrc == null) { 
                    number.push(info);
                    api.removeUserFromGroup(api.getCurrentUserID(),info.threadID);
                    api.deleteThread(info.threadID, (err) => {
                        Threads.delData(info.threadID)
                        if(err) return console.error(err);
                    });
                }
            })
        }
        return api.sendMessage(`[👻] => Removing unnamed groups or groups with less than 4 members.`, threadID)
    } else if (args[0] == "uptime") {
        let time = process.uptime();
        let hours = Math.floor(time / (60 * 60));
        let minutes = Math.floor((time % (60 * 60)) / 60);
        let seconds = Math.floor(time % 60);
        return api.sendMessage(`Bot Uptime: ${hours}:${minutes}:${seconds}`, event.threadID, event.messageID);
    } else if (args[0] == "all") {
        let threadInfo = await api.getThreadInfo(event.threadID);
        let number = 0, msg = "", storage = [], exp = [];
        for (const value of data.userInfo) storage.push({"id" : value.id, "name": value.name});
        for (const user of storage) {
            const countMess = await Currencies.getData(user.id);
            if (user.name != null) exp.push({"name" : user.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp});
        }
        exp.sort((a, b) => {
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
        });
        let rank = exp.findIndex(info => parseInt(info.uid) == parseInt(`${(event.type == "message_reply") ? event.messageReply.senderID : event.senderID}`)) + 1;
        let infoUser = exp[rank - 1];
        for (const lastData of exp) {
            number++;
            msg += `${number}. ${(lastData.name) == null || undefined  ? "No name" : lastData.name} - ${lastData.exp} messages \n•---------------------------•\n`;
        }
        return api.sendMessage(`💞 Member messages info 💞\n\n` + msg +`\n» 💹 Group activity rate: ${(exp[rank].exp).toFixed(0)}%\n» 💬 Total messages: ${threadInfo.messageCount}\n» 📌 Total messages since bot joined 💌\n⏰=== 「${timeNow}」 ===⏰\n`, threadID, messageID);
    } else if (args[0] == "mymessages") {
        let storage = [], exp = [];
        for (const value of data.userInfo) storage.push({"id" : value.id, "name": value.name});
        for (const user of storage) {
            const countMess = await Currencies.getData(user.id);
            exp.push({"name" : user.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp, "uid": user.id});
        }
        exp.sort((a, b) => {
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
        });
        let rank = exp.findIndex(info => parseInt(info.uid) == parseInt(`${(event.type == "message_reply") ? event.messageReply.senderID : event.senderID}`)) + 1;
        let infoUser = exp[rank - 1];
        return api.sendMessage(`✓ Your messages ⇜ ${infoUser.exp} `+`\n ✓ Your rank in the group ⇜ ${rank} `, event.threadID,event.messageID);
    }
};
