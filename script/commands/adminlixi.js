    module.exports.config = {
    name: "gift",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "يعطيك هدية بمبلغ عشوائي",
    commandCategory: "الاموال",
    usages: "",
    cooldowns: 5
    };
    var array = [];
    module.exports.run = async function ({ api,event,Users,Currencies,args }) {
    var x = global.data.allCurrenciesID;var out = (msg) => api.sendMessage(msg,event.threadID,event.messageID);
        let ix = ["500","1000","1050","1600","1000","1","1000","1000","1400","1581","1980","9910","169","69","69","699","4231","5482","1581","1510","100000"];
            let rxx = ix[Math.floor(Math.random() * ix.length)]; 
                let rxxi = global.data.allThreadID;var xs = false;
                    var mention = Object.keys(event.mentions);
                    switch (args[0]) {
                        case 'all': {
                            if (xs == true) return out("Red envelopes");
                            for (let ex of x) {
                                await Currencies.increaseMoney(ex, parseInt(rxx));
                                    array.push(ex);
                            }
                            for (let exs of rxxi) {
                                api.sendMessage(``,exs,(error,info) => {
                                    if (error) return;
                                });
                            }
                                xs = true;
                            return api.sendMessage("It was completed !",event.threadID);
                        }
                            break;
                        case "user": {
                            if (xs == true) return out("red envelopes");if(array.includes(args[1])) return out("  !");array.push(args[1]);
                            if (isNaN(args[1])) return api.sendMessage("Please Enter user ID !",event.threadID,event.messageID);
                                await Currencies.increaseMoney(parseInt(args[1]), parseInt(rxx));
                                    out("Successfully recovered !");
                                        return api.sendMessage(" , I got gift money =) , the amount I received is : " +  rxx,parseInt(args[1]));
                        }
                            break;
                        case "thread": {
                            if (isNaN(args[1])) return api.sendMessage("Please enter group ID !",event.threadID,event.messageID);
                                var xl = await api.getThreadInfo(args[1]);
                                    var sll = xl.participantIDs;var outlix = [];
                                        for (let cham of sll) {
                                                if(array.includes(cham)) return outlix.push(cham);
                                            await Currencies.increaseMoney(cham, parseInt(rxx)); 
                                        }
                                    out("Success! The number of people who were not lucky the second time is : " + outlix.join(", "));
                                return api.sendMessage(" =))",parseInt(args[1]));
                        }   
                            break;  
                        case  `${mention[0]}`: {    
                            if (isNaN(mention[0])) return out("An error occurred. =))");array.push(mention[0]);
                            if(array.includes(mention[0])) return out("You got money after you left it !");
                                else await Currencies.increaseMoney(mention[0], parseInt(rxx)); 
                                    return out ("UwU " + event.mentions[mention].replace("@", "") + "I got the gift money 🐧, the amount is :  " + rxx);
                        }
                    break;
                default: {
                        if(array.includes(event.senderID)) return out("You got the money, get out   !");array.push(event.senderID);
                    await Currencies.increaseMoney(event.senderID, parseInt(rxx)); 
                return out("====[ luck ]====\n Congratulations, you got the lucky money, and the amount is  : " + rxx);
            }
        }
    };
