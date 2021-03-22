// Internal Bot Source CHKSRV.PRO
// Written by SNXRaven
const Discord = require("discord.js");
require('dotenv').config()


function IsFutureDate(dateVal) {
  var Currentdate = new Date();
  dateVal = dateVal.split("/");
  var year = Currentdate.getFullYear();
  if (year < dateVal[2]) {
    return false;//future date

  }
  else {
    return true; //past date
  }

}

const bot = new Discord.Client({
  disableEveryone: true,
  autoReconnect: true,
  disabledEvents: ["TYPING_START"],
  partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION']
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.event = new Discord.Collection();

const loadCommands = require("./functions/commands.js");
const loadEvents = require("./functions/events.js");

const load = async () => {
  await loadCommands.run(bot);
  await loadEvents.run(bot);
}

load();
bot.login(process.env.TOKEN);