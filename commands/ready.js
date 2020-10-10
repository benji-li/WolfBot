const settings = require('../settings');
module.exports = {
	name: 'ready',
    description: 'lets player ready up',
    readied: [],
	execute(message) {
        if (settings.players.includes(message.author.id) && message.author.id in this.readied === false) {
            this.readied.push(message.author.id);
            message.channel.send(`${message.author.id} is ready! ${this.readied.length}/${settings.players.length} readied!`);
        }
        else {
            message.reply('please join a game before readying');
        }
        if (settings.players.length === this.readied.length ) {
            message.channel.send('Game is starting...');
            settings.insesh = true;
        }
    },
};