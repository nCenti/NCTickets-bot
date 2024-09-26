const { Client, Events, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping
    ]
});

client.commands = new Map();



const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(file.replace('.js', ''), command);
}

client.on(Events.ClientReady, () => {
    console.log("Bot Conectado!");
    client.user.setActivity({
        name: "discord ccenti.",
        type: ActivityType.Playing,
    })
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith("!")) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    

        
    const command = client.commands.get(commandName);
    if (command) {
        try {
            await command.run(message, args);
        } catch (error) {
            console.log(`Hubo un error al utilizar el comando !${commandName}: ${error.message}`);
        }
    }
});


require('dotenv').config();
client.login(process.env.DISCORD_TOKEN);