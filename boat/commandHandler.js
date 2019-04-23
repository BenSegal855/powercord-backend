const commands = require('./commands');

const no = [
  'no',
  'NO',
  'nice try',
  'banned',
  'ur not cute enough',
  'this command have been blocked due to article 13. Sorry.'
];
const getNo = () => no[Math.floor(Math.random() * no.length)];

module.exports = class CommandHandler {
  constructor (bot, mongo, config) {
    this.mongo = mongo;
    this.config = config;
    this.bot = bot;

    bot.on('messageCreate', this.processCommand.bind(this));
  }

  processCommand (msg) {
    const isAdmin = this.config.admins.includes(msg.author.id);
    if (!msg.content.startsWith(this.config.discord.boat.prefix)) {
      return;
    }

    const args = msg.content.slice(this.config.discord.boat.prefix.length).split(' ');
    const command = commands[args[0]];

    if (command) {
      if (command.isAdmin && !isAdmin) {
        return this.bot.createMessage(msg.channel.id, getNo());
      }
      return command.func(this.bot, msg, this.config, this.mongo);
    }

    // Fetch custom commands
  }
};