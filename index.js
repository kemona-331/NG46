const http = require('http')
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require('moment');
const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const path = require('path');
const cron = require('node-cron');
const Keyv = require('keyv');
const db = new Keyv(`sqlite://guild.sqlite`, { table: "settings" });
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
discordModals(client);
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
process.env.TZ = 'Asia/Tokyo'
"use strict";
let guildId

const commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end(`${client.user.tag} is ready!\n導入サーバー:${client.guilds.cache.size}\nユーザー:${client.users.cache.size}`)
  })
  .listen(3000)

for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command
}

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}

client.on('ready', async () => {
  client.user.setActivity(`毎日小さな目標を決めよう`, {
    type: 'PLAYING'
  });
  const embed = new MessageEmbed()
  .setTitle("起動しました！")
  .setDescription(">>> ```ansi\n[2;34mHello World![0m　　　　　``````ansi\n[2;36m導入サーバー数:" + client.guilds.cache.size + "[0m\n[2;32mユーザー数:" + client.users.cache.size + "[0m```" + moment().format("YYYY-MM-DD HH:mm:ss"))
  .setThumbnail(client.user.displayAvatarURL())
  .setColor("RANDOM")
  client.channels.cache.get("1286970119011958845").send({ embeds: [ embed ] })
  const data = []
  for(const commandName in commands){
    data.push(commands[commandName].data)
  }
  await client.application.commands.set(data);
  client.user.setStatus("idle");
  console.log(`${client.user.tag} is ready!`);
});

client.on("messageCreate", async message => {
  if (message.author.id != "526620171658330112") return;
  const receivedEmbed = message.embeds[0];
  const data = await db.get(message.guild.id);

  if (receivedEmbed && receivedEmbed.title && receivedEmbed.title.match(/待ち構えている...！/) && receivedEmbed.author) {
    const zokusei = receivedEmbed.author.name.match(/\[(.*?)\]/g)[0];
    const rank = `【${receivedEmbed.author.name.split(":")[2].replace(" ", "")}】`;
    const name = receivedEmbed.title.split("\n")[0].replace("が待ち構えている...！", "");

    const lvMatch = receivedEmbed.title.split("\n")[1].replaceAll(",", "").match(/^\D+(\d+)\D+(\d+)\D+(\d+)$/);
    if (!lvMatch) {
      console.error("lvが取得できませんでした");
      return;
    }
    const lv = lvMatch[1];
    const image = receivedEmbed.image?.url || undefined;
    const attribute = receivedEmbed.author.iconURL;

    if (["【通常】", "【最強】", "【大地の覇者】", "【原初】", "【ありがとう！】", "【天使】", "【龍帝】", "【三女神】"].includes(rank)) {
      let m = "";
      let index;
      const board = new MessageEmbed().setColor("RANDOM");
      if (rank == "【超激レア】") {
        if (!data || !data[0][0] || !data[1][0]) {
          board.setTitle("必要な情報が設定されてないから通知出来ないよ");
        } else {
          board.setTitle("超激レア出現");
          m = `<@&${data[1][0]}>【超激レア】${name}です！`;
          index = 0;
        }
      } else {
        if (!data || !data[0][1] || !data[1][1]) {
          board.setTitle("必要な情報が設定されてないから通知出来ないよ");
        } else {
          board.setTitle("tohru出現");
          m = `<@&${data[1][1]}>${rank}${name}です！`;
          index = 1;
        }
      }

      // レア敵が出現したらチャンネルを見えなくする処理
      const tao = client.users.cache.get("526620171658330112");
      await message.channel.permissionOverwrites.edit(tao, { VIEW_CHANNEL: false }).catch(console.error);

      // 解除ボタンの作成
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("unlock_channel")
          .setLabel("解除")
          .setStyle("SUCCESS")
      );

      const embed = new MessageEmbed()
        .setAuthor(`属性: ${zokusei}`, attribute)
        .setDescription(
          `<#${message.channel.id}>で**${rank}${name}**が出現しました！\n\nLv.${Number(lv).toLocaleString()} HP ${Number(
            lv * 10 + 50
          ).toLocaleString()}`
        )
        .setFooter("User TAO")
        .setColor("RANDOM");

      if (image) embed.setThumbnail(image);

      // レア敵が出現したチャンネルにボタンを配置して通知
      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

      // ボタンのインタラクション処理
      client.on("interactionCreate", async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === "unlock_channel") {
          const tao = client.users.cache.get("526620171658330112");
          await message.channel.permissionOverwrites.edit(tao, { VIEW_CHANNEL: true }).catch(console.error);

          // 通知完了のメッセージをEmbedで送信
          const unlockEmbed = new MessageEmbed()
            .setTitle("通知完了")
            .setDescription(`レア敵出現により非表示だったチャンネルが、<@${interaction.user.id}> により再表示されました。`)
            .setColor("GREEN");

          // ボタンを削除し、通知完了のEmbedを表示
          await interaction.update({ embeds: [unlockEmbed], components: [] });
        }
      });

      // 自動変更
      const updateChannelName = async (level) => {
        const newName = message.channel.name.match(/lv+\d+$/)
          ? message.channel.name.replace(/lv+\d+$/, `lv${level}`)
          : `${message.channel.name}-lv${level}`;
        await message.channel.setName(newName);
      };

      if (message.channel.topic === "auto:100") {
        const level = Math.floor(Number(lv) / 100) * 100;
        await updateChannelName(level);
      } else if (message.channel.topic === "auto:1000") {
        const level = Math.floor(Number(lv) / 1000) * 1000;
        await updateChannelName(level);
      } else if (message.channel.topic === "auto:10000") {
        const level = Math.floor(Number(lv) / 10000) * 10000;
        await updateChannelName(level);
      }
    }
  }
});


