const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const settings = require('./settings');
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
    if (!message.content.startsWith(prefix) || message.author.bot) return; //return if message doesn't start with prefix or sent by bot

    const args = message.content.slice(prefix.length).trim().split(/ +/); //splits command ignoring multiple spaces in a row
    const commandName = args.shift().toLowerCase(); // shift adds index 0, deletes from other array
    
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    var gameStatus = client.commands.get('play').isGame;

    try {
        if (gameStatus === false && commandName != 'play') {
            message.channel.send('Please use !play to create a lobby first!');
        }
        else {
            command.execute(message, args);
        }
    }
    catch (error){
        console.error(error);
        message.reply('There was an error trying to execute that command');
    }
    if (settings.insesh === true) {
        message.channel.send("woah1111");
        gameLoop(message.channel.id);
    }
    /*
    if (command === 'vote') { 
        let channel = message.channel.id;
        console.log("beep beep")
        message.channel.send(String(channel));
        return client.channels.cache.get("761749745060151318").send('hello');
    }*/
    
});


client.login(token);

function gameLoop(channel) {
    assignRoles(settings.players,settings.roles)
    for (const [player_id, role] of settings.assigns.entries()) {
        console.log(player_id);
        console.log(role);
        client.users.cache.get(player_id).send(`hey buddy! Your role is ${role}`);
    }
    sendDms(settings.assigns,settings.middle);
    /* send those good good dms to each role w/ instructions */
    /* figure out that timer */
    /* voting phase */
}

function assignRoles(players,roles) {
    roles.sort(() => Math.random() - 0.5);
    let rolemap = new Map()
    for (let i=0; i<players.length;i++) {
        rolemap.set(players[i],roles[i]);
    }
    settings.middle = roles.slice(-3,-1);
    settings.assigns = rolemap;

    console.log(roles);
    console.log(players);
    console.log(settings.assigns);
    console.log(settings.middle);
}

function sendDms(assignmap,mid) {
    for (const [player, role] of assignmap.entries()) {
        console.log(player, role);
        client.users.cache.get(player).send(`:regional_indicator_a: ${settings.players}`);
        client.users.cache.get(player).send(settings.alerts.get(role));
        client.users.cache.get(player).send(`:regional_indicator_a: ${settings.players}`)
        .then(async function (botmessage) {
            await botmessage.react('✅')
            const filter = (reaction, user) => {
                return reaction.emoji.name==='✅' && user.id ===player;
            };
            const collector = botmessage.createReactionCollector(filter, { time: 15000 });
    
            collector.on('collect', (reaction, user) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                //do stuff
            });
              
            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
            });
        });
    }
}