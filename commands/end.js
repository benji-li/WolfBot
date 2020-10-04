const { Channel } = require("discord.js");

var gs = require('./play');
module.exports = {
	name: 'end',
    description: 'ends an existing game',

	execute(message) {
        message.channel.send(`Game hosted by ${gs.owner} has ended`);
        gs.isGame = false;
        /*
        if (message.author.username === gs.owner) {
            message.channel.send(`Game hosted by ${gs.owner} has ended`);
            gs.isGame = false;
        }
        else {
            message.channel.send(`Sorry, only ${gs.owner} has the power to end this game`);
        }
        */
    },
};