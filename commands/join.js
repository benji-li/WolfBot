const settings = require('../settings');
module.exports = {
	name: 'join',
    description: 'lets user join an existing game',
	execute(message) {
        if (settings.players.includes(message.author.id) == false) {
            settings.players.push(message.author.id);
            message.channel.send(`@${message.author.username} has joined the game! ${settings.players.length} players joined!`);
            message.author.send(`Welcome to the game!`);
        }
        else {
            message.reply(`you've already joined the game!`);
        }
    },
};