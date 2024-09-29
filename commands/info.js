const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { sendPaginatedEmbeds } = require('discord.js-embed-pagination');
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});

module.exports = {
  data: {
    name: "info",
    description: "Botの情報を表示するよ",
  },
  async execute(interaction) {
    const embeds = [
      new MessageEmbed()
      .setTitle("Info")
      .setDescription("開発者陣の情報です")
      .addField("開発者",`\`\`\`fix\n???\`\`\``)
      .addField("スペシャルサンクス",`\`\`\`fix\nanijaaa様,TAO#0042様,${interaction.user.username}様含むユーザーの皆様\`\`\``)
      .setAuthor(`コマンド実行者:${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setColor("RANDOM"),
      new MessageEmbed()
      .setTitle("Info")
      .setDescription("Botの情報です。")
      .addField("サーバー数",`${client.guilds.cache.size}`,true)
      .addField("チャンネル数",`${client.channels.cache.size}\ntext:${client.channels.cache.filter(c => c.type == 'GUILD_TEXT').size},voice:${client.channels.cache.filter(c => c.type == 'GUILD_VOICE').size},stage:${client.channels.cache.filter(c => c.type == 'GUILD_NEWS').size},category:${client.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size}`,true)
      .addField("ユーザー数",`${client.users.cache.size}\n(member:${client.users.cache.filter((u) => !u.bot).size},bot:${client.users.cache.filter((u) => u.bot).size})`,true)
      .addField("開発言語","```fix\n???```",true)
      .addField("Discord.js ver","```js\nver.???```",true)
      .addField("Ping",`\`\`\`fix\n${client.ws.ping}ms\`\`\``,true)
      .setAuthor(`コマンド実行者:${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setColor("RANDOM")
    ]
    await sendPaginatedEmbeds(interaction, embeds, {
      previousLabel: '◀',
      nextLabel: '▶',
      time: 60000
    }).catch(err => {
      console.log(err)
    })
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)