module.exports.config = {
	name: "ban",
	version: "2.0.5",
	hasPermssion: 1,
	credits: "SaGor",
	description: "Prevent any member from rejoining the group",
	commandCategory: "group admin",
	usages: "@/all/me/list/view/unban/reset",
	cooldowns: 5,
	info: [
		{
			key: '[tag] or [reply message] "reason"',
			prompt: '1 more warning user',
			type: '',
			example: 'ban [tag] "reason for warning"'
  		},

		{
			key: 'listban',
			prompt: 'see the list of users banned from the group',
			type: '',
			example: 'ban listban'
  		},

		{
			key: 'unban',
			prompt: 'remove the user from the list of banned groups',
			type: '',
			example: 'ban unban [id of user to delete]'
  		},
		{
			key: 'view',
			prompt: '"tag" or "blank" or "view all", respectively used to see how many times the person tagged or yourself or a member has been warned ',
			type: '',
			example: 'ban view [@tag] / warns view'
  		},

		{
			key: 'reset',
			prompt: 'Reset all data in your group',
			type: '',
			example: 'ban reset'
  		}

  		]
};

module.exports.run = async function({ api, args, Users, event, Threads, utils, client }) {
	let {messageID, threadID, senderID} = event;
	var info = await api.getThreadInfo(threadID);
	if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage('Make the bot admin to use this command \n Please add it and try again!', threadID, messageID);
	var fs = require("fs-extra");
	
	if (!fs.existsSync(__dirname + `/cache/bans.json`)) {
			const dataaa = {warns: {}, banned: {}};
			fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(dataaa));
	}
  var bans = JSON.parse(fs.readFileSync(__dirname + `/cache/bans.json`)); //read file contents

  if(!bans.warns.hasOwnProperty(threadID)) {
			bans.warns[threadID] = {}; 
			fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
  }

  if(args[0] == "view") {
  	if(!args[1]) {
  		var msg = "";
  		var mywarn = bans.warns[threadID][senderID];
  		if(!mywarn) return api.sendMessage('🙂You have not been warned before', threadID, messageID);
  		for(let reasonwarn of mywarn) {
  			msg += `reasonwarn\n`;
  		}
  		api.sendMessage(`🙃You have been warned before. Reason: ${msg}`, threadID, messageID);
  	}
  	else if(Object.keys(event.mentions).length != 0) {
  		var message = "";
  		var mentions = Object.keys(event.mentions);
  		for(let id of mentions) {
  			var name = (await api.getUserInfo(id))[id].name;
  			var msg = "";
  			var reasonarr = bans.warns[threadID][id];
  			if(typeof reasonarr != "object") {
  				msg += " Not warned before\n"
  			} else {
  				for(let reason of reasonarr) {
  					msg += ""+reason+"\n";
  				}
  			}
  			message += "👀"+name+" :"+msg+"";
  		}
  		api.sendMessage(message, threadID, messageID);
  	}
  	else if(args[1] == "all") {
  		var dtwbox = bans.warns[threadID];
  		var allwarn = "";
  		for(let idtvw in dtwbox) {
  			var name = (await api.getUserInfo(idtvw))[idtvw].name, msg = "";
  			for(let reasonwtv of dtwbox[idtvw]) {
  				msg += `${reasonwtv}`
  			}
  			allwarn += `${name} : ${msg}\n`;
  		}
  		allwarn == "" ? api.sendMessage("🙂No one has been warned in this group yet", threadID, messageID) : api.sendMessage("Here is the list of warned members in the group:\n"+allwarn, threadID, messageID);
  	}
  }
  else if(args[0] == "unban") {
  	var id = parseInt(args[1]), mybox = bans.banned[threadID];
  	var info = await api.getThreadInfo(threadID);
	if (!info.adminIDs.some(item => item.id == senderID) && !(global.config.ADMINBOT).includes(senderID)) return api.sendMessage('🙂!', threadID, messageID);
	
  	if(!id) return api.sendMessage("🙃You need to provide the user ID to remove from the banned list in this group", threadID, messageID);
  	if(!mybox.includes(id)) return api.sendMessage("🙂This user has not been banned in your group yet", threadID, messageID);
			api.sendMessage(`🙂Removed ${id} from the banned list`, threadID, messageID);
			mybox.splice(mybox.indexOf(id), 1);
			delete bans.warns[threadID][id]
			fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
  }
  else if(args[0] == "list") {
  	var mybox = bans.banned[threadID];
  	var msg = "";
  	for(let iduser of mybox) {
  		var name = (await api.getUserInfo(iduser))[iduser].name;
  		msg += "╔Name: " + name + "\n╚ID: " + iduser + "\n";
  	}
  	msg == "" ? api.sendMessage("🙂No one has been banned in this group yet", threadID, messageID) : api.sendMessage("🙃Here is the list of banned members:\n"+msg, threadID, messageID);
  }
  else if(args[0] == "reset") {
  	var info = await api.getThreadInfo(threadID);
	if (!info.adminIDs.some(item => item.id == senderID) && !(global.config.ADMINBOT).includes(senderID)) return api.sendMessage('🙃You are not allowed!', threadID, messageID);
  	
  	bans.warns[threadID] = {};
  	bans.banned[threadID] = [];
  	fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
  	api.sendMessage("All data in your group has been reset!", threadID, messageID);
  }
  else { 
  	if (event.type != "message_reply" && Object.keys(event.mentions).length == 0)	return utils.throwError(this.config.name, threadID, messageID);
   
    var info = await api.getThreadInfo(threadID);
	if (!info.adminIDs.some(item => item.id == senderID) && !(global.config.ADMINBOT).includes(senderID)) return api.sendMessage('You are not allowed!', threadID, messageID);
  
  	var reason = "";
	if (event.type == "message_reply") {
		var iduser = [];
		iduser.push(event.messageReply.senderID);
		reason = (args.join(" ")).trim();
	} else if (Object.keys(event.mentions).length != 0) {
		var iduser = Object.keys(event.mentions);
		var nametaglength = (Object.values(event.mentions)).length;
		var namearr = Object.values(event.mentions);
		var message = args.join(" ");
		for(let valuemention of namearr) {
			message = message.replace(valuemention,"");
		}
		reason = message.replace(/\s+/g, ' ');
	}

	var arraytag = [];
	var arrayname = [];
	for(let iid of iduser) {
		var id = parseInt(iid);
		var nametag = (await api.getUserInfo(id))[id].name;
		arraytag.push({id: id, tag: nametag});
			
		if(!reason) reason += "No reason provided";
		var dtwmybox = bans.warns[threadID];
		if(!dtwmybox.hasOwnProperty(id)) { 
			dtwmybox[id] = [];
		}
		arrayname.push(nametag);
		var pushreason = bans.warns[threadID][id];
		pushreason.push(reason);
		if(!bans.banned[threadID]) {
			bans.banned[threadID] = [];
		}
		if((bans.warns[threadID][id]).length > 0) {
			api.removeUserFromGroup(parseInt(id), threadID)
			var banned = bans.banned[threadID];
			banned.push(parseInt(id));
			fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
		}
	}

	api.sendMessage({body: `Banned ${arrayname.join(", ")} for reason: ${reason}`, mentions: arraytag}, threadID, messageID);
	fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
  }
};
