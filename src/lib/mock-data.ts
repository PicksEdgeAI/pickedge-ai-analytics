export type League = "NBA" | "NFL" | "MLB" | "NHL" | "UFC" | "Soccer" | "WNBA" | "NCAAF" | "NCAAB";

export interface Game {
  id: string;
  league: League;
  home: string;
  away: string;
  homeLogo?: string;
  awayLogo?: string;
  startTime: string;
  venue: string;
  status: "scheduled" | "live" | "final";
  spread: { home: number; away: number };
  moneyline: { home: number; away: number };
  total: { line: number; over: number; under: number };
  scores?: { home: number; away: number };
}

export interface PlayerProp {
  id: string;
  player: string;
  team: string;
  opponent: string;
  league: League;
  market: string;
  line: number;
  over: number;
  under: number;
  book: string;
  projection: number;
  hitRate: { l5: number; l10: number; l15: number; l20: number };
  recommendation: "OVER" | "UNDER" | "NO PLAY";
  confidence: number;
  trend: number[];
}

export interface Injury {
  id: string;
  player: string;
  team: string;
  league: League;
  status: "Out" | "Questionable" | "Doubtful" | "Day-to-Day";
  detail: string;
  updatedAt: string;
}

export interface LineMove {
  id: string;
  game: string;
  market: string;
  book: string;
  open: number;
  current: number;
  movement: "steam" | "reverse" | "normal";
  pctMoney: number;
  pctBets: number;
  time: string;
}

const now = Date.now();
const t = (h: number) => new Date(now + h * 3600_000).toISOString();

export const mockGames: Game[] = [
  { id: "g1", league: "NBA", home: "Lakers", away: "Celtics", startTime: t(2), venue: "Crypto.com Arena", status: "scheduled",
    spread: { home: -2.5, away: 2.5 }, moneyline: { home: -135, away: +115 }, total: { line: 224.5, over: -110, under: -110 } },
  { id: "g2", league: "NBA", home: "Nuggets", away: "Warriors", startTime: t(4), venue: "Ball Arena", status: "scheduled",
    spread: { home: -4.5, away: 4.5 }, moneyline: { home: -180, away: +155 }, total: { line: 231.5, over: -108, under: -112 } },
  { id: "g3", league: "NFL", home: "Chiefs", away: "Bills", startTime: t(6), venue: "Arrowhead", status: "scheduled",
    spread: { home: -1.5, away: 1.5 }, moneyline: { home: -120, away: +100 }, total: { line: 49.5, over: -110, under: -110 } },
  { id: "g4", league: "NHL", home: "Rangers", away: "Bruins", startTime: t(3), venue: "MSG", status: "scheduled",
    spread: { home: -1.5, away: 1.5 }, moneyline: { home: +105, away: -125 }, total: { line: 6.5, over: -115, under: -105 } },
  { id: "g5", league: "MLB", home: "Dodgers", away: "Padres", startTime: t(5), venue: "Dodger Stadium", status: "scheduled",
    spread: { home: -1.5, away: 1.5 }, moneyline: { home: -150, away: +130 }, total: { line: 8.5, over: -110, under: -110 } },
  { id: "g6", league: "UFC", home: "Aspinall", away: "Pereira", startTime: t(8), venue: "T-Mobile Arena", status: "scheduled",
    spread: { home: 0, away: 0 }, moneyline: { home: -210, away: +175 }, total: { line: 2.5, over: -130, under: +110 } },
  { id: "g7", league: "Soccer", home: "Arsenal", away: "Chelsea", startTime: t(1), venue: "Emirates", status: "live",
    spread: { home: -0.5, away: 0.5 }, moneyline: { home: -140, away: +320 }, total: { line: 2.5, over: -120, under: +100 },
    scores: { home: 1, away: 0 } },
  { id: "g8", league: "NCAAF", home: "Georgia", away: "Alabama", startTime: t(10), venue: "Sanford Stadium", status: "scheduled",
    spread: { home: -3.5, away: 3.5 }, moneyline: { home: -175, away: +150 }, total: { line: 54.5, over: -110, under: -110 } },
];

const trend = (mean: number) => Array.from({ length: 10 }, () => Math.round((mean + (Math.random() - 0.5) * mean * 0.4) * 10) / 10);

