const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuBuilder,
  AttachmentBuilder
} = require('discord.js');
const YAML = require('yaml')
const fs = require('node:fs');
const path = require('node:path');

module.exports.updateorreply =  function updateorreply(interaction,reply) {
  try {
    // if(isNumber(parseInt(role))!= true ){
    //   return "failed"
    // }
    if(interaction.message.flags.has(64)){
      interaction.update(reply)
    }
  } catch (err) {
    console.log(`Error in updateorreply`)
    return "failed"
  }
}


module.exports.defercheck =  function defercheck(interaction,reply) {
  try {
    // if(isNumber(parseInt(role))!= true ){
    //   return "failed"
    // }
    if(interaction.message.flags.has(64)){
      interaction.deferUpdate()
    }else{
      interaction.deferReply()
    }
  } catch (err) {
    console.log(`Error in defercheck`)
    return "failed"
  }
}
