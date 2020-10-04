module.exports = {
	name: 'join',
    description: 'lets user join an existing game',
    players: [],
	execute(message) {
        message.channel.send(`@${message.author.username} has joined the game!`);
        message.author.send(`Welcome to the game!`);
        this.players.push(message.author.username);
        message.reply(this.players);
    },
};