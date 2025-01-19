const DiscordNotifier = require('./notifiers/discord');
const TelegramNotifier = require('./notifiers/telegram');

class NotificationManager {
    constructor(config) {
        this.config = config;
        this.notifiers = [];
        this.setupNotifiers();
    }

    setupNotifiers() {
        if (this.config.notifications.discord.enabled) {
            const discord = new DiscordNotifier(
                this.config.notifications.discord.webhookUrl
            );
            this.notifiers.push(discord);
        }

        if (this.config.notifications.telegram.enabled) {
            const telegram = new TelegramNotifier(
                this.config.notifications.telegram.botToken,
                this.config.notifications.telegram.chatId
            );
            this.notifiers.push(telegram);
        }
    }

    async notifyTrendingRepos(repos) {
        if (repos.length === 0) {
            console.log('No trending repos to notify');
            return;
        }

        const filteredRepos = this.filterRepos(repos);
        
        if (filteredRepos.length === 0) {
            console.log('No repos passed filters');
            return;
        }

        console.log(`Sending notifications for ${filteredRepos.length} repos`);

        for (const notifier of this.notifiers) {
            try {
                await notifier.sendTrendingUpdate(filteredRepos);
            } catch (error) {
                console.error('Notifier failed:', error.message);
            }
        }
    }

    filterRepos(repos) {
        return repos.filter(repo => {
            const starsCount = this.parseStars(repo.stars);
            
            if (starsCount < this.config.filters.minStars) {
                return false;
            }

            if (this.config.filters.excludeLanguages.includes(repo.language)) {
                return false;
            }

            if (this.config.filters.keywords.length > 0) {
                const text = `${repo.name} ${repo.description}`.toLowerCase();
                const hasKeyword = this.config.filters.keywords.some(keyword => 
                    text.includes(keyword.toLowerCase())
                );
                if (!hasKeyword) return false;
            }

            return true;
        });
    }

    parseStars(starsStr) {
        if (!starsStr) return 0;
        
        const cleanStr = starsStr.replace(/,/g, '');
        const match = cleanStr.match(/(\d+(?:\.\d+)?)\s*([kK])?/);
        
        if (!match) return 0;
        
        const num = parseFloat(match[1]);
        const multiplier = match[2] ? 1000 : 1;
        
        return Math.floor(num * multiplier);
    }
}

module.exports = NotificationManager;