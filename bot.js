const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const db = require('quick.db');
const ms = require('parse-ms')
const Canvas = require('canvas')
const instagram = require("user-instagram");
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm selam,  hoş geldin ^^');
  }
});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

client.on("message", async message => {
    if (message.member.hasPermission('MANAGE_GUILD')) return;
    let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
    if (!links) return;
    if (message.deletable) message.delete();
    message.channel.send(`Hey ${message.author}, sunucuda link paylaşamazsın!`)
})

client.on("message", async message => {
  if(message.author.id === client.user.id) return;
  if(message.guild) return;
  client.channels.get('645670665784918017').send(new Discord.RichEmbed().setAuthor("Yeni Bir DM", client.user.avatarURL).setFooter(message.author.tag, message.author.avatarURL).setDescription(`**Gönderenin ID:** ${message.author.id}`).setTimestamp().addField("Mesaj", message.content).setColor("RANDOM"))
})

     
            
    
client.on("message", async message => {
    let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
    if(sayac[message.guild.id]) {
        if(sayac[message.guild.id].sayi <= message.guild.members.size) {
            const embed = new Discord.RichEmbed()
                .setDescription(`Tebrikler, başarılı bir şekilde ${sayac[message.guild.id].sayi} kullanıcıya ulaştık!`)
                .setColor("0x808080")
                .setTimestamp()
            message.channel.send({embed})
            delete sayac[message.guild.id].sayi;
            delete sayac[message.guild.id];
            fs.writeFile("./ayarlar/sayac.json", JSON.stringify(sayac), (err) => {
                console.log(err)
            })
        }
    }
})
client.on("guildMemberRemove", async member => {
        let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('')
    .setDescription(``)
 .setColor("RED")
    .setFooter("", client.user.avatarURL);
 
  if (!giriscikis[member.guild.id].kanal) {
    return;
  }
 
  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`📤 ${member.user.tag}, aramızdan ayrıldı, \**${sayac[member.guild.id].sayi}\** kişi olmamıza \**${sayac[member.guild.id].sayi - member.guild.memberCount}\** kişi kaldı!`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }
 
});
client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('')
    .setDescription(``)
 .setColor("GREEN")
    .setFooter("", client.user.avatarURL);
 
  if (!giriscikis[member.guild.id].kanal) {
    return;
  }
 

  }
 
);

client.on('guildMemberAdd', async member => {
  let rol = await db.fetch(`otoR_${member.guild.id}`);
  let kanal = await db.fetch(`otoK_${member.guild.id}`);
  let mesaj = await db.fetch(`otomesaj_${member.guild.id}`);
  let rol2 = await db.fetch(`botR_${member.guild.id}`);
  
  if (member.user.bot === true){
    
    if (!rol2) return
    
    member.addRole(member.guild.roles.get(rol2));
  } else {
  
  if (!rol) return
  member.addRole(member.guild.roles.get(rol))
  
  if (!kanal) return
  member.guild.channels.get(kanal).send(`${member} Kullanıcısına \`${member.guild.roles.get(rol).name}\` rolü verildi! **${member.guild.members.size}** Kişiyiz!`)
  }
})

client.on("guildCreate", guild => { // Birisi botu sunucuya attıgında bot özel mesaj atar.
const tesekkurler = new Discord.RichEmbed()
.setTitle(`iBot | Bilgilendirme`)
.setTimestamp()
.setColor("GREEN")
.setDescription(`Beni Sunucuna Eklediğin İçin Teşekkür Ederim \n Sana En İyi Şekilde Hizmet Edeceğim.\n Eğer Bir Sorunla Karşılaşırsan Destek Sunucuma Gel  https://discord.gg/AHe4u4m \n Komutlarımız için **!yardım** komutunu kullanınız.`)
guild.owner.send(tesekkurler)


});

client.on('guildMemberAdd',async member => { // Güvenlik Sistemi
  let user = client.users.get(member.id);
  let kanal = client.channels.get(db.fetch(`guvenlik${member.guild.id}`)) 
       const Canvas = require('canvas')
       const canvas = Canvas.createCanvas(360,100);
       const ctx = canvas.getContext('2d');
  
  const resim1 = await Canvas.loadImage('https://cdn.discordapp.com/attachments/597433546868654106/627428441695977497/gvnlk-spheli.png')
    const resim2 = await Canvas.loadImage('https://cdn.discordapp.com/attachments/597433546868654106/627427731407241226/gvnlk-gvnli.png')
    const kurulus = new Date().getTime() - user.createdAt.getTime();
    const gün = moment(kurulus).format('dddd');  
    var kontrol;
      if (kurulus > 2629800000) kontrol = resim2
    if (kurulus < 2629800000) kontrol = resim1

       const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/597433546868654106/627425996454232064/gvnlk-arka.png');
       ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
   

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
  ctx.drawImage(kontrol,0,0,canvas.width, canvas.height)
  ctx.beginPath();
    ctx.lineWidth = 4;
  ctx.fill()
    ctx.lineWidth = 4;
  ctx.arc(180, 46, 36, 0, 2 * Math.PI);
    ctx.clip();
  ctx.drawImage(avatar, 143,10, 73, 72  );

   if (!kanal) return
       const attachment = new Discord.Attachment(canvas.toBuffer(), 'güvenlik.png');
    kanal.send(attachment)
});

