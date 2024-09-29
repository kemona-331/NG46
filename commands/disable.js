const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});
const Keyv = require('keyv');
const db = new Keyv(`sqlite://guild.sqlite`, { table: "settings" });

const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};

module.exports = {
  data: {
    name: "disable",
    description: "設定の削除をするよ",
    options: [
      {
        type: "BOOLEAN",
        name: "超激通知channel",
        description: "Trueで削除、Falseで削除しない",
      },
      {
        type: "BOOLEAN",
        name: "tohru枠通知channel",
        description: "Trueで削除、Falseで削除しない",
      },
      {
        type: "BOOLEAN",
        name: "超激通知role",
        description: "Trueで削除、Falseで削除しない",
      },
      {
        type: "BOOLEAN",
        name: "tohru枠通知role",
        description: "Trueで削除、Falseで削除しない",
      },
      {
        type: "BOOLEAN",
        name: "ペット厳選機能",
        description: "Trueで削除、Falseで削除しない",
      },
      {
        type: "BOOLEAN",
        name: "ペット厳選数値",
        description: "Trueで削除、Falseで削除しない",
      },
      {
        type: "BOOLEAN",
        name: "轢き殺し防止",
        description: "Trueで削除、Falseで削除しない",
      },
    ],
  },
  async execute(interaction) {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const ch1 = interaction.options.getBoolean("超激通知channel");
    const ch2 = interaction.options.getBoolean("tohru枠通知channel");
    const role1 = interaction.options.getBoolean("超激通知role");
    const role2 = interaction.options.getBoolean("tohru枠通知role");
    const pet = interaction.options.getBoolean("ペット厳選機能");
    const percent = interaction.options.getBoolean("ペット厳選数値");
    const stop = interaction.options.getBoolean("轢き殺し防止");
    let data = await db.get(interaction.guild.id)
    if(!data){
      data = [[undefined,undefined],[undefined,undefined],[undefined,undefined],undefined]
      await db.set(interaction.guild.id,data)
    }
    if(ch1) data[0].splice(0,1,undefined)
    if(ch2) data[0].splice(1,1,undefined)
    if(role1) data[1].splice(0,1,undefined)
    if(role2) data[1].splice(1,1,undefined)
    if(pet) data[2].splice(0,1,undefined)
    if(percent) data[2].splice(1,1,undefined)
    if(stop) data.splice(3,1,undefined)
    const embed = new MessageEmbed()
    .setTitle("設定状況")
    .addField(`**超激通知用ch/role**`,`>>> ${data[0][0] != undefined ? "<#" + data[0][0] + ">" : "未設定"} / ${data[1][0] != undefined ? "<@&" + data[1][0] + ">" : "未設定"}`)
    .addField(`**tohru枠通知用ch/role**`,`>>> ${data[0][1] != undefined ? "<#" + data[0][1] + ">" : "未設定"} / ${data[1][1] != undefined ? "<@&" + data[1][1] + ">" : "未設定"}`)
    .addField(`**PET厳選機能**`,`>>> ${data[2][0] != undefined ? data[2][0] : "未設定"} / ${data[2][1] != undefined ? data[2][1] + "%以上" : "未設定"}`)
    .addField(`**轢き殺し防止**`,`>>> ${data[3] != undefined ? data[3] : "未設定"}`)
    .setColor("RANDOM")
    interaction.reply({ content: "設定が完了したよ！", ephemeral: true })
    interaction.channel.send({ embeds: [ embed ] })
    await db.set(interaction.guild.id,data)
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)