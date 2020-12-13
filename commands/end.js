const { middle } = require('../settings');
const settings = require('../settings');
const gs = require('./playwolf');
module.exports = {
	name: 'end',
    description: 'ends an existing game',

	execute(message) {
        if (gs.isGame === true) {
            message.channel.send(`Game has ended`);
            gs.isGame = false;
            settings.insesh = false;
            settings.players=[];
            settings.roles=[];
            settings.assigns.clear();
            settings.middle=[];
            settings.swaps=[];
            settings.time_elapsed=0;
            settings.votes=[];
        }
        else {
            message.channel.send(`No game to end!`);
        }
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