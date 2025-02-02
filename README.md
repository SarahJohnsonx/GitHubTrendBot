# GitHubTrendBot

A smart bot that tracks GitHub trending repositories and sends notifications about hot projects.

## Features

- 🔥 Track GitHub trending repositories across multiple languages
- 📱 Multi-platform notifications (Discord, Telegram)
- 🎯 Smart filtering and scoring system
- 📊 Historical data tracking to avoid duplicates
- ⏰ Scheduled monitoring with cron jobs
- 🚀 Easy configuration through JSON

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure the bot**
   
   Edit `config.json` to set up your notification preferences:
   ```json
   {
     "notifications": {
       "discord": {
         "enabled": true,
         "webhookUrl": "your_discord_webhook_url"
       },
       "telegram": {
         "enabled": true,
         "botToken": "your_bot_token",
         "chatId": "your_chat_id"
       }
     }
   }
   ```

3. **Run the bot**
   ```bash
   npm start        # Run continuously with scheduler
   npm run test     # Run once for testing
   npm run dev      # Development mode with auto-restart
   ```

## Configuration

The bot uses `config.json` for configuration:

- **scraper**: Control what repositories to track
- **notifications**: Set up Discord/Telegram notifications
- **filters**: Define minimum stars, exclude languages, keywords

## Data Storage

The bot automatically creates a `data/` directory to store:
- Repository history
- Seen repositories tracking
- Statistics and metrics

## License

MIT