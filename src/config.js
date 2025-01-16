const fs = require('fs');
const path = require('path');

class Config {
    constructor() {
        this.configPath = path.join(__dirname, '..', 'config.json');
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('Error loading config:', error);
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            scraper: {
                checkInterval: "0 */6 * * *",
                languages: ["javascript", "python"],
                timeframes: ["daily"]
            },
            notifications: {
                discord: { enabled: false },
                telegram: { enabled: false },
                email: { enabled: false }
            },
            filters: {
                minStars: 50,
                excludeLanguages: [],
                keywords: []
            }
        };
    }

    get(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.config);
    }

    set(key, value) {
        const keys = key.split('.');
        const last = keys.pop();
        const target = keys.reduce((obj, k) => obj[k] = obj[k] || {}, this.config);
        target[last] = value;
        this.saveConfig();
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }
}

module.exports = Config;