const invites = {};


const wait = require('util').promisify(setTimeout);

client.on('ready', () => {

  wait(1000);


  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});
   
client.on("roleCreate", async (rolee, member, guild) => {
  let rolkoruma = await db.fetch(`rolk_${rolee.guild.id}`);
  if (rolkoruma == "acik") {
    rolee.delete();
    const embed = new Discord.RichEmbed()
      .setDescription(
        "Sunucunuzda yeni bir rol oluşturuludu! fakat geri silindi! (Rol Koruma Sistemi)"
      )
      .setColor("BLACK");
    rolee.guild.owner.send(embed);
    return;
  } else {
    return;
  }
});

client.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
        
    let i = await db.fetch(`reklamFiltre_${msg.guild.id}`) 
          if (i == 'acik') {
              const reklam = ["discord.app", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
              if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
                try {
                  if (!msg.member.hasPermission("MANAGE_GUILD")) {
                    msg.delete();                   
                    let embed = new Discord.RichEmbed()
                    .setColor(0xffa300)
                    .setFooter('iBot  -|-  Reklam engellendi.', client.user.avatarURL)
                    .setAuthor(msg.guild.owner.user.username, msg.guild.owner.user.avatarURL)
                    .setDescription("iBot Reklam sistemi, " + `***${msg.guild.name}***` + " adlı sunucunuzda reklam yakaladım.")
                    .addField('Reklamı yapan kişi', 'Kullanıcı: '+ msg.author.tag +'\nID: '+ msg.author.id, true)
                    .addField('Engellenen mesaj', msg.content, true)
                    .setTimestamp()                   
                    msg.guild.owner.user.send(embed)                       
                    return msg.channel.send(`${msg.author.tag}, **Reklam Yapmak Yasak!**`).then(msg => msg.delete(25000));
                  }             
                } catch(err) {
                  console.log(err);
                }
              }
          }
          if (!i) return;
  });

client.on('messageDelete', async message   => { // mod-log
      let modlogs = db.get(`tc-modlog_${message.guild.id}`)
    const modlogkanal = message.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("BLUE")
  .setTitle("MESAJ SİLİNDİ")
.setDescription(`<@!${message.author.id}> adlı kullanıcı tarafından <#${message.channel.id}> kanalına gönderilen mesaj silindi!\n\nSilinen Mesaj: **${message.content}**`)
  .setFooter("iBot |  Mod-Log")
  modlogkanal.sendEmbed(embed);
  })


client.on('guildBanAdd', async message  => {
      let modlogs = db.get(`tc-modlog_${message.guild.id}`)
    const modlogkanal = message.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("BLUE")

	.setDescription(`Üye Sunucudan Yasaklandı! \n<@!${message.user.id}>, ${message.user.tag}`)
		.setThumbnail(message.user.avatarURL)
  .setFooter("iBot | mod-log")
  modlogkanal.sendEmbed(embed);
  })
client.on('channelCreate', async channel  => {
      let modlogs = db.get(`tc-modlog_${channel.guild.id}`)
    const modlogkanal = channel.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
	if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setDescription(`${channel.name} adlı metin kanalı oluşturuldu.`)
				.setFooter(`,RTX-BOT | Mod-Log Sistemi Kanal ID: ${channel.id}`)
				modlogkanal.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor('RANDOM')
.setTitle("SES KANALI OLUŞTURULDU")
				.setDescription(`${channel.name} adlı ses kanalı oluşturuldu!`)
				.setFooter(`iBot | Mod-Log Sistemi Kanal ID: ${channel.id}`)

				modlogkanal.send({embed});
			}
		
	})
client.on('channelDelete', async channel  => {
      let modlogs = db.get(`tc-modlog_${channel.guild.id}`)
    const modlogkanal = channel.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
	if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setDescription(`${channel.name} adlı metin kanalı silini!`)
				.setFooter(`iBot | Mod-Log Sistemi Kanal ID: ${channel.id}`)
				modlogkanal.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor('RANDOM')
.setTitle("SES KANALI SİLİNDİ")
				.setDescription(`${channel.name} adlı ses kanalı silindi`)
			.setFooter(`RTX-BOT | Mod-Log Sistemi  Kanal ID: ${channel.id}`)
				modlogkanal.send({embed});
			}
	})
