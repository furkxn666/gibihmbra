const Discord = require('discord.js');


exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('Blue')
.setTitle('Seviye Komutları')
.setTimestamp()
.addField('mf!seviye','Seviyenizi atar.')
.addField('mf!seviye-ayarlar','seviye komutlarının sunucudaki ayarlarını atar.')
.addField('mf!seviye-aç','Seviye Sistemini açarsınız.')
.addField('mf!seviye-kapat','Seviye sistemini kapatırsınız.')
.addField('mf!seviye-log','Level atlayan kullanıcıları bu kanala atar.')
.addField('mf!seviye-rol','Seviye ödülünü ayarlarsınız.')
.addField('mf!seviye-xp','mesaj başına gelecek puanı ayarlarsınız.')
.setFooter('iBOT Seviye Sistemi.')
.setTimestamp()
.setThumbnail(client.user.avatarURL)
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: [], 
  permLevel: 0 
};

exports.help = {
  name: 'seviye-sistemi',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};