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
const {
  giveRole,
  giveRole2,
  takeRole
} = require('../../getrole')
const treeify = require('treeify');
const timer = ms => new Promise(res => setTimeout(res, ms))
const execFile = require('child_process').execFile;


module.exports = async (Discord, client, interaction) => {
  var channel = interaction.channel;

  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
  //await interaction.deferReply({ ephemeral: true });

  await interaction.deferReply();
  if (interaction.isSelectMenu()) {
    try {
     //####debugcleaning####console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a select interaction`);
     //####debugcleaning####console.log(`${interaction.values} from interaction`);
      if (interaction.values.length > -1) {
       //####debugcleaning####console.log(`empty values in ${treeify.asTree(interaction.message.components,true)}`)
       //####debugcleaning####console.log(`Exploring ${treeify.asTree(interaction.message.components[0].components[0],true)}`)
       //####debugcleaning####console.log(`Trying to look for all component values ${interaction.message.components[0].components[0].options[0].value}`)
        //Code for checking component is the same
       //####debugcleaning####console.log(`Custom id of interaction is ${interaction.customId}`)



        var giveroles = [];
        var allroles = [];
        var allroles2 = [];
        allroles2.push("1012622810037878826")


        for (components of interaction.message.components) {
          if (components.components[0].data.custom_id == interaction.customId) {
            for (values of components.components[0].options) {
              split = values.value.split("-");
              if (split[0] == "role") {
                allroles.push(split[1])
              }
            }
          }
        }
        // Successfully gotten all the roles

        // GIVING ROLES
        if (interaction.values.length > -1) {
          for (item of interaction.values) {
            split2 = item.split("-");
           //####debugcleaning####console.log(`${split} is split up with ${split.length} args`)


            if (split2.length == 2) {
             //####debugcleaning####console.log("split in")
              // if type of select is role
              if (split2[0] == "role") {
                rolegiven = giveRole2(interaction.member, split2[1])
                giveroles.push(`${split2[1]}`)
               //####debugcleaning####console.log(`Role given ${rolegiven} for ${split2[1]}`)


                if (rolegiven == "added") {
                  // await interaction.editReply({
                  //   content: "Successfully gained role",
                  //   ephemeral: true
                  // })
                } else {
                  // await interaction.editReply({
                  //   content: "Already Have role",
                  //   ephemeral: true
                  // })
                }
              }
            } else {
             //####debugcleaning####console.log("weird champ not a role interaction")
            }
          }


        }


        nallroles = allroles.filter(function(el) {
          return giveroles.indexOf(el) < 0;
        });

        //TAKING ALL OTHER ROLES
        if (nallroles.length > 0) {
          for (item of nallroles) {
            rolegiven = takeRole(interaction.member, item)
           //####debugcleaning####console.log(`Role taken ${rolegiven} on ${item}`)
            if (rolegiven == "removed") {
              // await interaction.editReply({
              //   content: "Successfully gained role",
              //   ephemeral: true
              // })
            } else {
              // await interaction.editReply({
              //   content: "Role did not exist in user",
              //   ephemeral: true
              // })
            }
          }

        }
      }


      await interaction.editReply({
        content: "Successfully Modified roles.",
        ephemeral: true
      })
    } catch (err) {
      await interaction.editReply({
        content: "An error occured. Please notify an administrator",
        ephemeral: true
      })
    }
  }


  if (interaction.isButton()) {
    console.log(`empty values in ${treeify.asTree(interaction.message.flags,true)}`)
    //Can i build an array of rows ?
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('secondary')
        .setLabel('Secondary')
        .setStyle(ButtonStyle.Secondary),
      ).addComponents(
        new ButtonBuilder()
        .setCustomId('secondary2')
        .setLabel('Secondary2')
        .setStyle(ButtonStyle.Secondary),
      );


   //####debugcleaning####console.log(interaction.customId);


    //=====================SELECT MENU INTRACTIONS======================

    // ================= INTERACTION PRE PROCESSING===============
    split3 = interaction.customId.split("-");

    if (split3.length > 1) {
      if (split3[0] == "role") {

        returned = giveRole(interaction.member, split3[1])
        if(returned=="added"){
        await interaction.editReply({
          content: 'Role Added',
          ephemeral: true
        });
        }else{
        await interaction.editReply({
          content: 'Role Removed',
          ephemeral: true
        }).catch(console.error);
      }
      return
      }

    }
    if (split3.length > 1) {
      if (split3[0] == "terraria") {
        if (split3[1] == "restart"){
          try{

          const child = execFile('terraria.bat', [], (error, stdout, stderr) => {
            console.log("nice");
          });

          // const child2 = execFile('startup.bat', [], (error, stdout, stderr) => {
          //   if (error) {
          //     throw error;
          //   }
          //   console.log(stdout);
          // });

          await interaction.editReply({
            content: 'Restarting Server',
            ephemeral: false
          }).catch(console.error);
          }
        catch(error){
            console.log(error)
          }
        }
      }
      return
    }

    




    if (interaction.customId == "popcat") {
      await interaction.editReply({
        content: 'Pop!',
        ephemeral: true
      });
      return
    }

    // ============== PARSING YAML =============================

    // const commandsPath = path.join(__dirname,'..','..', 'commands');
    // const file = fs.readFileSync('./events/guild/file.yml', 'utf8');
    // object = YAML.parse(file);
    ////####debugcleaning####console.log(object);
    var object = {};

    const yamls = fs.readdirSync('./yaml/').filter(file => file.endsWith('.yml'));
   //####debugcleaning####console.log(yamls)
    for (const filename of yamls) {
      file = fs.readFileSync(`./yaml/${filename}`, 'utf8')
      parsed = YAML.parse(file)
      if (parsed != null) {
        object = Object.assign(object, parsed)
      }
    }

    // Just viewing all javascript 'Objects'
    var items2 = [];
    var level1 = Object.keys(object);

    var sentbuttonid = interaction.customId;
    var page1 = new ActionRowBuilder()
    var page2 = new ActionRowBuilder()
    var page3 = new ActionRowBuilder()
    var page4 = new ActionRowBuilder()
    var page5 = new ActionRowBuilder()
    var page6 = new ActionRowBuilder()
    var page7 = new ActionRowBuilder()
    var pagelist = [page1, page2, page3, page4, page5, page6, page7]
    var embed = []
    var files = []

    //Pagelist used for iteration, seperated declaration for clarity

    var placeholder = "pagename"
    if (split3.length > 1 && split3[0]=="dupe") {
     //####debugcleaning####console.log(split3)
      placeholder = split3[1]
    }
    else{
    placeholder = interaction.customId
    }
    if (level1.indexOf(placeholder) != -1) {
      items = object[placeholder]["items"]
      //console.log(items, "Items object separated")
      var itemkeys = Object.keys(items)
      for (item in items) {
        var index = itemkeys.indexOf(item)
        type = items[item]["type"]
        if (type == 1) {
          //PROCESS IMAGE

          //console.log("Type 1 image detected at position ", index)
          // Use the helpful Attachment class structure to process the file for you
          files = new AttachmentBuilder(type = items[item]["image-file"]);
         //####debugcleaning####console.log("Type 1 image detected at position ", index, files)

        } else if (type == 2) {
          //PROCESS TEXT

          embed = new EmbedBuilder()
            // .setColor(0x0099FF)
            .setTitle(items[item].title)
            // .setURL('https://discord.js.org')
            .setDescription(items[item].text);

          if (items[item].image!=null){
            embed.setImage(items[item].image)
          }

         //####debugcleaning####console.log("Type 2 embeded text detected at position ", index)

        } else if (type == 3) {
          //PROCESS BUTTONS
         //####debugcleaning####console.log("Type 3 Button detected at position ", index)
          for (item2 in items[item]["items"]) {
            var button = items[item]["items"][item2]
           //####debugcleaning####console.log(button, "BUTTON FOUND?")

            if (button.buttonclass == 1) {
              pagelist[index].addComponents(
                new ButtonBuilder()
                .setCustomId(button.buttonids)
                .setLabel(button.buttonname)
                .setStyle(ButtonStyle[button.buttontype])
                .setDisabled(button.buttondisabled),
              )
            } else if (button.buttonclass == 2) {
              //BUTTON EMOJI NOT YET PROCESSED
              pagelist[index].addComponents(
                new ButtonBuilder()
                .setCustomId(button.buttonids)
                .setLabel(button.buttonname)
                .setStyle(ButtonStyle[button.buttontype])
                .setDisabled(button.buttondisabled)
                .setEmoji(button.buttonemoji),
              )
            } else if (button.buttonclass == 3) {
             //####debugcleaning####console.log(button.buttonurl, " url,", button.buttonname, " name,", button.buttontype, " type")
              pagelist[index].addComponents(
                new ButtonBuilder()
                .setURL(button.buttonurl)
                .setLabel(button.buttonname)
                .setStyle(ButtonStyle[button.buttontype])
                .setDisabled(button.buttondisabled),
              )
            } else {
              pagelist[index].addComponents(
                new ButtonBuilder()
                .setCustomId(`ERROR:${index} at ${item2}`)
                .setLabel("ERROR bad button type")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
              )
            }


          }
        } else if (type == 4) {
          if (true) {
            // menubuild = new SelectMenuBuilder()
            //
            // menubuild.setCustomId('select')
            //           .setPlaceholder('Nothing selected')
            //           .setMaxValues(3)
            //           .setMinValues(0)
            //           .addOptions({
            //             label: '🇨🇳 Chinese',
            //             description: 'Gives you the Chinese role',
            //             value: 'role-1012361692904181832',
            //           }, {
            //             label: '🇯🇵 Japanese',
            //             description: 'Gives you the Japanese role',
            //             value: 'role-1012622810037878826',
            //           }, )
            //
            //
            // menubuild.addOptions({
            //   label: '🇯🇵 Test ',
            //   description: 'Gives you the Test role',
            //   value: 'role-1012675420061179924',
            // }),
            // pagelist[index].addComponents(
            //   menubuild
            // );

            menubuild = new SelectMenuBuilder();
            maxcount = items[item]["maxcount"]
            menubuild.setCustomId(`select${item}`)
              .setPlaceholder(items[item]["placeholder"])
              .setMaxValues(maxcount)
              .setMinValues(0);

            // for (item2 in items[item]["items"]) {
            // menubuild.addOptions({
            //     label: '🇨🇳 Chinese',
            //     description: 'Gives you the Chinese role',
            //     value: 'role-1012361692904181832',
            //   });

            for (item2 in items[item]["options"]) {
              var option = items[item]["options"][item2]
              menubuild.addOptions({
                label: option.label,
                description: option.description,
                value: option.id
              });
            }
            pagelist[index].addComponents(
              menubuild
            );


          } else {
            pagelist[index].addComponents(
              new SelectMenuBuilder()
              .setCustomId('select2')
              .setPlaceholder('Default Debug List')
              .addOptions({
                label: 'Select me',
                description: 'This is a description',
                value: 'first_option',
              }, {
                label: 'You can select me too',
                description: 'This is also a description',
                value: 'second_option',
              }, ),
            );
          }
          // pagelist[index].addComponents(
          //   new SelectMenuBuilder()
          //   .setCustomId('select')
          //   .setPlaceholder('Nothing selected')
          //   .addOptions({
          //     label: 'Select 1',
          //     description: 'This is a selection option',
          //     value: 'first_option',
          //   }, {
          //     label: 'Select me 2',
          //     description: 'Select menu actions have to be hard-coded',
          //     value: 'second_option',
          //   }), )
        }
      }
    } else {
      await interaction.editReply({
        content: 'There was an error cannot find page',
        ephemeral: true
      });
      return
    }


    // var dcustomid = object[level1[0]]["items"]["pageitem3"]["buttonids"]
    // var dlabel =object[level1[0]]["items"]["pageitem3"]["buttons"]
    // var dtype =object[level1[0]]["items"]["pageitem3"]["buttontype"]
    // var row3 = new ActionRowBuilder()
    // .addComponents(
    //   new ButtonBuilder()
    //     .setCustomId(dcustomid[0])
    //     .setLabel(dlabel[0])
    //     .setStyle(ButtonStyle[dtype[0]]),
    // ).addComponents(
    //   new ButtonBuilder()
    //     .setCustomId(dcustomid[1])
    //     .setLabel(dlabel[1])
    //     .setStyle(ButtonStyle.Secondary),
    // );
    //
    // row3.addComponents(
    //   new ButtonBuilder()
    //     .setCustomId(dcustomid[1]+'2')
    //     .setLabel(dlabel[1]+'2')
    //     .setStyle(ButtonStyle.Secondary),
    // );


    //========REBUNCHING PROCESSING FOR REPLY=======///
    var rows = []
   //####debugcleaning####console.log(pagelist)

    // pagelist[0] = row2
    //page1 = row2
    // pagelist[1] = row
    var countingrows = 0;

    if (pagelist[0]['components'].length != 0) {
      rows.push(pagelist[0])
      countingrows++
    }
    if (pagelist[1]['components'].length != 0) {
      rows.push(pagelist[1])
      countingrows++
    }
    if (pagelist[2]['components'].length != 0) {
      rows.push(pagelist[2])
      countingrows++
    }
    if (pagelist[3]['components'].length != 0) {
      rows.push(pagelist[3])
      countingrows++
    }
    if (pagelist[4]['components'].length != 0) {
      rows.push(pagelist[4])
      countingrows++
    }
    if (pagelist[5]['components'].length != 0) {
      rows.push(pagelist[5])
      countingrows++
    }
    if (pagelist[6]['components'].length != 0) {
      rows.push(pagelist[6])
      countingrows++
    }

    if (countingrows > 5){
      throw `Too many rows! row count ${countingrows}`
    }



    // var embed = []
    //
    // embed = new EmbedBuilder()
    // .setColor(0x0099FF)
    // .setTitle('Some title')
    // .setURL('https://discord.js.org')
    // .setDescription('Some description here');
    //
    // const string = interaction.options.getString('input');
    // const integer = interaction.options.getInteger('int');
    // const boolean = interaction.options.getBoolean('choice');
    // const user = interaction.options.getUser('target');
    // const member = interaction.options.getMember('target');
    // const channel = interaction.options.getChannel('destination');
    // const role = interaction.options.getRole('muted');
    // const number = interaction.options.getNumber('num');
    // const mentionable = interaction.options.getMentionable('mentionable');
    // const attachment = interaction.options.getAttachment('attachment');

    // emptyembed = new EmbedBuilder()
   //####debugcleaning####console.log(embed.data, "EMBED CONTENTS")
    ////####debugcleaning####console.log(emptyembed,"-----empty EMBED CONTENTS")


    //BUILDING REPLY/UPDATE ARGUMENT DYNAMICALLY
    var argumentbuilder = []
    var content = {
      content: " "
    }
    argumentbuilder = {
      ...argumentbuilder,
      ...content
    }

    for (var i in embed.data) {
      ////####debugcleaning####console.log(embed.data,"EMBED CONTENTS")
      // Checks if embed contains anything before dynamically appending it
      embeds = {
        embeds: [embed]
      }
      argumentbuilder = {
        ...argumentbuilder,
        ...embeds
      }

    }
    for (var i in files) {
      ////####debugcleaning####console.log(embed.data,"EMBED CONTENTS")
      // Checks if embed contains anything before dynamically appending it
      var filess = {
        files: [files]
      }
      argumentbuilder = {
        ...argumentbuilder,
        ...filess
      }

    }


    components = {
      components: rows
    }
    argumentbuilder = {
      ...argumentbuilder,
      ...components
    }

    ephemeral = {
      ephemeral: true
    }
    argumentbuilder = {
      ...argumentbuilder,
      ...ephemeral
    }

    origin = object[placeholder]["options"]["origin"]
    //console.log(argumentbuilder, "ARGUMENT BUILDER CONTENTS")
    //console.log(origin, "Origins", interaction.component.label, "is ephemeral?")
    try{
    if (object[placeholder]["options"]["update"] == true || interaction.component.label == 'Back') {
      await interaction.deferUpdate();
      //await timer(3000);
      return await interaction.editReply(argumentbuilder);
    } else {
      await interaction.deferReply({ ephemeral: true });
      //await timer(3000);
      //return await interaction.editReply(argumentbuilder);
      return await interaction.editReply(argumentbuilder);
    }
    }catch(error){
      return await channel.send(`Error Bot failed to respond ||${error}||`)
    }

    // if (embed.data.length != null){
    //   if (object[placeholder]["options"]["update"] == true){
    //         return interaction.update({ content: "Debug 2",embeds:[embed],components:rows, ephemeral: true });
    //   }else{
    //         return await interaction.editReply({ content: "Debug 1",embeds:[embed],components:rows, ephemeral: true });
    //   }
    // }else{
    //
    //   if (object[placeholder]["options"]["update"] == true){
    //         return interaction.update({ content: "Debug 2",components:rows, ephemeral: true });
    //   }else{
    //         return await interaction.editReply({ content: "Debug 1",components:rows, ephemeral: true });
    //   }
    // }
    //return await interaction.editReply({ content: "Custom test",components:rows, ephemeral: true });
  };


  // if (!interaction.isChatInputCommand()) return;
  //   const command = client.commands.get(interaction.commandName);
  //
  // 	if (!command) return;
  //
  // 	try {
  // 		command.execute(interaction);
  // 	} catch (error) {
  // 		console.error(error);
  // 		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
  // 	}

  if (!interaction.isChatInputCommand()) return;


  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await await interaction.editReply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
    // await await interaction.editReply({
    //   content: 'There was an error while executing this command!',
    //   ephemeral: true
    // });
  }
};


//
// module.exports = {
// 	name: 'interactionCreate',
// 	execute(interaction) {
// 		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
//     if (!interaction.isChatInputCommand()) return;
//       const command = client.commands.get(interaction.commandName);
//
//     	if (!command) return;
//
//     	try {
//     		command.execute(interaction);
//     	} catch (error) {
//     		console.error(error);
//     		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
//     	}
// 	},
// };
