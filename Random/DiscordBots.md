# Discord Bot Development Guide 🤖

A comprehensive guide to creating and deploying Discord bots using Discord.js.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Setup](#project-setup)
- [Basic Bot Structure](#basic-bot-structure)
- [Common Features](#common-features)
- [Deployment](#deployment)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.x or higher)
- npm (comes with Node.js)
- A code editor (VS Code recommended)
- Git (for version control)

You'll also need:
- A Discord account
- Access to the [Discord Developer Portal](https://discord.com/developers/applications)

## Getting Started

### Creating a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "Bot" section and click "Add Bot"
4. Save the token (keep it secret!)
5. Enable necessary Privileged Gateway Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### Project Setup

```bash
# Create a new directory for your bot
mkdir my-discord-bot
cd my-discord-bot

# Initialize a new Node.js project
npm init -y

# Install necessary dependencies
npm install discord.js dotenv
```

Create the following files:
```
my-discord-bot/
├── .env
├── .gitignore
├── config.json
├── index.js
└── commands/
    └── ping.js
```

### Basic Bot Structure

**.env file:**
```env
DISCORD_TOKEN=your_bot_token_here
```

**.gitignore file:**
```gitignore
node_modules/
.env
config.json
```

**index.js:**
```javascript
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.reply('Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN);
```

## Common Features

### Command Handler
Create a command handler to organize your bot's commands:

```javascript
// commands/ping.js
module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    execute(message, args) {
        message.reply('Pong!');
    },
};
```

### Event Handler
Organize your bot's events:

```javascript
// events/ready.js
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
```

## Deployment

### Local Development
1. Install dependencies: `npm install`
2. Create `.env` file with your bot token
3. Run the bot: `node index.js`

### Production Deployment
Options for hosting your bot:
- [Heroku](https://heroku.com)
- [DigitalOcean](https://digitalocean.com)
- [Railway](https://railway.app)
- [Amazon EC2](https://aws.amazon.com/ec2)

Example Procfile for Heroku:
```
worker: node index.js
```

## Best Practices

1. **Error Handling**
   - Always implement try-catch blocks
   - Log errors appropriately
   - Provide user feedback when errors occur

2. **Rate Limiting**
   - Implement cooldowns for commands
   - Respect Discord's rate limits
   - Cache frequently used data

3. **Security**
   - Never commit tokens or sensitive data
   - Implement permission checks
   - Sanitize user input

4. **Code Organization**
   - Use separate files for commands
   - Implement modular design
   - Comment your code
   - Use consistent formatting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you need help:
- Check the [Discord.js Guide](https://discordjs.guide/)
- Join the [Discord.js Server](https://discord.gg/discord.js)
- Create an issue in this repository

