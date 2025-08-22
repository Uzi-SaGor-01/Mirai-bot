module.exports.config = {
    name: "death",
    version: "1.1.2",
    hasPermssion: 0,
    credits: "Omar",
    description: "Fake death method generator",
    commandCategory: "fun",
    usages: "a",
    cooldowns: 1,
};

module.exports.handleEvent = function ({ api, event }) {
    const { commands } = global.client;

    if (!event.body) return;

    const { threadID, messageID, body } = event;

    if (!body.startsWith("askme")) return;

    const splitBody = body.slice(body.indexOf("askme")).trim().split(/\s+/);

    if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());

    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    return api.sendMessage(
        `⚔️ ${command.config.name} ⚔️\n${command.config.description}\n\n❯ Usage: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Category: ${command.config.commandCategory}\n❯ Cooldown: ${command.config.cooldowns} second(s)\n❯ Permission: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin" : "Bot Operator")}\n❯ Prefix: ${prefix}\n\n» Module code by ${command.config.credits} «`,
        threadID,
        messageID
    );
};

module.exports.run = async function({ api, args, event }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};

    if (!command) {
        const randomYear = Math.floor(Math.random() * 30) + 2023;
        const randomMonth = Math.floor(Math.random() * 12) + 1;

        const causes = [
            "Malaria", "Suicide", "Tuberculosis", "Diabetes", "Car accident", "Liver cancer",
            "Leukemia", "Fall from height", "Skin infection", "Burns", "Liver cirrhosis", "Drowning",
            "Murder", "COVID-19", "Chronic pulmonary obstruction", "AIDS", "Medical error",
            "Fall from mountain", "Stray bullet", "Exposure to toxic gases", "Lung cancer",
            "Starvation", "Sudden death", "Choking", "Car explosion", "Radiation exposure", "Earthquake", "Arsenic poisoning"
        ];

        const randomCause = causes[Math.floor(Math.random() * causes.length)];

        const deathMessage = `Your cause of death ← ${randomCause} \n\nDate of death ← ${Math.floor(Math.random() * 30)}/${randomMonth}/${randomYear}.`;

        return api.sendMessage(deathMessage, threadID, messageID);
    }

    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    return api.sendMessage(
        `⚔️ ${command.config.name} ⚔️\n${command.config.description}\n\n❯ Usage: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Category: ${command.config.commandCategory}\n❯ Cooldown: ${command.config.cooldowns} second(s)\n❯ Permission: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin" : "Bot Operator")}\n❯ Prefix: ${prefix}\n\n» Module code by ${command.config.credits} «`,
        threadID,
        messageID
    );
};
