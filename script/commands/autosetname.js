module.exports.config = {
    name: "nickname",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "Omar",
    description: "Sets a nickname for any new member",
    commandCategory: "group_admin",
    usages: "[add <name> / remove]",
    cooldowns: 5
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async function  ({ event, api, args, permssionm, Users })  {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "autosetname.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
    switch (args[0]) {
        case "add": {
            if (content.length == 0) return api.sendMessage("Cannot leave nickname section empty!", threadID, messageID);
            if (thisThread.nameUser.length > 0) return api.sendMessage("Please remove the old nickname before setting a new one!", threadID, messageID); 
            thisThread.nameUser.push(content);
            const name = (await Users.getData(event.senderID)).name
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(`Successfully saved automatic nickname for new members\nPreview: ${content}\nNickname creator: ${name}`, threadID, messageID);
            break;
        }
        case "remove": {
                if (thisThread.nameUser.length == 0) return api.sendMessage("Your group hasn't set up a nickname for new members yet!", threadID, messageID);
                thisThread.nameUser = [];
                api.sendMessage(`Nickname removed successfully`, threadID, messageID);
                break;
        }
        default: {
                api.sendMessage(`Usage: nickname add <name> to set nickname for new members\nUsage: nickname remove to remove nickname for new members`, threadID, messageID);
        }
    }
    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
