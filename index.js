const GitHubScraper = require('./src/scraper');

console.log('GitHub Trend Bot starting...');

async function main() {
    const scraper = new GitHubScraper();
    
    try {
        console.log('Fetching trending repos...');
        const repos = await scraper.getTrendingRepos();
        console.log(`Found ${repos.length} trending repositories`);
        
        repos.slice(0, 3).forEach((repo, index) => {
            console.log(`${index + 1}. ${repo.name} - ${repo.stars} stars`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();