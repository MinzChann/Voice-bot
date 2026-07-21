const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

// 1. Khai báo Client với các Quyền (Intents) cần thiết
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// 2. Điền thông tin cấu hình của bạn
const TOKEN = 'MTUyOTE3MTQ0MzM5OTUyNDQwMg.G89b-M.Rb7dpB7RY6jFJJa_nQ9eClHEF-TxZOECGdystU';         // Thay bằng Token bot của bạn
const GUILD_ID = '1516850441256698030';       // Thay bằng ID máy chủ (Server ID)
const CHANNEL_ID = '1516858634506604695';   // Thay bằng ID kênh voice muốn treo

let connection = null;

// Hàm kết nối và duy trì Voice
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

    // Kết nối vào kênh voice
    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true, // Tự tắt tiếng loa bot để tiết kiệm băng thông
        selfMute: true, // Tự tắt mic bot
    });

    console.log(`🎤 Đã kết nối vào kênh voice: ${channel.name}`);

    // Xử lý sự kiện ngắt kết nối (Tự động kết nối lại nếu bị rớt)
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            console.log('⚠️ Kết nối bị gián đoạn, đang thử khôi phục...');
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Nếu trạng thái đổi thành Signalling/Connecting -> đang tự nối lại thành công
        } catch (error) {
            console.log('❌ Rớt kết nối hoàn toàn, đang tiến hành kết nối lại...');
            connection.destroy();
            // Thử kết nối lại sau 5 giây
            setTimeout(connectToVoiceChannel, 5000);
        }
    });

    // Theo dõi lỗi kết nối
    connection.on('error', (error) => {
        console.error('⚠️ Lỗi kết nối voice:', error);
    });
}

// 3. Khi bot sẵn sàng hoạt động
client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} đã online!`);
    connectToVoiceChannel();
});

// 4. Đăng nhập bot
client.login(TOKEN);
