const axios = require('axios');

class DiscordNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    async sendTrendingUpdate(repos) {
        if (!this.webhookUrl) {
            console.log('Discord webhook not configured');
            return;
        }

        try {
            const embed = this.createEmbed(repos);
            await axios.post(this.webhookUrl, {
                embeds: [embed]
            });
            console.log('Discord notification sent successfully');
        } catch (error) {
            console.error('Failed to send Discord notification:', error.message);
        }
    }

    createEmbed(repos) {
        const topRepos = repos.slice(0, 5);
        
        return {
            title: '🔥 GitHub Trending Repositories',
            description: `Found ${repos.length} trending repositories today!`,
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
            fields: topRepos.map((repo, index) => ({
                name: `${index + 1}. ${repo.name}`,
                value: `⭐ ${repo.stars} | 🔗 [View](${repo.url})\n${repo.description || 'No description'}`,
                inline: false
            })),
            footer: {
                text: 'GitHub Trend Bot'
            }
        };
    }

    async sendSimpleMessage(message) {
        if (!this.webhookUrl) return;
        
        try {
            await axios.post(this.webhookUrl, {
                content: message
            });
        } catch (error) {
            console.error('Failed to send Discord message:', error.message);
        }
    }
}

module.exports = DiscordNotifier;