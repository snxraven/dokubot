const Discord = require("discord.js");
const fs = require("fs");

module.exports = {

    loadCommands: function(bot, dirname) {
        fs.readdir(dirname, (err, files) => {
            if(err) console.error(err);
            var jsFiles = files.filter(f => f.split(".").pop() === "js");
            if(jsFiles.length <= 0){
                console.log(`No command to load in the folder : ${dirname.replace(/.\/commands\//gi, "")}`);
                return;
            }
            
            jsFiles.forEach((f, i) => {
                delete require.cache[require.resolve(`${dirname}${f}`)];
                var props = require(`${dirname}${f}`);
                console.log(`${i + 1}: ${f} Loaded`);
                bot.commands.set(props.help.name, props);

                if(props.help.aliases) for (const alias of props.help.aliases){
                    bot.aliases.set(alias, props);
                }
            })
        })
    },

}
