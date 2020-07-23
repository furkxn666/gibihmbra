const Discord = require('discord.js');
const db = require("quick.db")
exports.run = async (client, message, args) => {
 if (!message.member.roles.has('İD') && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.sendEmbed(new Discord.RichEmbed().setDescription('Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin!').setColor("Black"));
  let kullanıcı = message.mentions.users.first()
  if (!kullanıcı) return message.channel.sendEmbed(new Discord.RichEmbed().setDescription('Bir üye etiketlemelisin!').setColor("Black"));
  let user = message.mentions.users.first();
  let rol = message.mentions.roles.first()
  let member = message.guild.member(kullanıcı)
   let isim = args[1];
      if(!isim) return message.channel.send("Lütfen bir isim girin!").then(m => m.delete(5000));
   let yas = args[3];
   let lakap = args[2];
      if(!yas) return message.channel.send("Lütfen bir yaş girin!")
await member.setNickname(` ${isim} | ${lakap} ◦ ${yas}`);
  member.addRole("734142953735323650"); //vikings rol id
  member.removeRole("734142955719491656"); //kayıtsız rol id
  message.react('İD') //Emojiid
  let embed = new Discord.RichEmbed() 
  .setColor("RED")
  .addField(`Vikings`, `<a:tik:728589907232161863> ${member.user} **adlı üyeye** <@&734142953735323650> **rolünü verip ismini**  \` ${isim} | ${lakap} ◦ ${yas}\` **olarak ayarladım!**`)                                                                             
  .setFooter(message.author.tag ,message.author.avatarURL)
  .setTimestamp()
  return message.channel.send(embed)
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["k"],
  kategori: "k",
  permLevel: 0
}
exports.help = {
  name: 'k',
  description: "k",
  usage: 'k'
} 