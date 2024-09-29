const http = require('http')
const fs = require('fs')

const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const client1 = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let messageListenerEnabled = true;
let targetChannelId = "1278178253814763622"
let countdownTimeout = null;

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end(`${client1.user.tag} is ready!\n導入サーバー:${client1.guilds.cache.size}\nユーザー:${client1.users.cache.size}`)
  })
  .listen(8081)

client1.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // ボタンのカスタムIDに基づいて処理を実行
    if (interaction.customId === 'toggleMessageListener') {
        messageListenerEnabled = !messageListenerEnabled;
        const status = messageListenerEnabled ? 'on' : 'off';
        await interaction.update({ content: `self-bot-${status}`, ephemeral: true });
    } else if (interaction.customId === 'attackButton') {
        // 攻撃開始メッセージを隠しメッセージとして送信
        await interaction.reply({ content: '攻撃を開始しました。', ephemeral: true });

        // クライアント2のボットに攻撃メッセージを送信
        //client2.channels.cache.get(target_ch_id).send('::atk (`ฅ•ω•)ฅｱﾀｯｸﾆｬ-!');
    } else if (interaction.customId === 'changeChannelButton') {
        // チャンネルIDを変更するフォームを表示
        await interaction.reply({ content: 'チャンネルIDを入力してください:', ephemeral: true });
    }
});

client1.on('ready', async () => {
    const row1 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('toggleMessageListener')
                .setLabel('切り替える')
                .setStyle('PRIMARY')
        );

    const row2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('attackButton')
                .setLabel('攻撃する')
                .setStyle('SECONDARY')
        );

    const channel = await client1.channels.fetch('1286970119011958845'); // ボタンを送信するチャンネルのIDを指定
    await channel.send({ content: 'self-bot-menu', components: [row1, row2] });
});

client1.on('messageCreate', async message => {
  if (!messageListenerEnabled) return; // リスナーが無効の場合は処理しない
    if (message.author.bot) return;
    if (targetChannelId !== null && message.channel.id === targetChannelId) {
        if (countdownTimeout !== null) {
            clearTimeout(countdownTimeout);
        }
        countdownTimeout = setTimeout(() => {
            message.channel.send("SBS");
        }, 35000); // 60 seconds
    }
});

client1.login(process.env.DISCORD_BOT_TOKEN)