export const mockProps: PlayerProp[] = [
  { id: "p1", player: "Luka Dončić", team: "DAL", opponent: "LAL", league: "NBA", market: "Points", line: 32.5,
    over: -115, under: -105, book: "DraftKings", projection: 34.2,
    hitRate: { l5: 0.8, l10: 0.7, l15: 0.67, l20: 0.65 }, recommendation: "OVER", confidence: 78, trend: trend(33) },
  { id: "p2", player: "Nikola Jokić", team: "DEN", opponent: "GSW", league: "NBA", market: "Rebounds", line: 12.5,
    over: -120, under: +100, book: "FanDuel", projection: 13.4,
    hitRate: { l5: 0.6, l10: 0.6, l15: 0.53, l20: 0.55 }, recommendation: "OVER", confidence: 64, trend: trend(13) },
  { id: "p3", player: "Patrick Mahomes", team: "KC", opponent: "BUF", league: "NFL", market: "Passing Yards", line: 274.5,
    over: -110, under: -110, book: "BetMGM", projection: 289,
    hitRate: { l5: 0.6, l10: 0.7, l15: 0.67, l20: 0.65 }, recommendation: "OVER", confidence: 71, trend: trend(280) },
  { id: "p4", player: "Josh Allen", team: "BUF", opponent: "KC", league: "NFL", market: "Rushing Yards", line: 39.5,
    over: -115, under: -105, book: "Caesars", projection: 47,
    hitRate: { l5: 0.8, l10: 0.7, l15: 0.73, l20: 0.7 }, recommendation: "OVER", confidence: 82, trend: trend(45) },
  { id: "p5", player: "Connor McDavid", team: "EDM", opponent: "VGK", league: "NHL", market: "Shots on Goal", line: 4.5,
    over: +105, under: -125, book: "DraftKings", projection: 4.1,
    hitRate: { l5: 0.4, l10: 0.5, l15: 0.47, l20: 0.5 }, recommendation: "UNDER", confidence: 58, trend: trend(4) },
  { id: "p6", player: "Shohei Ohtani", team: "LAD", opponent: "SD", league: "MLB", market: "Total Bases", line: 1.5,
    over: -130, under: +110, book: "FanDuel", projection: 1.8,
    hitRate: { l5: 0.6, l10: 0.6, l15: 0.6, l20: 0.55 }, recommendation: "OVER", confidence: 66, trend: trend(2) },
  { id: "p7", player: "Jayson Tatum", team: "BOS", opponent: "LAL", league: "NBA", market: "Points", line: 27.5,
    over: -110, under: -110, book: "PrizePicks", projection: 28.6,
    hitRate: { l5: 0.6, l10: 0.6, l15: 0.6, l20: 0.6 }, recommendation: "OVER", confidence: 61, trend: trend(28) },
  { id: "p8", player: "Stephen Curry", team: "GSW", opponent: "DEN", league: "NBA", market: "3-Pointers Made", line: 4.5,
    over: -125, under: +105, book: "DraftKings", projection: 4.9,
    hitRate: { l5: 0.6, l10: 0.7, l15: 0.67, l20: 0.65 }, recommendation: "OVER", confidence: 69, trend: trend(5) },
];

export const mockInjuries: Injury[] = [
  { id: "i1", player: "Anthony Davis", team: "LAL", league: "NBA", status: "Questionable", detail: "Lower back tightness — game-time decision.", updatedAt: "2h ago" },
  { id: "i2", player: "Stefon Diggs", team: "HOU", league: "NFL", status: "Out", detail: "Hamstring — ruled out for Sunday.", updatedAt: "45m ago" },
  { id: "i3", player: "Auston Matthews", team: "TOR", league: "NHL", status: "Day-to-Day", detail: "Upper-body, expected to play.", updatedAt: "1h ago" },
  { id: "i4", player: "Ronald Acuña Jr.", team: "ATL", league: "MLB", status: "Out", detail: "Knee — on 10-day IL.", updatedAt: "6h ago" },
  { id: "i5", player: "Bukayo Saka", team: "ARS", league: "Soccer", status: "Doubtful", detail: "Knock from midweek — assessed today.", updatedAt: "30m ago" },
];

export const mockLineMoves: LineMove[] = [
  { id: "lm1", game: "Lakers vs Celtics", market: "Spread LAL -2.5", book: "DraftKings", open: -1.5, current: -2.5, movement: "steam", pctMoney: 72, pctBets: 41, time: "12m ago" },
  { id: "lm2", game: "Chiefs vs Bills", market: "Total 49.5", book: "FanDuel", open: 51, current: 49.5, movement: "reverse", pctMoney: 58, pctBets: 64, time: "28m ago" },
  { id: "lm3", game: "Dodgers vs Padres", market: "ML LAD", book: "BetMGM", open: -135, current: -150, movement: "normal", pctMoney: 61, pctBets: 55, time: "8m ago" },
  { id: "lm4", game: "Rangers vs Bruins", market: "Puck Line BOS -1.5", book: "Caesars", open: +175, current: +155, movement: "steam", pctMoney: 67, pctBets: 38, time: "4m ago" },
];

export const leaderboard = [
  { rank: 1, user: "SharpShark", record: "47-21", roi: "+24.6%", units: "+38.2u" },
  { rank: 2, user: "PropKing", record: "62-39", roi: "+18.1%", units: "+29.7u" },
  { rank: 3, user: "VegasOracle", record: "39-22", roi: "+16.4%", units: "+22.1u" },
  { rank: 4, user: "EdgeFinder", record: "55-37", roi: "+12.9%", units: "+18.4u" },
  { rank: 5, user: "ParlayPro", record: "29-18", roi: "+11.2%", units: "+12.6u" },
];

export const formatOdds = (n: number) => (n > 0 ? `+${n}` : `${n}`);
export const americanToDecimal = (n: number) => (n > 0 ? n / 100 + 1 : 100 / Math.abs(n) + 1);
export const impliedProb = (n: number) => (n > 0 ? 100 / (n + 100) : Math.abs(n) / (Math.abs(n) + 100));