const Config = require('./src/config');
const Scheduler = require('./src/scheduler');

console.log('🤖 GitHub Trend Bot starting...');

async function startBot() {
    const config = new Config();
    const scheduler = new Scheduler(config.config);

    scheduler.runOnce();

    scheduler.start();

    process.on('SIGINT', () => {
        console.log('\nReceived SIGINT, shutting down gracefully...');
        scheduler.stop();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\nReceived SIGTERM, shutting down gracefully...');
        scheduler.stop();
        process.exit(0);
    });

    console.log('Bot is running! Press Ctrl+C to stop.');
}

if (require.main === module) {
    startBot();
}

module.exports = { startBot };