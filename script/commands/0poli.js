module.exports.config = {
  name: "imagine",
  version: "1.0.",
  hasPermssion: 0,
  credits: "sagor",
  description: "مدري",
  usePrefix: true,
  commandCategory: "صور",
  usages: "ننص",
  cooldowns: 2,
};

module.exports.run = async ({api, event, args }) => {
const axios = require('axios');
const fs = require('fs-extra');
 let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("The order and the text", threadID, messageID);
let path = __dirname + `/cache/pol4i.png`;

  const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`);
  const translation = translationResponse.data[0][0][0];
  
  const poli = (await axios.get(`https://image.pollinations.ai/prompt/${translation}`, {
    responseType: "arraybuffer",
  })).data;
  fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
  api.sendMessage({
    body: "The picture will stay up for an hour!",
    attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
};
