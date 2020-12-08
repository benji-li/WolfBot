module.exports = {
    host: '',
    insesh: false,
    all_roles: ["werewolf","minion","seer","robber","troublemaker","drunk","insomniac","tanner","villager","mason"],
    players: [],
    roles: [],
    assigns: new Map(),
    middle: [],
    time: 420,
    alerts: new Map([
                    ["werewolf","The werewolves this round are: ","getwolves"],
                    ["minion","The werewolves are: ","getwolves"],
                    ["seer","Either select 2 Middle Roles to view or 1 Player Role: "],
                    ["robber","Select 1 Player to rob: "],
                    ["troublemaker","Select 2 Players to swap their roles: "],
                    ["drunk","Select 1 Middle Role to swap your role with: "],
                    ["insomniac","Your role at the end of the night is: "],
                    ["mason","The masons are: "]
            ]),
    emoji_letters: ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'],
    emoji_middle: ['⬅️','⬆️','➡️'],
};