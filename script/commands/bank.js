module.exports.config = {
	name: "bank",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "SaGor",
	description: "",
	commandCategory: "money",
	usages: "deposit/withdraw/check/register",
	cooldowns: 0,
	dependencies: {
		"fs-extra": "",
		"request": "",
		"axios": ""
	}, 
	envConfig: {
		APIKEY: "chinhdz"
	}  
};

module.exports.onLoad = async () => {
	const { existsSync, writeFileSync, mkdirSync } = require("fs-extra")
	const { join } = require("path")
	const axios = require("axios");
	const dir = __dirname + `/banking`;
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	const pathData = join(__dirname + '/banking/banking.json');
	if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
	return;
}

module.exports.run = async function({ api, event, args, models, Users, Threads, Currencies, permssion }) {
	const { threadID, messageID, senderID } = event;
	const axios = require("axios")
	const { readFileSync, writeFileSync } = require("fs-extra")
	const { join } = require("path")
	const pathData = join(__dirname + '/banking/banking.json');
	const user = require('./banking/banking.json');
	const timeIM = 60*60
	const interestRate = 0.05
	const moneyInput = parseInt(args[1])

	if(args[0] == 'register') {
		if (!user.find(i => i.senderID == senderID)) {
			var add = { senderID: senderID,  money: 0 }
			user.push(add);
			writeFileSync(pathData, JSON.stringify(user, null, 2));
			return api.sendMessage(`[Sista Bank] » You have successfully registered.\nDeposit at least $200 to start earning profits 💰`, threadID, messageID)
		}
		else return api.sendMessage(`[Sista Bank] » You already have an account 🏦`, threadID, messageID)
	}

	if(args[0] == 'check') {
		if (!user.find(i => i.senderID == senderID)) return api.sendMessage('[Sista Bank] » You are not registered, please register first 🏦', threadID, messageID)
		else { 
			var userData = user.find(i => i.senderID == senderID);
			return api.sendMessage(`[Sista Bank] » Your current balance is: ${userData.money}$\n\n💷 Interest: +${interestRate*100}% every ${timeIM/60} minutes`, threadID, messageID)
		}
	} 

	if(args[0] == 'deposit') {
		if (!args[1] || isNaN(args[1]) || parseInt(args[1]) < 50) return api.sendMessage("[Sista Bank] » Deposit must be a number greater than $50 💰", threadID, messageID);
		if (!user.find(i => i.senderID == senderID)) {
			return api.sendMessage('[Sista Bank] » Type (bank register) to create an account 💰', threadID, messageID)
		}
		else { 
			let balance = (await Currencies.getData(senderID)).money;
			if(balance < moneyInput) return api.sendMessage(`[Sista Bank] » Insufficient funds ${moneyInput}$ for deposit 💰`, threadID, messageID)
			var userData = user.find(i => i.senderID == senderID);
			userData.money = parseInt(userData.money) + parseInt(moneyInput)
			writeFileSync(pathData, JSON.stringify(user, null, 2));
			await Currencies.decreaseMoney(senderID, parseInt(moneyInput));
			return api.sendMessage(`[Sista Bank] » You deposited ${moneyInput}$ successfully.\n💷 Interest: +${interestRate*100}% every ${timeIM/60} minutes`, threadID, messageID)
		}
	}

	if(args[0] == 'withdraw') { 
		if (!args[1] || isNaN(args[1]) || parseInt(args[1]) < 50) return api.sendMessage("[Sista Bank] » You must enter a number greater than $50.", threadID, messageID);
		if (!user.find(i => i.senderID == senderID)) {
			return api.sendMessage('[Sista Bank] » Type (bank register) to create an account 💰', threadID, messageID)
		}
		else {  
			var userData = user.find(i => i.senderID == senderID); 
			if(parseInt(userData.money) < parseInt(moneyInput)) return api.sendMessage('[Sista Bank] » Insufficient balance!', threadID, messageID)
			else {
				await Currencies.increaseMoney(senderID, parseInt(moneyInput));
				userData.money = parseInt(userData.money) - parseInt(moneyInput)
				writeFileSync(pathData, JSON.stringify(user, null, 2));
				return api.sendMessage(`[Sista Bank] » Withdrawn ${parseInt(moneyInput)}$ successfully.\nRemaining balance: ${userData.money}$`, threadID, messageID)
			}
		}
	}
	else return api.sendMessage(`=====🏦 Sista Bank 🏦=====\n\n[bank register] - Register to deposit money 💹\n[bank check] - Check balance 💳\n[bank deposit] - Deposit money 💷\n[bank withdraw] - Withdraw money\n\n💲 Current interest rate: +${interestRate*100}% per ${timeIM/60} minutes`, threadID, messageID)
}