client.on('messageUpdate', async (oldMessage, newMessage) => {
  const data = await db.get(newMessage.guild.id)
  const embed = newMessage.embeds[0]
  if(!data || !data[2][0] || !data[2][1]) return
  if(newMessage.author.id == "526620171658330112" && embed && embed.description && embed.description.match(/仲間になりたそうに/)){
    if(Number(embed.fields[1].value.replaceAll(">","").replaceAll("*","").replaceAll(" ","").replaceAll("%","")) >= data[2][1]){
      const emb = new MessageEmbed()
      .setTitle(`攻撃確率${embed.fields[1].value.replaceAll(">","").replaceAll("*","").replaceAll(" ","")}！`)
      .setFooter(`検知対象:${data[2][1]}%以上`)
      .setColor("RANDOM")
      newMessage.reply({ embeds: [ emb ] })
    }
  }
})

client.on("interactionCreate", async (interaction) => {
  if(!interaction.isCommand()){
    return;
  }
  const command = commands[interaction.commandName];
  try{
    await command.execute(interaction);
  }catch(error){
    console.error(error);
    await interaction.reply({
      content: '何らかのエラーが発生しました。\n管理者にお伝え下さい。',
      ephemeral: true,
    })
  }
});

client.on('error', (err) => {
  console.error("error")
})

let messageListenerEnabled = true;

// ターゲットチャンネルのIDと送信メッセージのペア
const targetChannels = [
    { id: "1278611512650629174", message: "Sachiel" },
    { id: "1278694329916854274", message: "Ramiel" },
    { id: "1278832361055981589", message: "Ireul" },
    { id: "1289935038003019857", message: "Zeruel" },
    //{ id: "1289935144517636207", message: "Arael" }
];

// チャンネルごとにタイムアウトを管理するオブジェクト
let countdownTimeouts = {};

client.on('messageCreate', async message => {
    if (!messageListenerEnabled) return;
    if (message.author.bot) return;

    // すべてのターゲットチャンネルで共通処理
    const target = targetChannels.find(channel => channel.id === message.channel.id);
    if (target) {
        // チャンネルごとにタイムアウトをリセット
        if (countdownTimeouts[message.channel.id]) {
            clearTimeout(countdownTimeouts[message.channel.id]);
        }

        // 新しいタイマーをセット
        countdownTimeouts[message.channel.id] = setTimeout(async () => {
            const sentMessage = await message.channel.send(target.message);
            setTimeout(() => {
                sentMessage.delete().catch(console.error);
            }, 10000); // 10秒後に削除
        }, 35000); // 35秒後にメッセージを送信
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
