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
      { url: 'https://feeds.reuters.com/reuters/worldNews', primary: true },
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
      { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', primary: true },
      { url: 'https://www.moneycontrol.com/rss/top_headlines.xml', primary: true },
      { url: 'https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml', primary: false },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', primary: true },
      { url: 'https://techcrunch.com/feed/', primary: true },
      { url: 'https://www.theverge.com/rss/index.xml', primary: false },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/rss.xml', primary: true },
      { url: 'https://www.espn.com/espn/rss/news', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-sports', primary: false },
    ],
    keywords: ['sport', 'athlete', 'champion', 'tournament', 'medal', 'Olympic', 'F1', 'Formula', 'tennis', 'hockey', 'badminton'],
  },
  {
    id: 'football',
    label: 'Football',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', primary: true },
      { url: 'https://www.skysports.com/rss/12040', primary: true },
      { url: 'https://www.goal.com/feeds/en/news', primary: false },
    ],
    keywords: ['football', 'soccer', 'Premier League', 'Champions League', 'FIFA', 'transfer', 'La Liga', 'Bundesliga', 'goal', 'match'],
  },
  {
    id: 'cricket',
    label: 'Cricket',
    feeds: [
      { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', primary: true },
      { url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-cricket', primary: false },
    ],
    keywords: ['cricket', 'Test', 'ODI', 'T20', 'IPL', 'BCCI', 'wicket', 'innings', 'over', 'batting', 'bowling'],
  },
]
