const fs = require("fs");
require('dotenv').config()


exports.run = async (bot, message, args, functions) => {
  message.channel.send(`= STATISTICS =\n Doku Search by SNXRaven#8205
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Users      :: ${bot.users.cache.size}
• Servers    :: ${bot.guilds.cache.size}
• Channels    :: ${bot.channels.cache.size}`, { code: "asciidoc" });
};

exports.help = {
  name: "about",
  aliases: ["a", "about"],
  category: "System",
  description: "Information about the bot",
  usage: "about"
};
