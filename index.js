const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, all_roles } = require('./config.json');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name,command);
}
 
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //return if message empty or sent by bot

    const args = message.content.slice(prefix.length).trim().split(/ +/); //splits command ignoring multiple spaces in a row
    const commandName = args.shift().toLowerCase(); // shift adds index 0, deletes from other array
    
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    var gameStatus = client.commands.get('play').isGame;

    try {
        if (commandName === 'play') { //make sure play is the first command given
            command.execute(message,args);
        }
        else if (gameStatus) {
            command.execute(message,args);
        }
    }
    catch (error){
        console.error(error);
        message.reply('There was an error trying to execute that command');
    }
    /*
    if (message.content.startsWith(`${prefix}ping`)) {
        message.channel.send('Pong');
    }
    else if (message.content.startsWith(`${prefix}beep`)) {
        message.channel.send('Boop')
    }
    else if (message.content.startsWith(`${prefix}server`)) {
        message.channel.send(`This server's name is: ${message.guild.name} \nTotal members: ${message.guild.memberCount}`);
    }
    else if (message.content === `${prefix}user-info`) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
    else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}`);
        }
        else if (args[0] === 'users') {
            return message.channel.send(message.mentions.users.size);
        }
        else if (args[0] ==='foo') {
            return message.channel.send('bar');
        }
        message.channel.send(`First argument: ${args[0]}`);
        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }
    else if (command === 'join') {
        if (isGame) {
            message.author.send(`Welcome to the game!`);
            return message.channel.send(`${message.author.username} has joined the game!`);
        }
        return message.channel.send(`No game to join!`);
    }
    else if (command === 'play') {
        if (!isGame) {
            isGame = true;
            return message.channel.send(`Game has been created! \n!join and then !ready to begin!`);
        }
        return message.channel.send(`Game already in progress!`);
    }
    else if (command === 'end') {
        if (isGame) {
            isGame = false;
            return message.channel.send(`Game has been stopped!`);
        }
        return message.channel.send('No game in progress!');
    }
    else if (command === 'vote') { 
        let channel = message.channel.id;
        message.channel.send(String(channel));
        return client.channels.cache.get("761749745060151318").send('hello');
    }
    */
});


client.login(token);