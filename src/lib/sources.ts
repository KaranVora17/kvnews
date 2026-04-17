export type Category = {
  id: string
  label: string
  feeds: { url: string; primary: boolean }[]
  keywords?: string[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'global',
    label: 'Global',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', primary: true },
      { url: 'https://feeds.bbci.co.uk/news/rss.xml', primary: true },
      { url: 'https://www.aljazeera.com/xml/rss/all.xml', primary: false },
      { url: 'https://feeds.reuters.com/reuters/worldNews', primary: false },
      { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', primary: false },
    ],
  },
  {
    id: 'india',
    label: 'India',
    feeds: [
      { url: 'https://feeds.feedburner.com/ndtvnews-india-news', primary: true },
      { url: 'https://www.thehindu.com/news/national/feeder/default.rss', primary: true },
      { url: 'https://indianexpress.com/feed/', primary: false },
      { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', primary: false },
      { url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', primary: false },
    ],
    keywords: ['India', 'Indian', 'Modi', 'Delhi', 'Mumbai', 'BJP', 'Congress', 'Rupee', 'INR', 'SEBI', 'RBI', 'Supreme Court'],
  },
  {
    id: 'business',
    label: 'Business',
    feeds: [
      // Primary: high-volume fresh feeds
      { url: 'https://feeds.feedburner.com/ndtvnews-business', primary: true },
      { url: 'https://www.thehindu.com/business/feeder/default.rss', primary: true },
      // Good Indian business coverage
      { url: 'https://www.livemint.com/rss/money', primary: false },
      { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', primary: false },
      { url: 'https://feeds.reuters.com/reuters/businessNews', primary: false },
      // Additional high-volume sources
      { url: 'https://timesofindia.indiatimes.com/business/rss.cms', primary: false },
      { url: 'https://www.moneycontrol.com/rss/business.xml', primary: false },
      { url: 'https://indianexpress.com/section/business/feed/', primary: false },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    feeds: [
      { url: 'https://techcrunch.com/feed/', primary: true },
      { url: 'https://feeds.arstechnica.com/arstechnica/index', primary: true },
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', primary: false },
      { url: 'https://www.theverge.com/rss/index.xml', primary: false },
      { url: 'https://feeds.feedburner.com/ndtvnews-tech', primary: false },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/rss.xml', primary: true },
      { url: 'https://feeds.bbci.co.uk/sport/athletics/rss.xml', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-sports', primary: false },
      { url: 'https://sportstar.thehindu.com/feed/', primary: false },
      { url: 'https://timesofindia.indiatimes.com/rss/4719148.cms', primary: false },
      { url: 'https://feeds.reuters.com/reuters/sportsNews', primary: false },
      { url: 'https://www.espn.in/espn/rss/news', primary: false },
    ],
    keywords: ['sport', 'athlete', 'champion', 'tournament', 'medal', 'Olympic', 'F1', 'Formula', 'tennis', 'hockey', 'badminton'],
  },
  {
    id: 'football',
    label: 'Football',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', primary: true },
      { url: 'https://www.skysports.com/rss/12040', primary: true },
      { url: 'https://feeds.reuters.com/reuters/sportsNews', primary: false },
      { url: 'https://www.espn.com/espn/rss/soccer/news', primary: false },
      { url: 'https://www.theguardian.com/football/rss', primary: false },
    ],
    keywords: ['football', 'soccer', 'Premier League', 'Champions League', 'FIFA', 'transfer', 'La Liga', 'Bundesliga', 'goal', 'match', 'Arsenal', 'Chelsea', 'Liverpool', 'Manchester'],
  },
  {
    id: 'cricket',
    label: 'Cricket',
    feeds: [
      { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', primary: true },
      { url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-cricket', primary: false },
      { url: 'https://timesofindia.indiatimes.com/rss/4719165.cms', primary: false },
      { url: 'https://www.cricbuzz.com/cricket-news/rss-feeds', primary: false },
    ],
    keywords: ['cricket', 'Test', 'ODI', 'T20', 'IPL', 'BCCI', 'wicket', 'innings', 'over', 'batting', 'bowling'],
  },
]