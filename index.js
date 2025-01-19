const GitHubScraper = require('./src/scraper');
const Config = require('./src/config');
const NotificationManager = require('./src/notificationManager');

console.log('GitHub Trend Bot starting...');

async function main() {
    const config = new Config();
    const scraper = new GitHubScraper();
    const notificationManager = new NotificationManager(config.config);
    
    try {
        console.log('Fetching trending repos...');
        const repos = await scraper.getTrendingRepos();
        console.log(`Found ${repos.length} trending repositories`);
        
        repos.slice(0, 3).forEach((repo, index) => {
            console.log(`${index + 1}. ${repo.name} - ${repo.stars} stars`);
        });

        await notificationManager.notifyTrendingRepos(repos);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };