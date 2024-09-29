const http = require('http')
const fs = require('fs')

const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const client1 = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let messageListenerEnabled = true;
let targetChannelId1 = "1278611512650629174"
let targetChannelId2 = "1278694329916854274"
let targetChannelId3 = "1278832361055981589"
let targetChannelId4 = "1289935038003019857"
let targetChannelId5 = "1289935144517636207"
let countdownTimeout = null;

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end(`${client1.user.tag} is ready!\n導入サーバー:${client1.guilds.cache.size}\nユーザー:${client1.users.cache.size}`)
  })
  .listen(8081)


client1.on('messageCreate', async message => {
    if (!messageListenerEnabled) return; // リスナーが無効の場合は処理しない
    if (message.author.bot) return; // ボットのメッセージは無視
    if (targetChannelId1 !== null && message.channel.id === targetChannelId1) {
        if (countdownTimeout !== null) {
            clearTimeout(countdownTimeout);
        }
        countdownTimeout = setTimeout(async () => {
            const sentMessage = await message.channel.send("SBS"); // メッセージを送信し、送信したメッセージを取得
            setTimeout(() => {
                sentMessage.delete().catch(console.error); // 10秒後にメッセージを削除
            }, 10000); // 10秒後に実行
        }, 35000); // 35秒後にSBSメッセージを送信
    }
});


client1.login(process.env.DISCORD_BOT_TOKEN)