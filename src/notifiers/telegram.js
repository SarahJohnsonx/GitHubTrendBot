const axios = require('axios');

class TelegramNotifier {
    constructor(botToken, chatId) {
        this.botToken = botToken;
        this.chatId = chatId;
        this.apiUrl = `https://api.telegram.org/bot${botToken}`;
    }

    async sendTrendingUpdate(repos) {
        if (!this.botToken || !this.chatId) {
            console.log('Telegram bot not configured');
            return;
        }

        try {
            const message = this.formatMessage(repos);
            await this.sendMessage(message);
            console.log('Telegram notification sent successfully');
        } catch (error) {
            console.error('Failed to send Telegram notification:', error.message);
        }
    }

    formatMessage(repos) {
        const topRepos = repos.slice(0, 5);
        let message = `🔥 *GitHub Trending Repositories*\n\n`;
        message += `Found ${repos.length} trending repositories today!\n\n`;

        topRepos.forEach((repo, index) => {
            message += `${index + 1}\\. *${repo.name.replace(/[-_]/g, '\\$&')}*\n`;
            message += `⭐ ${repo.stars} stars\n`;
            if (repo.language) {
                message += `💻 ${repo.language}\n`;
            }
            if (repo.description) {
                message += `${repo.description}\n`;
            }
            message += `🔗 [View Repository](${repo.url})\n\n`;
        });

        return message;
    }

    async sendMessage(text) {
        const url = `${this.apiUrl}/sendMessage`;
        const data = {
            chat_id: this.chatId,
            text: text,
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: false
        };

        await axios.post(url, data);
    }
}

module.exports = TelegramNotifier;