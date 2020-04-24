const Discord = require('discord.js')

exports.run = (client, message, params) => {
const embed = new Discord.RichEmbed()
.setTitle(':flag_tr: Aşağıda Saat Yazmaktadır! :flag_tr:')
.setTimestamp()
.setFooter('Ülkemizin Saati ->')
.setColor(3)

message.channel.sendMessage(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'saat',
    description: 'saat türkiye',
    usage: 'saat'
  };