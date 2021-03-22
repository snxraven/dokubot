// Allow access to our Env
require('dotenv').config()

// USe Unirest to make HTTP Requests - ON Dev Box, Use NO PROXY!
var unirest = require('unirest');
process.env["NO_PROXY"] = "*";

// Command Vars
let itemArray = [];
let indicator;
let counterVar;

exports.run = async (bot, message, args, functions) => {

  if (process.env.DELETE_USER_QUERY == "TRUE") message.delete()
  // Setting up Main Arguments - In A split
  let argscmd = message.content.split(" ").slice(1);

  // Single Arument Definitions 
  let word = argscmd.slice(0).join(" ");
  if (!word) return message.reply("Please give me a search query.");

  // Use the rss-parser NPM to parse out the feed from the Wiki
  let Parser = require('rss-parser');
  let parser = new Parser();

  // We need to run this in async for the feed parser
  (async () => {
    // Lets run the query on the domain within our config
    let feed = await parser.parseURL(process.env.DOMAIN + '/feed.php?mode=search&q=' + word);

    // For each result, push them to our array to be parsed by our embed - replace, non-needed or annoying url defects
    feed.items.forEach(item => {
      itemArray.push({ results: item.title + "\n" + item.link.replace("&do=diff", "").replace(new RegExp("[0-9]", "g"), "").replace("?rev=", "") })
    });

    if (itemArray.length == 0) return message.channel.send("Sorry, nothing was found!")
  

    indicator = getBool(process.env.SHOW_PAGE_INDICATOR)

    if (process.env.SHOW_RESULT_COUNT == "TRUE") {
      counterVar = 'Result Count: ' + itemArray.length
    } else {
      counterVar = '\xa0'
    }
    const Pagination = require('discord-paginationembed');

    const FieldsEmbed = new Pagination.FieldsEmbed()

      // A must: an array to paginate, can be an array of any type
      .setArray(itemArray)
      // Set users who can only interact with the instance. Default: `[]` (everyone can interact).
      // If there is only 1 user, you may omit the Array literal.
      .setAuthorizedUsers([message.author.id])
      // A must: sets the channel where to send the embed
      .setChannel(message.channel)
      // Elements to show per page. Default: 10 elements per page
      .setElementsPerPage(parseInt(process.env.NUMBERPERPAGE))
      // Have a page indicator (shown on message content). Default: false
      .setPageIndicator(indicator)
      // Format based on the array, in this case we're formatting the page based on each object's `word` property
      .formatField(process.env.EMBED_DESCRIPTION + " " + word, results => results.results);

    // Customise embed
    FieldsEmbed.embed
      .setColor(process.env.EMBED_COLOR)
      .setTitle(process.env.EMBED_TITLE)
      .setDescription(counterVar);

    // console.log(itemArray)
    // Deploy embed
    FieldsEmbed.build();
    itemArray = [];
    word = null;


    // Is it a bool? IDK BUT WE WILL!
    function getBool(val) {
      var num = +val;
      return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
    }


  })();
};


exports.help = {
  name: "search",
  aliases: ["s", "find"],
  category: "Wiki",
  description: "DokuWiki",
  usage: "search"
};