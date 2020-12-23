var ownersDiscordTag = "Conni!~#0920";
var botVersionNum = "V0.0.1.0b";
var clientVersionNum = "V1.0.0.0";
var webServerVersionNum = "V1.0.0.0";

var serverHostname = "http://conni.transvibe.club:80"

const express = require('express');
const app = express();
const port = 80;

const fs = require('fs');

function modPackInfo(currentPack) {
    var build = "";
    console.log("./" + currentPack + "/mods");
    fs.readdirSync("./" + currentPack + "/mods").forEach(file => {
        build += file + "," ;
    });
    console.log(build);
    return build;
}

app.get('/modPack-info', (req, res) => {
    var currentPack = req.query.packID;
    var packName = currentPack;
    var packVersion = "1.16.3";

    var build = packName + "," + packVersion + ",";

    build += modPackInfo(currentPack);

    res.send(build);
});

app.get('/downloadMods', (req, res) => {
    var currentPack = req.query.packID;
    var packName = currentPack;

    res.download("./" + packName + "/mods.zip", function (err) {
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
           // so check res.headersSent
         } else {
          // decrement a download credit, etc.
         }
    });
});

app.get('/clientInfo', (req, res) => {
    res.send(clientVersionNum);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
 
//
// DISCORD BOT
//

const Discord = require("discord.js");
const client  = new Discord.Client();

const config = require("./config.json");
var prefix = config.prefix; 

client.on("ready", async () => {
    console.log(`Discord Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    client.user.setActivity(`${client.guilds.cache.size} Servers!`);
});

client.on("guildCreate", async guild => {
    client.user.setActivity(`${client.guilds.cache.size} Servers!`);
});

client.on("message", async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    ISME = message.mentions.members.first() || message.guild.members.resolveID(args[0]);
    if (ISME && ISME.id === "") {
        message.channel.send(`HELLO, my prefix is ${prefix}`)
            .then(msg => {
                msg.delete({ timeout: 3000 })
            })
            .catch(console.error);
    }

    if (!message.content.startsWith(prefix)) return;

    if (command === 'restart') {
        if (message.author.id !== '299709641271672832') {
            return;
        }

        message.channel.send('Restarting.').then(() => {
            process.exit(1);
        })
    }
    else if (command === "info") {
        message.channel.send(`${ownersDiscordTag} - Version: ${botVersionNum}`);
    }
    else if(command === "packinfo") {
        message.channel.send(modPackInfo(args[0]));
    }
    else if(command === "download") {
        message.channel.send("Download: " + serverHostname + "/downloadMods?packID=" + args[0]);
    }
});

client.login(config.token);