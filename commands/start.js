const settings = require('../settings');
module.exports = {
	name: 'start',
    description: 'lets host start a game',
	execute(message) {
        if (settings.host===message.author.id) {
            if (settings.players.length === 0) {
                message.channel.send(`um looks like no one wants to play wolf with you :( better find some cause can't start a game with 0 players!!`);
            }
            else if (settings.roles.length === 0 ) {
                message.channel.send("Cannot start game, roles have not been set!");
            }
            else if (settings.roles.length != settings.players.length + 3) {
                message.channel.send("You don't have the correct number of roles set. Please !set roles");
            }
            else {
                message.channel.send(`Game with ${settings.players.length} players is starting!`);
                settings.insesh = true;
            }
        }
        else {
            message.reply(`Only the host can start the game!`);
        }
    },
};