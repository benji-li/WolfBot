const settings = require('../settings');
module.exports = {
	name: 'playwolf',
    description: 'creates a new game',
    isGame: false,
	execute(message) {
        if (this.isGame === false) {
            message.channel.send(`Game has been created by ${message.author.username}\n !join to join.`);
            settings.host_channel = message.channel.id;
            settings.host = message.author.id;
            settings.players.push(message.author.id);
            console.log('----------------');
        }
        else {
            message.channel.send('A game is already in session!');
        }
        this.isGame = true;
    },
};