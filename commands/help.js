const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: {
    name: "help",
    description: "コマンド一覧を表示するよ",
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
    .setTitle("HELP")
    .addField(`**help**`,">>> この画面")
    .addField(`**info**`,">>> BOT情報表示")
    .addField(`**set**`,">>> 各種設定")
    .addField(`**check**`,">>> 設定内容表示")
    .setAuthor(`コマンド実行者: ${interaction.user.globalName}`,interaction.user.displayAvatarURL())
    .setColor("RANDOM")
    await interaction.reply({ embeds: [ embed ] })
  }
}