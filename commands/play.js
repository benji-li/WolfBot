const settings = require('../settings');
module.exports = {
	name: 'play',
    description: 'creates a new game',
    isGame: false,
    owner: '',
	execute(message) {
        if (this.isGame === false) {
            message.channel.send(`Game has been created by ${message.author.username}\n !join and then !ready to begin.`);
            settings.host = message.author.username;
        }
        else {
            message.channel.send('A game is already in session!');
        }
        this.isGame = true;
    },
};