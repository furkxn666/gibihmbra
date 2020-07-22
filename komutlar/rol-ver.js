const Discord = require('discord.js');
exports.run = (client, message, args) => {
/////FORCEX
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Bunun için gerekli iznin yok');
  let guild = message.guild

  let user = message.mentions.members.first() 
  let rol = message.mentions.roles.first()
/////FORCEX
  if (!user) return message.reply('**Kime Rol Verceğimi Yazmadın!**')
  if (!rol) return message.reply('**Rol  belirtmedin**')
  /////FORCEX
  message.react("EMOJI ID")
  /////FORCEX
user.removeRole(rol)
  /////FORCEX
  const embed = new Discord.RichEmbed()
  .setColor('RED')
  .setTitle(`Başarılı`)
  .setDescription(`**Başarılı ${rol} Adlı Rolu ${user} Adlı Kullanıcıdan Cektım** :white_check_mark: `)
  .setTimestamp()
  message.channel.send(embed)

/////FORCEX
};
/////FORCEX
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'rol-al',
  description: 'İstediğiniz kişiyi istediğiniz rolü verir.',
  usage: 'rol-ver [kullanıcı] [@rol]'
};