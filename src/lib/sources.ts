export type Category = {
  id: string
  label: string
  feeds: { url: string; primary: boolean }[]
  keywords?: string[]
}

/**
 * Trusted CDN domains used for src= image extraction in the RSS fetcher.
 * Also used by next.config.ts to generate the Next.js Image remotePatterns allowlist.
 * Add new domains here when adding feeds that serve images from a new CDN.
 */
export const FEED_IMAGE_DOMAINS: string[] = [
  'ichef.bbci.co.uk',
  'ndtvimg.com',
  'thgim.com',       // The Hindu CDN
  'imgci.com',       // Indian Express CDN
  'espncricinfo.com',
  'skysports.com',
  'espncdn.com',
  'toiimg.com',      // Times of India CDN
  'techcrunch.com',
  'arstechnica.net',
  'aljazeera.com',
  'reuters.com',
  'livemint.com',
  'indianexpress.com',
  'goal.com',
  'thehindu.com',
  'theverge.com',
  'wired.com',
  'theguardian.com',
]

export const CATEGORIES: Category[] = [
  {
    id: 'global',
    label: 'Global',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', primary: true },   // BBC World
      { url: 'https://feeds.bbci.co.uk/news/rss.xml', primary: true },          // BBC Top Stories
      { url: 'https://www.aljazeera.com/xml/rss/all.xml', primary: false },      // Al Jazeera
      { url: 'https://feeds.reuters.com/reuters/worldNews', primary: false },    // Reuters World
      { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', primary: false }, // NYT World
    ],
  },
  {
    id: 'india',
    label: 'India',
    feeds: [
      { url: 'https://feeds.feedburner.com/ndtvnews-india-news', primary: true },    // NDTV India
      { url: 'https://www.thehindu.com/news/national/feeder/default.rss', primary: true }, // The Hindu National
      { url: 'https://indianexpress.com/feed/', primary: false },                     // Indian Express
      { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', primary: false }, // TOI Top Stories
      { url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', primary: false }, // HT India
    ],
    keywords: ['India', 'Indian', 'Modi', 'Delhi', 'Mumbai', 'BJP', 'Congress', 'Rupee', 'INR', 'SEBI', 'RBI', 'Supreme Court'],
  },
  {
    id: 'business',
    label: 'Business',
    feeds: [
      { url: 'https://www.thehindu.com/business/feeder/default.rss', primary: true },       // The Hindu Business
      { url: 'https://www.livemint.com/rss/money', primary: true },                          // Livemint
      { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', primary: false }, // Economic Times
      { url: 'https://feeds.reuters.com/reuters/businessNews', primary: false },              // Reuters Business
      { url: 'https://timesofindia.indiatimes.com/business/rss.cms', primary: false },        // TOI Business
      { url: 'https://www.moneycontrol.com/rss/business.xml', primary: false },               // Moneycontrol
      { url: 'https://indianexpress.com/section/business/feed/', primary: false },            // IE Business
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    feeds: [
      { url: 'https://techcrunch.com/feed/', primary: true },                           // TechCrunch
      { url: 'https://feeds.arstechnica.com/arstechnica/index', primary: true },        // Ars Technica
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', primary: false },      // BBC Tech
      { url: 'https://www.theverge.com/rss/index.xml', primary: false },                // The Verge
      { url: 'https://www.wired.com/feed/rss', primary: false },                        // Wired
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/rss.xml', primary: true },               // BBC Sport (general)
      { url: 'https://feeds.bbci.co.uk/sport/athletics/rss.xml', primary: true },     // BBC Athletics
      { url: 'https://sportstar.thehindu.com/feed/', primary: false },                 // Sportstar (The Hindu)
      { url: 'https://timesofindia.indiatimes.com/rss/4719148.cms', primary: false },  // TOI Sports
      { url: 'https://feeds.reuters.com/reuters/sportsNews', primary: false },         // Reuters Sports
      { url: 'https://www.espn.in/espn/rss/news', primary: false },                    // ESPN India
    ],
    keywords: ['sport', 'athlete', 'champion', 'tournament', 'medal', 'Olympic', 'F1', 'Formula', 'tennis', 'hockey', 'badminton'],
  },
  {
    id: 'football',
    label: 'Football',
    feeds: [
      { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', primary: true },      // BBC Football
      { url: 'https://www.skysports.com/rss/12040', primary: true },                   // Sky Sports Football
      { url: 'https://feeds.reuters.com/reuters/sportsNews', primary: false },         // Reuters Sports (shared)
      { url: 'https://www.espn.com/espn/rss/soccer/news', primary: false },            // ESPN Soccer
      { url: 'https://www.theguardian.com/football/rss', primary: false },             // The Guardian Football
    ],
    keywords: ['football', 'soccer', 'Premier League', 'Champions League', 'FIFA', 'transfer', 'La Liga', 'Bundesliga', 'goal', 'match', 'Arsenal', 'Chelsea', 'Liverpool', 'Manchester'],
  },
  {
    id: 'cricket',
    label: 'Cricket',
    feeds: [
      { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', primary: true }, // ESPNcricinfo
      { url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml', primary: true },             // BBC Cricket
      { url: 'https://timesofindia.indiatimes.com/rss/4719165.cms', primary: false },        // TOI Cricket
      { url: 'https://www.cricbuzz.com/cricket-news/rss-feeds', primary: false },            // Cricbuzz
    ],
    keywords: ['cricket', 'Test', 'ODI', 'T20', 'IPL', 'BCCI', 'wicket', 'innings', 'over', 'batting', 'bowling'],
  },
]