client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (oldMsg.author.bot) return;
  var user = oldMsg.author;
  if (db.has(`tc-modlog_${oldMsg.guild.id}`) === false) return;
  var kanal = oldMsg.guild.channels.get(db.fetch(`tc-modlog_${oldMsg.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .addField("Kullanıcı", oldMsg.author.tag, true)
  .addField("Eski Mesaj",`  ${oldMsg.content}  `)
  .addField("Yeni Mesaj", `${newMsg.content}`)
  .setThumbnail(oldMsg.author.avatarURL)
  kanal.send(embed);  
		
	})

client.on('message', async message => {
    if (message.content === 'fakegiriş') {
        client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
    }
});

client.on('message', async message => {
    if (message.content === 'fakeçıkış') {
        client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
    }
});

/// LEVEL BOT.JS ///

client.on("message", async message => {
  let prefix = ayarlar.prefix;

  var id = message.author.id;
  var gid = message.guild.id;

  let hm = await db.fetch(`seviyeacik_${gid}`);
  let kanal = await db.fetch(`svlog_${gid}`);
  let xps = await db.fetch(`verilecekxp_${gid}`);
  let seviyerol = await db.fetch(`svrol_${gid}`);
  let rollvl = await db.fetch(`rollevel_${gid}`);

  if (!hm) return;


client.on('message', async message => { // bot bilgi paneli üye sayısı bot sayısı falan
  const ms = require('ms');
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "serverpanelkaldır") {
 if (!message.guild.channels.find(channel => channel.name === "Server Panel")) return message.channel.send("**Server Panel Ayarlanmamış!**")
   if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Yetkin bulunmuyor.");
    const a = message.guild.channels.find(channel => channel.name === "Server Panel").delete()
      if(!a) return console.log("guildStats")
      const b = message.guild.channels.find(channel => channel.name === `Toplam Üye • ${message.guild.members.filter( member => member.user.bot).size} bot / ${message.guild.memberCount} üye`, true)
      if(!b) return console.log("guildStatsMember")
      const c = message.guild.channels.find(channel => channel.name === `Rekor Online •${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`).delete()
      if(!c) return console.log("guildStatsBot")
     const m = message.guild.channels.find(channel => channel.name === `Bot Sayısı • ${client.guilds.reduce((a, b) => a + b.onlinememberCount, 0).toLocaleString()}`).delete()
      if(!m) return console.log("guildStatsOnlineBot")
      const d = message.guild.channels.find(channel => channel.name === `Toplam Kanal: ${client.channels.size.toLocaleString()}`).delete() //|| message.guild.channels.find(channel => channel.name === `Kanal sayısı: ${message.guild.channels.size-1}`).delete() || message.guild.channels.find(channel => channel.name === `Kanal sayısı: ${message.guild.channels.size-1}`).delete() || message.guild.channels.find(channel => channel.name === `Kanal sayısı: ${message.guild.channels.size-2}`).delete()
      if(!d) return console.log("guildStatsChannel")
      message.channel.send("**Kanallar Temizlendi!**")
    }
  if (command === "serverpanel") {
  if (message.guild.channels.find(channel => channel.name === "Server Panel")) return message.channel.send(" Bot Paneli Zaten Ayarlanmış.")
  message.channel.send(`**Server Panel Odalarının Kurulumunun Başlamasını İstiyorsanız 'başlat Yazınız!'**`)
      if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Yetkin bulunmuyor.");
      message.channel.awaitMessages(response => response.content === 'başlat', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
    .then((collected) => {
   message.guild.createChannel('Server Panel', 'category', [{
  id: message.guild.id,
  deny: ['SPEAK'],
  deny: ['CONNECT']  
}]);
        
 message.guild.createChannel(`Toplam Üye • ${message.guild.memberCount}`, 'voice')
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "Server Panel")));
message.guild.createChannel(`Çevrimiçi Üye • ${client.users.filter(cfx => cfx.presence.status === 'online').size}`, 'voice')
.then(channel =>
       channel.setParent(message.guild.channels.find(channel => channel.name === "Server Panel")));
message.guild.createChannel(`Botlar •  ${message.guild.members.filter(m => m.user.bot).size}`, 'voice')
.then(channel =>
             channel.setParent(message.guild.channels.find(channel => channel.name === "Server Panel")));
message.guild.createChannel(`Rekor Online • Bakımda!`, 'voice')
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "Server Panel")));
  message.channel.send("Bot Bilgi Paneli Ayarlandı!")
 
        })    
    
}
});


client.on('ready', () => { // davet takip

  wait(1000);

  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', member => {
  
  
 
  member.guild.fetchInvites().then(guildInvites => {
    
    if (db.has(`dKanal_${member.guild.id}`) === false) return
    const channel = db.fetch(`dKanal_${member.guild.id}`).replace("<#", "").replace(">", "")
    
    const ei = invites[member.guild.id];
  
    invites[member.guild.id] = guildInvites;
 
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);

    const davetçi = client.users.get(invite.inviter.id);
     db.add(`davet_${invite.inviter.id + member.guild.id}`,1)
let bal  = db.fetch(`davet_${invite.inviter.id + member.guild.id}`)
   member.guild.channels.get(channel).send(`:inbox_tray: ** <@${member.id}> Joined**; İnvited by **${davetçi.tag}** (`+'**'+bal+'** invites)')
  })

});
client.on("guildMemberRemove", async member => {

    member.guild.fetchInvites().then(guildInvites => {

      const ei = invites[member.guild.id];
  
    invites[member.guild.id] = guildInvites;
 
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);

       db.subtract(`davet_${invi