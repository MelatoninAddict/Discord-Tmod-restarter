const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  AttachmentBuilder,
  SelectMenuBuilder
} = require('discord.js');
const YAML = require('yaml')
const fs = require('fs');
const path = require('node:path');



module.exports = {
    data: new SlashCommandBuilder()
      .setName('insertpage')
      .setDescription('Inserts page on current text channel')
      .addStringOption(option => option.setName('input')
        .setDescription('name of page to insert')
        .setRequired(true)),
    async execute(interaction) {
      // const file = fs.readFileSync('./events/guild/file.yml', 'utf8');
      // object = YAML.parse(file);

      var object = {};

      const yamls = fs.readdirSync('./yaml/').filter(file => file.endsWith('.yml'));
      console.log(yamls)
      for (const filename of yamls) {
        file = fs.readFileSync(`./yaml/${filename}`, 'utf8')
        parsed = YAML.parse(file)
        if (parsed != null) {
          object = Object.assign(object, parsed)
        }
      }


      const string = interaction.options.getString('input');
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
      var rows = []
      var items = [];
      var level1 = Object.keys(object);
      //var placeholder = "pagename"
      var placeholder = string



      if (level1.indexOf(placeholder) != -1) {
        items = object[placeholder]["items"]
        console.log(items, "Items object separated")
        var itemkeys = Object.keys(items)
        for (item in items) {
          var index = itemkeys.indexOf(item)
          type = items[item]["type"]
          if (type == 1) {
            //PROCESS IMAGE

            //console.log("Type 1 image detected at position ", index)
            // Use the helpful Attachment class structure to process the file for you
            //files = new AttachmentBuilder("popcat.gif");
            files = new AttachmentBuilder(type = items[item]["image-file"]);
            console.log("Type 1 image detected at position ", index, files)

          } else if (type == 2) {
            //PROCESS TEXT

            embed = new EmbedBuilder()
              // .setColor(0x0099FF)
              .setTitle(items[item].title)
              // .setURL('https://discord.js.org')
              .setDescription(items[item].text);

            if (items[item].image != null) {
              embed.setImage(items[item].image)
            }

            console.log("Type 2 embeded text detected at position ", index)

          } else if (type == 3) {
            //PROCESS BUTTONS
            console.log("Type 3 Button detected at position ", index)
            for (item2 in items[item]["items"]) {
              var button = items[item]["items"][item2]
              console.log(button, "BUTTON FOUND?")

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
                  .setEmoji(button.buttonemoji)
                  .setDisabled(button.buttondisabled),
                )
              } else if (button.buttonclass == 3) {
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
                  .setLabel("ERROR")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(button.buttondisabled),
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


              }
              else {
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
            }
          }
        }



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




        var argumentbuilder = []
        var content = {
          content: "   "
        }
        argumentbuilder = {
          ...argumentbuilder,
          ...content
        }

        for (var i in embed.data) {
          embeds = {
            embeds: [embed]
          }
          argumentbuilder = {
            ...argumentbuilder,
            ...embeds
          }

        }
        for (var i in files) {
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




        console.log(argumentbuilder, "ARGUMENT BUILDER CONTENTS")

        interaction.channel.send(argumentbuilder)
        return //interaction.channel.followUp(argumentbuilder)//interaction.channel.send(argumentbuilder)
        //return interaction.followUp(argumentbuilder);

        // return interaction.reply('Pong!');
      }
    };
