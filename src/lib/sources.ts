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
    ],
  },
  {
    id: 'india',
    label: 'India',
    feeds: [
      { url: 'https://feeds.feedburner.com/ndtvnews-india-news', primary: true },
      { url: 'https://www.thehindu.com/news/national/feeder/default.rss', primary: true },
      { url: 'https://indianexpress.com/feed/', primary: false },
    ],
    keywords: ['India', 'Indian', 'Modi', 'Delhi', 'Mumbai', 'BJP', 'Congress', 'Rupee', 'INR', 'SEBI', 'RBI', 'Supreme Court'],
  },
  {
    id: 'business',
    label: 'Business',
    feeds: [
      { url: 'https://feeds.reuters.com/reuters/businessNews', primary: true },
      { url: 'https://www.livemint.com/rss/money', primary: true },
      { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', primary: false },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    feeds: [
      { url: 'https://techcrunch.com/feed/', primary: true },
      { url: 'https://feeds.arstechnica.com/arstechnica/index', primary: true },
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', primary: false },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/rss.xml', primary: true },
      // BBC Sport publishes news-only items frequently — good freshness
      { url: 'https://feeds.bbci.co.uk/sport/athletics/rss.xml', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-sports', primary: false },
      { url: 'https://sportstar.thehindu.com/feed/', primary: false },
      { url: 'https://timesofindia.indiatimes.com/rss/4719148.cms', primary: false },
      // Reuters Sports — globally fresh, image-rich
      { url: 'https://feeds.reuters.com/reuters/sportsNews', primary: false },
      // ESPN India — fresher than espn.com global
      { url: 'https://www.espn.in/espn/rss/news', primary: false },
    ],
    keywords: ['sport', 'athlete', 'champion', 'tournament', 'medal', 'Olympic', 'F1', 'Formula', 'tennis', 'hockey', 'badminton'],
  },
  {
    id: 'football',
    label: 'Football',
    feeds: [
      // BBC Football — highest freshness, multiple daily stories
      { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', primary: true },
      // Sky Sports Football specifically — fresher than the general /12040 feed
      { url: 'https://www.skysports.com/rss/12040', primary: true },
      // Reuters Football — fresh match reports and transfer news
      { url: 'https://feeds.reuters.com/reuters/sportsNews', primary: false },
      // ESPN FC
      { url: 'https://www.espn.com/espn/rss/soccer/news', primary: false },
      // The Guardian Football
      { url: 'https://www.theguardian.com/football/rss', primary: false },
    ],
    keywords: ['football', 'soccer', 'Premier League', 'Champions League', 'FIFA', 'transfer', 'La Liga', 'Bundesliga', 'goal', 'match', 'Arsenal', 'Chelsea', 'Liverpool', 'Manchester'],
  },
  {
    id: 'cricket',
    label: 'Cricket',
    feeds: [
      // ESPN Cricinfo — highest volume of fresh cricket content
      { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', primary: true },
      { url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-cricket', primary: false },
      // Times of India Cricket — good IPL coverage
      { url: 'https://timesofindia.indiatimes.com/rss/4719165.cms', primary: false },
      // Cricbuzz RSS
      { url: 'https://www.cricbuzz.com/cricket-news/rss-feeds', primary: false },
    ],
    keywords: ['cricket', 'Test', 'ODI', 'T20', 'IPL', 'BCCI', 'wicket', 'innings', 'over', 'batting', 'bowling'],
  },
]