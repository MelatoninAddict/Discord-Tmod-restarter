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

module.exports.giveRole2 =  function giveRole2(member, role) {
  try {
    // if(isNumber(parseInt(role))!= true ){
    //   return "failed"
    // }
    if (member.roles.cache.has(role)) { // if they already have the role
      // member.roles.remove(role); // remove it
      // console.log(`Taking role ${role}`)
      return "kept"
    } else { // if they don't have the role
      member.roles.add(role); // add it
      console.log(`Giving role ${role}`)
      return "added"
    }
  } catch (err) {
    console.log(`Error in giverole2`)
    return "failed"
  }
}

module.exports.takeRole =  function takeRole(member, role) {
  try {
    // if (isNumber(parseInt(role))!= true){
    //   return "failed"
    // }
    if (member.roles.cache.has(role)) { // if they already have the role
      member.roles.remove(role); // remove it
      console.log(`Taking role ${role}`)
      return "removed"
    } else {
      return "kept"
    }
  } catch (err) {
    console.log(`Error in giverole2`)
    return "failed"
  }
}

module.exports.giveRole = function giveRole(member,role) {
  try {
    // if (isNumber(parseInt(role))!= true){
    //   return "failed"
    // }
    if (member.roles.cache.has(role)) { // if they already have the role
      member.roles.remove(role); // remove it
      console.log(`Taking role ${role}`)
      return "removed"
    } else {
      member.roles.add(role); // add it
      console.log(`Giving role ${role}`)
      return "added"
    }
  } catch (err) {
    console.log(`Error in giveRole for role ${role}`)
    return "Error"
  }
}
