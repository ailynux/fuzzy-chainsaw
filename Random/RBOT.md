## FUTURE WORK 
# 🎲 RandomBot

RandomBot is a fun and quirky Discord bot that adds an element of chance and surprise to your server. Whether you need help making decisions, want to spice up conversations, or just love the unpredictable, RandomBot has got you covered!

## ✨ Features

- **Random Decision Maker**: Can't decide? Let RandomBot choose for you!
- **Random Number Generator**: Generate numbers within any range
- **Coin Flip**: Simple heads or tails with a twist
- **Dice Roller**: Support for multiple dice and custom sided-dice
- **Random Facts**: Learn something new every day
- **Random Meme Generator**: Keep your server entertained
- **Random Team Generator**: Split users into random teams

## 🚀 Getting Started

1. Invite RandomBot to your server using [this link]
2. Use the prefix `!random` or mention @RandomBot
3. Type `!random help` to see all available commands

## 📋 Basic Commands

```
!random choice [option1] [option2] ... - Pick a random option
!random number [min] [max] - Generate a random number
!random coin - Flip a coin
!random dice [number]d[sides] - Roll dice (e.g., 2d6)
!random fact - Get a random fact
!random meme - Get a random meme
!random teams [number] - Split active users into teams
```

## ⚙️ Configuration

- Use `!random config` to view current server settings
- Administrators can customize:
  - Bot prefix
  - Command permissions
  - Response style
  - Cooldown timers

## 📝 Requirements

- Node.js v16 or higher
- Discord.js v14
- MongoDB for data storage
- Internet connection for API features

## 🛠️ Self-Hosting

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your bot token and MongoDB URI
4. Run `npm start` to launch the bot


## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
