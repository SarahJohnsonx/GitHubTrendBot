const cron = require('node-cron');
const GitHubScraper = require('./scraper');
const NotificationManager = require('./notificationManager');

class Scheduler {
    constructor(config) {
        this.config = config;
        this.scraper = new GitHubScraper();
        this.notificationManager = new NotificationManager(config);
        this.jobs = [];
    }

    start() {
        console.log('Starting scheduler...');
        
        const schedule = this.config.scraper.checkInterval || '0 */6 * * *';
        console.log(`Scheduled to run: ${schedule}`);

        const job = cron.schedule(schedule, async () => {
            console.log('Running scheduled GitHub trending check...');
            await this.runCheck();
        }, {
            scheduled: false
        });

        this.jobs.push(job);
        job.start();
        
        console.log('Scheduler started successfully');
    }

    async runCheck() {
        try {
            const languages = this.config.scraper.languages || [''];
            let allRepos = [];

            for (const language of languages) {
                console.log(`Checking trending for ${language || 'all languages'}...`);
                const repos = await this.scraper.getTrendingRepos(language);
                
                repos.forEach(repo => {
                    repo.language = repo.language || language;
                });
                
                allRepos = allRepos.concat(repos);
            }

            const uniqueRepos = this.removeDuplicates(allRepos);
            console.log(`Found ${uniqueRepos.length} unique trending repositories`);

            if (uniqueRepos.length > 0) {
                await this.notificationManager.notifyTrendingRepos(uniqueRepos);
            }

        } catch (error) {
            console.error('Error during scheduled check:', error.message);
        }
    }

    removeDuplicates(repos) {
        const seen = new Set();
        return repos.filter(repo => {
            if (seen.has(repo.name)) {
                return false;
            }
            seen.add(repo.name);
            return true;
        });
    }

    stop() {
        console.log('Stopping scheduler...');
        this.jobs.forEach(job => job.stop());
        this.jobs = [];
        console.log('Scheduler stopped');
    }

    runOnce() {
        console.log('Running one-time check...');
        return this.runCheck();
    }
}

module.exports = Scheduler;