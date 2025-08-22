const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "ميري",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "S H A D O W",
  description: "",
  commandCategory: "الــــجـــروب",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Africa/Cairo").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["خويا كون غا زكتي من ميري😺؟", "منو ينادي محبوبه الكل >_<...", "أحبك🤧🖤", " يدك فيه💞🙃 ", "خادمتك فاي وقت 🖤🙁", "سمعتك تنادي علي؟👀", "كنت هموت ملل بدونك 🙃💞", "حبك الاول والاخير🙂🎧"];
  var rand = tl[Math.floor(Math.random() * tl.length)]
var tl2 = ["واش اداك المطور دزب", "شي ما نديروه خاي المطور", "اسير التحوا اخاي المطور متصدعنيش", "محمد بب شبغيتي", "شنو حب الخاطر بب"]
var rand2 = tl2[Math.floor(Math.random() * tl2.length)]
  if ((event.body.toLowerCase() == "ميسي") || (event.body.toLowerCase() == "ميسي")) {
    return api.sendMessage("️منتهي الصلاحية رونالدو عمك  🙃💞", threadID, messageID);
  };
  if ((event.body.toLowerCase() == "احبك") || (event.body.toLowerCase() == "بحبك")) {
    return api.sendMessage("️ محمد حبيبي الوحيد يولد 🤧", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "رونالدو") || (event.body.toLowerCase() == "رونالدو")) {
    return api.sendMessage("️ عمكم وميسي كلكبم", threadID, messageID);
  };

  if ((event.body.toLowerCase() == " زين") || (event.body.toLowerCase() == "زين")) {
    return api.sendMessage("️اجي خطبني  🤧💞", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "شسمك") || (event.body.toLowerCase() == "ايش هو اسمك")) {
    return api.sendMessage("️ميري عمتك 💞😺", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "كيفكم") || (event.body.toLowerCase() == "كيفك")) {
    return api.sendMessage("️بخير وانت👀", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "السلام عليكم") || (event.body.toLowerCase() == "سلام عليكم")) {
    return api.sendMessage("️ وعليكم السلام ورحمه الله وبركاته", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "جيت") || (event.body.toLowerCase() == "سلام")) {
    return api.sendMessage("️سير تصلي ", threadID, messageID);
  };
  if ((event.body.toLowerCase() == "شكون ") || (event.body.toLowerCase() == "  شكون")) {
    return api.sendMessage("️ لي غاذي يحوك محمد  👀💞", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "اك ") || (event.body.toLowerCase() == "اوك")) {
    return api.sendMessage("️اك ولا زبي  😌😉", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "قحبة") || (event.body.toLowerCase() == " لا تندي ناس باسم امك ")) {
    return api.sendMessage("️ لا تندي ناس باسم اختك ", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "واميري") || (event.body.toLowerCase() == "يا بوت ")) {
    return api.sendMessage("️ميري ميري مكتعيوش بعدو مني ها لعر  💖", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "اوا") || (event.body.toLowerCase() == "iwa")) {
    return api.sendMessage("️زدي عليها قهوة خلها ولا شربها بب 🫣❤", threadID, messageID);
  };

  if ((event.body.toLowerCase() == "المطور") || (event.body.toLowerCase() == "من المطور")) {
    return api.sendMessage("محمد حبيبي وروحي وتاج راسكم 💞🙃", threadID);
  };
  mess = "{name}"
  if (event.senderID == 100068553998815 && (event.body.indexOf("ميري") == 0)) {
    var msg2 = {
      body: `${rand2}`
    }
    return api.sendMessage(msg2, threadID, messageID)
  }
 else if (event.body.indexOf("حبي") == 0 || (event.body.indexOf("ميري") == 0)) {
    var msg = {
      body: ` ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) {}