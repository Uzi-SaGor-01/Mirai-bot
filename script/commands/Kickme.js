module.exports.config = {
    name: "kickme",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "Kick yourself from the group",
    commandCategory: "services",
    usages: "If you are admin and want this command to work, simply make the bot an admin",
    cooldowns: 3
}; 

module.exports.run = async function({ api, event, args }) {
    var info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('Make me admin first!', event.threadID, event.messageID);

    var threadInfo = await api.getThreadInfo(event.threadID);
    
    api.removeUserFromGroup(event.senderID, event.threadID);
    
    api.sendMessage(`Your request is done!`, event.threadID);
}
