const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const settings = require('./settings');
const { Server } = require('http');
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

// this needs to reach 0 before game can proceed
var actionsleft=0;

function gameLoop(channel) {
    assignRoles(settings.players,settings.roles);
    sendDms(settings.assigns,settings.middle);

    interval = setInterval(()=>actionsComped(actionsleft),1000);

    //setTimeout(sendDms,5000,settings.assigns,settings.middle);

    /* send those good good dms to each role w/ instructions */
    /* figure out that timer */
    /* voting phase */
}

function actionsComped(actionsleft) {
    if (actionsleft==0) {
        clearInterval(interval);
        console.log(`Swaps:`);
        console.log(settings.swaps);
        swapRoles(settings.assigns,settings.swaps,settings.middle);
    }
}

function assignRoles(players,roles) {
    roles.sort(() => Math.random() - 0.5);
    let rolemap = new Map()
    for (let i=0; i<players.length;i++) {
        rolemap.set(players[i],roles[i]);
    }
    settings.middle = roles.slice(-3);
    settings.assigns = rolemap;

    // splitting up the logs cause i hate how the format gets messed up in ${}
    console.log(`All roles:`);
    console.log(roles);
    console.log(`All Players:`);
    console.log(players);
    console.log(`Assignments:`);
    console.log(settings.assigns);
    console.log(`Mid:`);
    console.log(settings.middle);

    for (const [player_id, role] of settings.assigns.entries()) {
        client.users.cache.get(player_id).send(`hey buddy! Your role is ${role[0].toUpperCase()}${role.slice(1,)}`);
        if (settings.action_roles.includes(role)) {
            actionsleft++;
        }
    }
}

function sendDms(assignmap,mid) {
    for (const [player, role] of assignmap.entries()) {
        console.log(client.users.cache.get(player).username, role);
        if (role == "werewolf") {
            werewolf(player,assignmap,mid);
        }
        else if (role == "minion") {
            minion(player,assignmap);
        }
        else if (role == "seer") {
            seer(player,assignmap,mid);
        }
        else if (role == "robber") {
            robber(player,assignmap);
        }
        else if (role == "troublemaker") {
            troublemaker(player,assignmap);
        }
        else if (role == "drunk") {
            drunk(player,mid);
        }
        else if (role == "mason") {
            mason(player,assignmap);
        }
    }
}

function swapRoles(assignmap,swaparray,mid) {
    for (var i=0; i<settings.swap_order.length;i++) {
        for (var a=0;a<swaparray.length;a++) {
            if (swaparray[a][0]==settings.swap_order[i]) {
                if (settings.swap_order[i]=="robber") {
                    const r1 = assignmap.get(swaparray[a][1][0]);
                    const r2 = assignmap.get(swaparray[a][1][1]);
                    assignmap.set(swaparray[a][1][1],r1);
                    assignmap.set(swaparray[a][1][0],r2);
                }
                else if (settings.swap_order[i]=="troublemaker") {
                    const t1 = assignmap.get(swaparray[a][1][0]);
                    const t2 = assignmap.get(swaparray[a][1][1]);
                    assignmap.set(swaparray[a][1][1],t1);
                    assignmap.set(swaparray[a][1][0],t2);
                }
                else if (settings.swap_order[i]=="drunk") {
                    const d1 = assignmap.get(swaparray[a][1][0]); //player
                    const d2 = mid[swaparray[a][1][1]]; //card
                    mid[swaparray[a][1][1]] = d1;
                    assignmap.set(swaparray[a][1][0],d2);
                }
            }
        }
    }
    for (const [player, role] of assignmap.entries()) {
        if (role == "insomniac") {
            insomniac(player,assignmap);
        }
    }
    console.log(`Roles after night:`);
    console.log(assignmap);
}
// Dm's for each role -- splitting them up b/c easier although longer

