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
    name: "set",
    description: "通知などに関する情報を設定します",
    options: [
      {
        type: "CHANNEL",
        name: "超激通知channel",
        description: "超激の通知に使用するチャンネルを選択",
        channel_types: [0],
      },
      {
        type: "CHANNEL",
        name: "tohru枠通知channel",
        description: "tohru枠の通知に使用するチャンネルを選択",
        channel_types: [0],
      },
      {
        type: "ROLE",
        name: "超激通知role",
        description: "超激の通知に使用するロールを選択",
      },
      {
        type: "ROLE",
        name: "tohru枠通知role",
        description: "tohru枠の通知に使用するロールを選択",
      },
      {
        type: "BOOLEAN",
        name: "ペット厳選機能",
        description: "厳選時特定の確率以上の個体が出たら通知",
      },
      {
        type: "INTEGER",
        name: "ペット厳選数値",
        description: "入力された値以上の個体の場合通知",
      },
      {
        type: "BOOLEAN",
        name: "轢き殺し防止",
        description: "轢き殺し防止のON/OFFを切り替えます",
      },
    ],
  },
  async execute(interaction) {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const ch1 = interaction.options.getChannel("超激通知channel");
    const ch2 = interaction.options.getChannel("tohru枠通知channel");
    const role1 = interaction.options.getRole("超激通知role");
    const role2 = interaction.options.getRole("tohru枠通知role");
    const pet = interaction.options.getBoolean("ペット厳選機能");
    const percent = interaction.options.getInteger("ペット厳選数値");
    const stop = interaction.options.getBoolean("轢き殺し防止");
    let data = await db.get(interaction.guild.id)
    if(!data){
      data = [[undefined,undefined],[undefined,undefined],[undefined,undefined],undefined]
      await db.set(interaction.guild.id,data)
    }
    if(ch1) data[0].splice(0,1,ch1.id)
    if(ch2) data[0].splice(1,1,ch2.id)
    if(role1) data[1].splice(0,1,role1.id)
    if(role2) data[1].splice(1,1,role2.id)
    if(pet) data[2].splice(0,1,pet)
    if(percent) data[2].splice(1,1,percent)
    if(stop) data.splice(3,1,stop)
    const embed = new MessageEmbed()
    .setTitle("設定状況:")
    .addField(`= 超激通知用ch/role =`,`>>> ${data[0][0] != undefined ? "<#" + data[0][0] + ">" : "未設定"} / ${data[1][0] != undefined ? "<@&" + data[1][0] + ">" : "未設定"}`)
    .addField(`= tohru枠通知用ch/role =`,`>>> ${data[0][1] != undefined ? "<#" + data[0][1] + ">" : "未設定"} / ${data[1][1] != undefined ? "<@&" + data[1][1] + ">" : "未設定"}`)
    .addField(`= PET厳選機能 =`,`>>> ${data[2][0] != undefined ? data[2][0] : "未設定"} / ${data[2][1] != undefined ? data[2][1] + "%以上" : "未設定"}`)
    .addField(`= 轢き殺し防止 =`,`>>> ${data[3] != undefined ? data[3] : "未設定"}`)
    .setColor("RANDOM")
    interaction.reply({ content: "設定が完了しました！", ephemeral: true })
    interaction.channel.send({ embeds: [ embed ] })
    await db.set(interaction.guild.id,data)
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)