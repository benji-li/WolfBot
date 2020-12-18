# WolfBot
 Discord bot that lets you play one night ultimate werewolf with your friends!
 
 [Add WolfBot to your server!](https://discord.com/oauth2/authorize?client_id=762002242277474324&scope=bot)
 
 ## Basic Commands
 
 * **!playwolf** creates a new game room (each instance of the bot can only host one game at a time)
 
 * **!join** joins a player into an existing game room (the game room host is automatically added upon creation and doesn't need this)
 
 * **!end** resets and deletes an active game room
 
 * **!start** begins the game. Note: game roles must be set before this
 
 * **!set** allows you change the settings of the game  
      * **timer** sets a game length in minutes. For example: _!set timer 3_   
      * **roles** begins prompting the game room host for active roles. Ensure all players are joined before setting roles, since the bot will prompt for roles according to the number of people in the room
 
 ## Roles That Have Been Implemented
 * Werewolf
 * Minion
 * Mason
 * Seer
 * Robber
 * Troublemaker
 * Drunk
 * Insomniac
 * Tanner
 * Villager
