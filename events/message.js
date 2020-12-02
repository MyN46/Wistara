const Discord = require("discord.js");

module.exports = async (client, msg) => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  
  let prefix;
    if (msg.channel.type == "text") {
      let gprefix = await client.db.fetch(`prefix_${msg.guild.id}`);
      if (gprefix === null) gprefix = "..";
      prefix = gprefix;
    } else {
      prefix = `..`;
    }

   client.prefix = prefix;

  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  const embed = new Discord.MessageEmbed()
    if (msg.content.match(prefixMention)) {
    msg.channel.send({
      embed: {
        description: `**:wave:My prefix on this guild is** \`${client.prefix}\``,
        color: `#00BFFF`
      }
    });
  }
  
  if (msg.content == `<@${client.user.id}>`) {
    const embed = new Discord.MessageEmbed()
      .setDescription(`**:wave: | My prefix is** \`${client.prefix}\``)
      .setColor("#00BFFF")
      .setFooter(`© ${client.user.usernme}`);
    msg.channel.send(embed);
  }
  if (msg.content == client.prefix) {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        `**Hey, It's me!
You can type** \`${client.prefix}help\` **to get bot commands list**`
      )
      .setColor("#00BFFF")
      .setFooter(`© ${client.user.username}`);
    return msg.channel.send(embed);
  }

  let args = msg.content
    .slice(client.prefix.length)
    .trim()
    .split(" ");
  let cmd = args.shift().toLowerCase();
  if (!msg.content.startsWith(client.prefix)) return;

  try {
    const file = client.commands.get(cmd) || client.aliases.get(cmd);
    if (!file) return msg.reply("**❌Command that you want doesn't exist.**");

    const now = Date.now();
    if (client.db.has(`cooldown_${msg.author.id}`)) {
      const expirationTime = client.db.get(`cooldown_${msg.author.id}`) + 3000;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return msg.reply(
          `**please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${file.name}\` command.**`
        );
      }
    }

    client.db.set(`cooldown_${msg.author.id}`, now);
    setTimeout(() => {
      client.db.delete(`cooldown_${msg.author.id}`);
    }, 3000);

    file.run(client, msg, args);
  } catch (err) {
    console.error(err);
  } finally {
    console.log(
      `${msg.author.tag} using ${cmd} in ${msg.channel.name} | ${msg.guild.name}`
    );
  }
};
