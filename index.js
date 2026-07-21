const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

// 💡 THAY BẰNG TOKEN VÀ ID CỦA BẠN:
const TOKEN = 'MTUyOTE3MTQ0MzM5OTUyNDQwMg.G89b-M.Rb7dpB7RY6jFJJa_nQ9eClHEF-TxZOECGdystU';
const GUILD_ID = '1516850441256698030';
const CHANNEL_ID = '1516858634506604695';

// 🌐 Tạo Web Server giả lập để Render không ngắt ứng dụng
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Voice Discord is running 24/7!\n');
}).listen(PORT, () => {
    console.log(`🌐 Web server đang chạy tại port ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

let connection = null;

function connectToVoiceChannel() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
        console.error('❌ Không tìm thấy máy chủ!');
        return;
    }

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error('❌ Không tìm thấy kênh voice!');
        return;
    }

    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true,
    });

    console.log(`🎤 Đã kết nối vào kênh voice: ${channel.name}`);

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch (error) {
            console.log('❌ Rớt kết nối, đang thử kết nối lại...');
            connection.destroy();
            setTimeout(connectToVoiceChannel, 5000);
        }
    });

    connection.on('error', (error) => {
        console.error('⚠️ Lỗi kết nối voice:', error);
    });
}

client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} đã online!`);
    connectToVoiceChannel();
});

client.login(TOKEN);
