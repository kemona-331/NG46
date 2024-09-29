const http = require('http');
const fs = require('fs');

const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const client1 = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let messageListenerEnabled = true;

// ターゲットチャンネルのIDと送信メッセージのペア
const targetChannels = [
    { id: "1278611512650629174", message: "Sachiel" },
    { id: "1278694329916854274", message: "Ramiel" },
    { id: "1278832361055981589", message: "Ireul" },
    { id: "1289935038003019857", message: "Zeruel" },
    { id: "1289935144517636207", message: "Arael" }
];

// チャンネルごとにタイムアウトを管理するオブジェクト
let countdownTimeouts = {};

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    response.end(`${client1.user.tag} is ready!\n導入サーバー:${client1.guilds.cache.size}\nユーザー:${client1.users.cache.size}`);
  })
  .listen(8081);

client1.on('messageCreate', async message => {
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

client1.login(process.env.DISCORD_BOT_TOKEN);
