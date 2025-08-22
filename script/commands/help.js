module.exports.config = {
    name: "help",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Sagor",
    description: "Show all commands in a stylish format with numbered permissions",
    commandCategory: "system",
    usages: "",
    cooldowns: 3,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 30
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "📌 『 %1 』\n📖 Description: %2\n📂 Category: %3\n⏱ Cooldown: %4 seconds\n🔑 Permission: %5\n\n✨ Developed by %6",
        "user": "0",
        "adminGroup": "1",
        "adminBot": "2"
    }
};

module.exports.run = async function({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

    if (args[0] && commands.has(args[0].toLowerCase())) {
        const command = commands.get(args[0].toLowerCase());
        let permissionText = "";
        switch(command.config.hasPermssion) {
            case 0: permissionText = getText("user"); break;
            case 1: permissionText = getText("adminGroup"); break;
            case 2: permissionText = getText("adminBot"); break;
            default: permissionText = "?"; break;
        }

        const msg = getText(
            "moduleInfo",
            command.config.name,
            command.config.description,
            command.config.commandCategory,
            command.config.cooldowns,
            permissionText,
            command.config.credits
        );
        return api.sendMessage(msg, threadID, messageID);
    }

    const arrayInfo = Array.from(commands.values()).sort((a,b) => a.config.name.localeCompare(b.config.name));
    let msg = `╔═════「 📜 Command List 」═════╗\n\n`;
    arrayInfo.forEach((cmd, i) => {
        let permissionText = "";
        switch(cmd.config.hasPermssion) {
            case 0: permissionText = getText("user"); break;
            case 1: permissionText = getText("adminGroup"); break;
            case 2: permissionText = getText("adminBot"); break;
            default: permissionText = "?"; break;
        }
        msg += `📌 ${i + 1}. ${prefix}${cmd.config.name} ─ ${permissionText}\n`;
    });
    msg += `\n╚═══════════════════════════╝\n`;
    msg += `Total: ${arrayInfo.length} commands`;

    return api.sendMessage(msg, threadID, async (err, info) => {
        if (autoUnsend) {
            await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
            return api.unsendMessage(info.messageID);
        }
    }, messageID);
};
