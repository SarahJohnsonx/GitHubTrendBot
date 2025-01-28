const fs = require('fs');
const path = require('path');

class Storage {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.historyFile = path.join(this.dataDir, 'history.json');
        this.seenReposFile = path.join(this.dataDir, 'seen_repos.json');
        
        this.ensureDataDir();
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    saveHistory(repos) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            count: repos.length,
            repos: repos.map(repo => ({
                name: repo.name,
                stars: repo.stars,
                language: repo.language,
                url: repo.url
            }))
        };

        let history = this.loadHistory();
        history.push(entry);

        history = history.slice(-50);

        try {
            fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
            console.log(`Saved ${repos.length} repos to history`);
        } catch (error) {
            console.error('Error saving history:', error.message);
        }
    }

    loadHistory() {
        try {
            if (fs.existsSync(this.historyFile)) {
                const data = fs.readFileSync(this.historyFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading history:', error.message);
        }
        return [];
    }

    markRepoAsSeen(repoName) {
        let seenRepos = this.loadSeenRepos();
        const key = repoName.toLowerCase();
        seenRepos[key] = {
            name: repoName,
            firstSeen: new Date().toISOString(),
            count: (seenRepos[key]?.count || 0) + 1
        };

        try {
            fs.writeFileSync(this.seenReposFile, JSON.stringify(seenRepos, null, 2));
        } catch (error) {
            console.error('Error saving seen repos:', error.message);
        }
    }

    loadSeenRepos() {
        try {
            if (fs.existsSync(this.seenReposFile)) {
                const data = fs.readFileSync(this.seenReposFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading seen repos:', error.message);
        }
        return {};
    }

    isRepoNew(repoName, hours = 24) {
        const seenRepos = this.loadSeenRepos();
        const key = repoName.toLowerCase();
        
        if (!seenRepos[key]) {
            return true;
        }

        const firstSeen = new Date(seenRepos[key].firstSeen);
        const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
        
        return firstSeen > hoursAgo;
    }

    getStats() {
        const history = this.loadHistory();
        const seenRepos = this.loadSeenRepos();
        
        return {
            totalScrapingSessions: history.length,
            totalUniqueRepos: Object.keys(seenRepos).length,
            lastScrapingTime: history.length > 0 ? history[history.length - 1].timestamp : null,
            averageReposPerSession: history.length > 0 ? 
                Math.round(history.reduce((sum, entry) => sum + entry.count, 0) / history.length) : 0
        };
    }
}

module.exports = Storage;