const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = '1516850441256698030';
const CHANNEL_ID = '1516858634506604695';

http.createServer((req, res) => res.end('OK')).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.once('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
    const guild = client.guilds.cache.get(GUILD_ID);
    const channel = guild?.channels.cache.get(CHANNEL_ID);
    if (guild && channel) {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true
        });
        console.log('Da vao voice!');
    }
});

client.login(TOKEN);
const http = require('http');
http.createServer((req, res) => res.end('Bot is running!')).listen(process.env.PORT || 3000);

