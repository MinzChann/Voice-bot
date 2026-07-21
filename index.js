const http = require('http');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

http.createServer((req, res) => res.end('Bot is running!')).listen(process.env.PORT || 3000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on('clientReady', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch('1516858634506604695');

    if (channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: false
      });
      console.log('Da vao voice thanh cong!');
    }
  } catch (error) {
    console.error('Loi khi vao voice:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
