const settings = require('../settings');
module.exports = {
	name: 'set',
    description: 'change settings for game',
	execute(message,args) {
        const filter = ((m)=>settings.all_roles.includes(m.content) && m.author.id===message.author.id);
        const collector = message.channel.createMessageCollector(filter);

        if (args[0]=='timer') {
            settings.time = args[1];
        }
        else if (args[0]=='roles') {
            var counter = 1;
            var rolelist = [];
            message.reply(`enter ${settings.players.length}`);
            message.reply(`Enter Role 1: `);
            collector.on('collect', m => {
                rolelist.push(m.content);
                if (counter==settings.players.length+3) {
                    collector.stop();
                }
                else {
                    message.reply(`Enter Role ${counter+1}: `);
                }
                counter++;
            });
            collector.on('end',collected => {
                settings.roles=rolelist;
                message.channel.send(`The roles are: ${rolelist.join(", ")}`);
            });

        }
        else {
            message.reply("that command isn't recognized, try !set timer or !set roles");
        }
    },
};