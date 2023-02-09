// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages] });

//Commands Dynamic Loading Folders
client.commands = new Collection();
client.events = new Collection();



['command_handler','event_handler'].forEach(handler =>{
  require(`./handlers/${handler}`)(client,Discord);
})


client.on("ready", () => {
    const Guilds = client.guilds.cache.map(guild => guild.id);
    console.log(Guilds);
});

client.login(token);