function werewolf(recep,assignmap,mid) {
    var wolfcount = 0;
    var msg = "The Werewolves are: ";
    for (const [player,role] of assignmap.entries()) {
        if (role == "werewolf") {
            msg += client.users.cache.get(player).username;
            wolfcount++;
        }
    }
    client.users.cache.get(recep).send(msg);
    if (wolfcount == 1) {
        client.users.cache.get(recep).send("Looks like you're the only wolf, choose a center role to view!")
        .then(async function (botmessage) {
            for (emoj in settings.emoji_middle) {
                botmessage.react(settings.emoji_middle[emoj]);
            }
            const filter = (reaction, user) => {
                return settings.emoji_middle.includes(reaction.emoji.name) && user.id ===recep;
            };
            const collector = botmessage.createReactionCollector(filter, {max:1, time: 120000});
    
            collector.on('collect', (reaction, user) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                client.users.cache.get(recep).send(`The ${reaction.emoji.name} role is a ${mid[settings.emoji_middle.indexOf(reaction.emoji.name)]}`);
            });
              
            collector.on('end', collected => {
                console.log('Lone wolf task completed');
                actionsleft--;
            });
        });
    }
    console.log('werewolf task completed');
    return;
}
function minion(recep, assignmap) {
    var wcount=0;
    msg = "The Werewolves are: ";
    for (const [player,role] of assignmap.entries()) {
        if (role == "werewolf") {
            msg += client.users.cache.get(player).username;
            wcount++;
        }
    }
    if (wcount==0) {
        client.users.cache.get(recep).send("Looks like there aren't any werewolves :(");
    }
    else {
        client.users.cache.get(recep).send(msg);
    }

    console.log('minion task completed');
    return;
}
function seer(recep,assignmap,mid) {
    var i=0;
    var msg=``;
    for (const [player,role] of assignmap.entries()) {
        msg+=`${settings.emoji_letters[i]} ${client.users.cache.get(player).username} \n`;
        i++;
    }
    client.users.cache.get(recep).send(msg);

    var porm = 0; //1 = viewing mid - prevent viewing a mid then a player

    client.users.cache.get(recep).send("View 1 player's role OR View 2 center roles")
    .then(async function (botmessage) {
        for (var a=0;a<i;a++) {
            botmessage.react(settings.emoji_letters[a]);
        }
        for (emoj in settings.emoji_middle) {
            botmessage.react(settings.emoji_middle[emoj]);
        }
        const filter = (reaction, user) => {
            return (settings.emoji_letters.includes(reaction.emoji.name) || settings.emoji_middle.includes(reaction.emoji.name)) && user.id ===recep;
        };
        const collector = botmessage.createReactionCollector(filter, {time: 120000});

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if (settings.emoji_letters.includes(reaction.emoji.name) && porm===0) {
                //THIS MIGHT BE SUBJECT TO ERROR
                const pref=settings.players[settings.emoji_letters.indexOf(reaction.emoji.name)];

                client.users.cache.get(recep).send(`${client.users.cache.get(pref).username}'s role is ${assignmap.get(pref)}`);
                collector.stop();
            }
            else if(settings.emoji_middle.includes(reaction.emoji.name)) {
                client.users.cache.get(recep).send(`The ${reaction.emoji.name} role is a ${mid[settings.emoji_middle.indexOf(reaction.emoji.name)]}`);
                if (porm===1) {
                    collector.stop(); //after second role view
                }
                porm=1;
            }

        });
          
        collector.on('end', collected => {
            console.log('Seer task completed');
            actionsleft--;
        });
    });
    return;
}
function robber(recep,assignmap) {
    var i=0;
    var msg=``;
    for (const [player,role] of assignmap.entries()) {
        msg+=`${settings.emoji_letters[i]} ${client.users.cache.get(player).username} \n`;
        i++;
    }
    client.users.cache.get(recep).send(msg);

    client.users.cache.get(recep).send("Choose 1 player to rob their role")
    .then(async function (botmessage) {
        for (var a=0;a<i;a++) {
            botmessage.react(settings.emoji_letters[a]);
        }
        const filter = (reaction, user) => {
            return settings.emoji_letters.includes(reaction.emoji.name) && user.id ===recep;
        };
        const collector = botmessage.createReactionCollector(filter, {max:1,time: 120000});

        collector.on('collect', (reaction, user) => {
            const swapped = settings.players[settings.emoji_letters.indexOf(reaction.emoji.name)];
            settings.swaps.push(["robber",[recep,swapped]]);
            client.users.cache.get(recep).send(`You swapped with ${client.users.cache.get(swapped).username} and your new role is ${assignmap.get(swapped)}`);
        });
          
        collector.on('end', collected => {
            console.log('Robber task completed');
            actionsleft--;
        });
    });
    return;
}
function troublemaker(recep,assignmap) {
    var i=0;
    var msg=``;
    for (const [player,role] of assignmap.entries()) {
        msg+=`${settings.emoji_letters[i]} ${client.users.cache.get(player).username} \n`;
        i++;
    }
    client.users.cache.get(recep).send(msg);

    var tswap=[];
    client.users.cache.get(recep).send("Choose 2 players to swap their roles")
    .then(async function (botmessage) {
        for (var a=0;a<i;a++) {
            botmessage.react(settings.emoji_letters[a]);
        }
        const filter = (reaction, user) => {
            return settings.emoji_letters.includes(reaction.emoji.name) && user.id ===recep;
        };
        const collector = botmessage.createReactionCollector(filter, {max:2,time: 120000});

        collector.on('collect', (reaction, user) => {
            tswap.push(settings.players[settings.emoji_letters.indexOf(reaction.emoji.name)]);
        });
          
        collector.on('end', collected => {
            settings.swaps.push(["troublemaker",tswap]);
            client.users.cache.get(recep).send(`You swapped ${client.users.cache.get(tswap[0]).username} and ${client.users.cache.get(tswap[1]).username}'s roles`);

            console.log('Troublemaker task completed');
            actionsleft--;
        });
    });
    return;
}
function drunk(recep,mid) {
    client.users.cache.get(recep).send("Choose a middle role to swap your role with")
    .then(async function (botmessage) {
        for (emoj in settings.emoji_middle) {
            botmessage.react(settings.emoji_middle[emoj]);
        }
        const filter = (reaction, user) => {
            return settings.emoji_middle.includes(reaction.emoji.name) && user.id ===recep;
        };
        const collector = botmessage.createReactionCollector(filter, {max:1, time: 120000});

        collector.on('collect', (reaction, user) => {
            settings.swaps.push(["drunk",[recep,settings.emoji_middle.indexOf(reaction.emoji.name)]]); //[player_id,int]
        });
          
        collector.on('end', collected => {
            console.log('Drunk task completed');
            actionsleft--;
        });
    });
    return;
}
function insomniac(recep,assignmap) {
    client.users.cache.get(recep).send(`After the night, your role is ${assignmap.get(recep)}`);
    return;
}
function mason(recep,assignmap) {
    var msg = "";
    var tot = 0;
    for (var i=0;i<settings.players.length;i++) {
        if (assignmap.get(settings.players[i])=="mason") {
            msg += client.users.cache.get(settings.players[i]).username;
            tot++;
        }
    }
    if (tot==1) {
        client.users.cache.get(recep).send("You are the only mason!");
    }
    else {
        client.users.cache.get(recep).send(`The masons are ${msg}`);
    }

    console.log("Mason task completed");
    return;
}