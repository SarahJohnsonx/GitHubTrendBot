const axios = require('axios');
const cheerio = require('cheerio');

class GitHubScraper {
    constructor() {
        this.baseUrl = 'https://github.com/trending';
    }

    async getTrendingRepos(language = '', timeframe = 'daily') {
        try {
            const url = `${this.baseUrl}${language ? '/' + language : ''}?since=${timeframe}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            
            const repos = [];
            
            $('.Box-row').each((index, element) => {
                const $element = $(element);
                const name = $element.find('h2 a').text().trim().replace(/\s+/g, ' ');
                const description = $element.find('p').text().trim();
                const stars = $element.find('[href*="/stargazers"]').text().trim();
                const language = $element.find('[itemprop="programmingLanguage"]').text().trim();
                
                if (name) {
                    repos.push({
                        name,
                        description,
                        stars,
                        language,
                        url: `https://github.com${$element.find('h2 a').attr('href')}`
                    });
                }
            });
            
            return repos;
        } catch (error) {
            console.error('Error scraping GitHub trending:', error);
            return [];
        }
    }
}

module.exports = GitHubScraper;