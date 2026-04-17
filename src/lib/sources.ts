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
      // Reuters Business — reliably includes media:thumbnail images
      { url: 'https://feeds.reuters.com/reuters/businessNews', primary: true },
      // Livemint — good Indian business coverage with images
      { url: 'https://www.livemint.com/rss/money', primary: true },
      // ET as fallback — text-only but good headlines
      { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', primary: false },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    feeds: [
      // TechCrunch — includes enclosure images reliably
      { url: 'https://techcrunch.com/feed/', primary: true },
      // Ars Technica — excellent images in feed
      { url: 'https://feeds.arstechnica.com/arstechnica/index', primary: true },
      // BBC Tech as fallback — consistent BBC images
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', primary: false },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/rss.xml', primary: true },
      { url: 'https://www.espn.com/espn/rss/news', primary: true },
      { url: 'https://feeds.feedburner.com/ndtvnews-sports', primary: false },
      { url: 'https://www.skysports.com/rss/12040', primary: false },           // Sky Sports — rich images, broad coverage
      { url: 'https://sportstar.thehindu.com/feed/', primary: false },          // Sportstar (Hindu) — strong India sports coverage
      { url: 'https://www.goal.com/feeds/en/news', primary: false },            // Goal.com — good for non-football overflow too
      { url: 'https://timesofindia.indiatimes.com/rss/4719148.cms', primary: false }, // TOI Sports — India-focused, image-rich
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
