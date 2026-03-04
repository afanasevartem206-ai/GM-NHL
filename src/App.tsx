import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NHL_TEAMS, type TeamData, type RealPlayer } from './nhlData';

// ─── TYPES ───────────────────────────────────────────────────────────
interface PlayerStats {
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  gamesPlayed: number;
  toi: string;
  gaa?: number;
  savePct?: number;
  wins?: number;
  shutouts?: number;
  shots?: number;
  hits?: number;
  blocks?: number;
  pim?: number;
  ppGoals?: number;
  shGoals?: number;
  gwGoals?: number;
  faceoffPct?: number;
}

interface NHLPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  sweaterNumber: number;
  age: number;
  ovr: number;
  salary: number;
  teamAbbrev: string;
  headshot: string;
  isFreeAgent?: boolean;
  stats?: PlayerStats;
  prevStats?: PlayerStats;
  statsLoaded?: boolean;
  birthCountry?: string;
  birthCity?: string;
  heightInCm?: number;
  weightInKg?: number;
  shootsCatches?: string;
}

interface NHLTeam {
  abbrev: string;
  name: string;
  logo: string;
  conference: string;
  division: string;
  color: string;
  players: NHLPlayer[];
  apiLoaded?: boolean;
  statsLoaded?: boolean;
}

interface Lines {
  forwards: (NHLPlayer | null)[][];
  defense: (NHLPlayer | null)[][];
  goalies: (NHLPlayer | null)[];
}

interface StandingsTeam {
  abbrev: string;
  name: string;
  logo: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  division: string;
  conference: string;
}

interface TradeOffer {
  fromTeam: string;
  toTeam: string;
  playersFrom: NHLPlayer[];
  playersTo: NHLPlayer[];
}

type Page = 'select' | 'dashboard' | 'roster' | 'trade' | 'freeagency' | 'lines' | 'standings';

// ─── COUNTRY FLAGS ──────────────────────────────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
  'CAN': '🇨🇦', 'USA': '🇺🇸', 'SWE': '🇸🇪', 'FIN': '🇫🇮', 'RUS': '🇷🇺',
  'CZE': '🇨🇿', 'SVK': '🇸🇰', 'CHE': '🇨🇭', 'DEU': '🇩🇪', 'DNK': '🇩🇰',
  'NOR': '🇳🇴', 'LVA': '🇱🇻', 'LTU': '🇱🇹', 'AUT': '🇦🇹', 'SVN': '🇸🇮',
  'BLR': '🇧🇾', 'UKR': '🇺🇦', 'GBR': '🇬🇧', 'FRA': '🇫🇷', 'AUS': '🇦🇺',
  'NLD': '🇳🇱', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'HRV': '🇭🇷', 'EST': '🇪🇪',
  'KAZ': '🇰🇿', 'NGA': '🇳🇬', 'HTI': '🇭🇹', 'JAM': '🇯🇲', 'BHS': '🇧🇸',
  'CA': '🇨🇦', 'US': '🇺🇸', 'SE': '🇸🇪', 'FI': '🇫🇮', 'RU': '🇷🇺',
  'CZ': '🇨🇿', 'SK': '🇸🇰', 'CH': '🇨🇭', 'DE': '🇩🇪', 'DK': '🇩🇰',
  'NO': '🇳🇴', 'LV': '🇱🇻', 'LT': '🇱🇹', 'AT': '🇦🇹', 'SI': '🇸🇮',
  'BY': '🇧🇾', 'UA': '🇺🇦', 'GB': '🇬🇧', 'FR': '🇫🇷', 'AU': '🇦🇺',
  'NL': '🇳🇱', 'JP': '🇯🇵', 'KR': '🇰🇷', 'HR': '🇭🇷', 'EE': '🇪🇪',
  'KZ': '🇰🇿', 'BGR': '🇧🇬', 'BG': '🇧🇬',
};

const COUNTRY_NAMES: Record<string, string> = {
  'CAN': 'Канада', 'USA': 'США', 'SWE': 'Швеция', 'FIN': 'Финляндия', 'RUS': 'Россия',
  'CZE': 'Чехия', 'SVK': 'Словакия', 'CHE': 'Швейцария', 'DEU': 'Германия', 'DNK': 'Дания',
  'NOR': 'Норвегия', 'LVA': 'Латвия', 'LTU': 'Литва', 'AUT': 'Австрия', 'SVN': 'Словения',
  'BLR': 'Беларусь', 'UKR': 'Украина', 'GBR': 'Великобритания', 'FRA': 'Франция', 'AUS': 'Австралия',
  'CA': 'Канада', 'US': 'США', 'SE': 'Швеция', 'FI': 'Финляндия', 'RU': 'Россия',
  'CZ': 'Чехия', 'SK': 'Словакия', 'CH': 'Швейцария', 'DE': 'Германия', 'DK': 'Дания',
  'NO': 'Норвегия', 'LV': 'Латвия', 'LT': 'Литва', 'AT': 'Австрия', 'SI': 'Словения',
  'BY': 'Беларусь', 'UA': 'Украина', 'GB': 'Великобритания', 'FR': 'Франция', 'AU': 'Австралия',
  'BGR': 'Болгария', 'BG': 'Болгария',
};

function getFlag(country?: string): string {
  if (!country) return '';
  return COUNTRY_FLAGS[country] || COUNTRY_FLAGS[country.toUpperCase()] || '🏳️';
}

function getCountryName(country?: string): string {
  if (!country) return 'Неизвестно';
  return COUNTRY_NAMES[country] || COUNTRY_NAMES[country.toUpperCase()] || country;
}

// ─── PLAYER NATIONALITY GUESSING (for fallback data) ────────────────
const NATIONALITY_MAP: Record<string, string> = {
  // well-known players with their nationalities
  'McDavid': 'CAN', 'Draisaitl': 'DEU', 'Crosby': 'CAN', 'Ovechkin': 'RUS',
  'MacKinnon': 'CAN', 'Matthews': 'USA', 'Makar': 'CAN', 'Panarin': 'RUS',
  'Kucherov': 'RUS', 'Pastrnak': 'CZE', 'Barkov': 'FIN', 'Kaprizov': 'RUS',
  'Tkachuk': 'USA', 'Marner': 'CAN', 'Nylander': 'SWE', 'Pettersson': 'SWE',
  'Hughes': 'USA', 'Fox': 'USA', 'Hedman': 'SWE', 'Josi': 'CHE',
  'Dahlin': 'SWE', 'Vasilevskiy': 'RUS', 'Shesterkin': 'RUS', 'Sorokin': 'RUS',
  'Hellebuyck': 'USA', 'Saros': 'FIN', 'Rantanen': 'FIN', 'Aho': 'FIN',
  'Svechnikov': 'RUS', 'Zibanejad': 'SWE', 'Kreider': 'USA', 'Eichel': 'USA',
  'Stone': 'CAN', 'Huberdeau': 'CAN', 'Kadri': 'CAN', 'Stamkos': 'CAN',
  'Point': 'CAN', 'Hagel': 'CAN', 'Cirelli': 'CAN', 'Scheifele': 'CAN',
  'Connor': 'USA', 'Ehlers': 'DNK', 'Morrissey': 'CAN', 'Forsberg': 'SWE',
  'Robertson': 'USA', 'Hintz': 'FIN', 'Heiskanen': 'FIN', 'Oettinger': 'USA',
  'Larkin': 'USA', 'Raymond': 'SWE', 'DeBrincat': 'USA', 'Kane': 'USA',
  'Seider': 'DEU', 'Suzuki': 'CAN', 'Caufield': 'USA', 'Slafkovsky': 'SVK',
  'Bedard': 'CAN', 'Kopitar': 'SVN', 'Kempe': 'SWE', 'Fiala': 'CHE',
  'Doughty': 'CAN', 'Barzal': 'CAN', 'Horvat': 'CAN', 'Dobson': 'CAN',
  'Konecny': 'CAN', 'Couturier': 'CAN', 'Sanheim': 'CAN', 'Reinhart': 'CAN',
  'Bennett': 'CAN', 'Ekblad': 'CAN', 'Forsling': 'SWE', 'Bobrovsky': 'RUS',
  'Stutzle': 'DEU', 'Chabot': 'CAN', 'Sanderson': 'USA', 'Thompson': 'USA',
  'Cozens': 'CAN', 'Tuch': 'USA', 'Gaudreau': 'USA', 'Werenski': 'USA',
  'Laine': 'FIN', 'Hischier': 'CHE', 'Bratt': 'SWE', 'Hamilton': 'CAN',
  'Carlson': 'USA', 'Trocheck': 'USA', 'Rielly': 'CAN', 'Tavares': 'CAN',
  'Letang': 'CAN', 'Malkin': 'RUS', 'Rust': 'USA', 'Guentzel': 'USA',
  'Thomas': 'CAN', 'Kyrou': 'CAN', 'Buchnevich': 'RUS', 'Parayko': 'CAN',
  'Binnington': 'CAN', 'Markstrom': 'SWE', 'Andersson': 'SWE', 'Weegar': 'CAN',
  'McCann': 'CAN', 'Beniers': 'USA', 'Dunn': 'CAN', 'Grubauer': 'DEU',
  'Keller': 'USA', 'Schmaltz': 'USA', 'Cooley': 'USA', 'Guenther': 'CAN',
  'Pietrangelo': 'CAN', 'Theodore': 'CAN', 'Hanifin': 'USA', 'Hill': 'CAN',
  'Miller': 'USA', 'Boeser': 'USA', 'Garland': 'USA', 'Kuzmenko': 'RUS',
  'Demko': 'USA', 'Hronek': 'CZE', 'Myers': 'USA', 'Strome': 'CAN',
  'Domi': 'CAN', 'Bertuzzi': 'CAN', 'Woll': 'USA', 'Samsonov': 'RUS',
  'McAvoy': 'USA', 'Lindholm': 'SWE', 'Swayman': 'USA', 'Ullmark': 'SWE',
  'Marchand': 'CAN', 'Zacha': 'CZE', 'DeBrusk': 'CAN', 'Slavin': 'USA',
  'Burns': 'CAN', 'Andersen': 'DNK', 'Kochetkov': 'RUS', 'Necas': 'CZE',
  'Teravainen': 'FIN', 'Georgiev': 'RUS', 'Toews': 'CAN', 'Girard': 'CAN',
  'Manson': 'CAN', 'Sergachev': 'RUS', 'Cernak': 'SVK', 'Verhaeghe': 'CAN',
  'Lundell': 'FIN', 'Montour': 'CAN', 'Stolarz': 'USA', 'Hertl': 'CZE',
  'Couture': 'CAN', 'Karlsson': 'SWE', 'Blackwood': 'CAN', 'Zegras': 'USA',
  'McTavish': 'CAN', 'Carlsson': 'SWE', 'Terry': 'USA', 'Gibson': 'USA',
  'Dostal': 'CZE', 'Fowler': 'USA', 'Mintyukov': 'RUS', 'Zellweger': 'CAN',
  'Peterka': 'DEU', 'Luukkonen': 'FIN', 'Levi': 'CAN', 'Tanev': 'CAN',
  'Skjei': 'USA', 'Orlov': 'RUS', 'Jones': 'USA', 'Vlasic': 'USA',
  'Korchinski': 'CAN', 'Nichushkin': 'RUS', 'Mittelstadt': 'USA', 'Colton': 'USA',
  'Merzlikins': 'LVA', 'Fantilli': 'CAN', 'Marchenko': 'RUS', 'Provorov': 'RUS',
  'Severson': 'CAN', 'Seguin': 'CAN', 'Benn': 'CAN', 'Johnston': 'CAN',
  'Marchment': 'CAN', 'Duchene': 'CAN', 'Suter': 'USA', 'Lindell': 'FIN',
  'Perron': 'CAN', 'Compher': 'USA', 'Husso': 'FIN', 'Lyon': 'USA',
  'Hyman': 'CAN', 'Nugent-Hopkins': 'CAN', 'Bouchard': 'CAN', 'Nurse': 'CAN',
  'Ekholm': 'SWE', 'Skinner': 'CAN', 'Campbell': 'USA', 'Byfield': 'CAN',
  'Danault': 'CAN', 'Dubois': 'CAN', 'Vilardi': 'CAN', 'Talbot': 'CAN',
  'Boldy': 'USA', 'Eriksson Ek': 'SWE', 'Rossi': 'AUT', 'Zuccarello': 'NOR',
  'Gustavsson': 'SWE', 'Fleury': 'CAN', 'Matheson': 'CAN', 'Guhle': 'CAN',
  'Xhekaj': 'CAN', 'Montembeault': 'CAN', 'OReilly': 'CAN', 'Nyquist': 'SWE',
  'Vanecek': 'CZE', 'Schmid': 'CHE', 'Palat': 'CZE', 'Toffoli': 'CAN',
  'Nelson': 'USA', 'Lee': 'CAN', 'Palmieri': 'USA', 'Pageau': 'CAN',
  'Pelech': 'CAN', 'Pulock': 'CAN', 'Varlamov': 'RUS', 'Lafreniere': 'CAN',
  'Kakko': 'FIN', 'Chytil': 'CZE', 'Quick': 'USA', 'Giroux': 'CAN',
  'Batherson': 'CAN', 'Norris': 'CAN', 'Pinto': 'CAN', 'Tarasenko': 'RUS',
  'Hart': 'CAN', 'Ersson': 'SWE', 'Tippett': 'USA',
  'Foerster': 'CAN', 'Farabee': 'USA', 'Frost': 'CAN', 'Jarry': 'CAN',
  'Nedeljkovic': 'CAN', 'Rakell': 'SWE', 'Ferraro': 'CAN', 'Granlund': 'FIN',
  'Eklund': 'SWE', 'Zetterlund': 'SWE', 'Eberle': 'CAN', 'Bjorkstrand': 'DNK',
  'Burakovsky': 'AUT', 'Gourde': 'CAN', 'Schwartz': 'CAN', 'Larsson': 'SWE',
  'Daccord': 'USA', 'Wright': 'CAN', 'Krug': 'USA', 'Faulk': 'USA',
  'Hofer': 'CAN', 'Arvidsson': 'SWE', 'Laferriere': 'USA', 'Rittich': 'CZE',
  'Perfetti': 'CAN', 'Lowry': 'CAN', 'Niederreiter': 'CHE', 'Pionk': 'USA',
  'Brossoit': 'CAN', 'Kuemper': 'CAN', 'Lindgren': 'USA', 'Fehervary': 'SVK',
  'McMichael': 'CAN', 'Protas': 'BLR', 'Lapierre': 'CAN', 'Ingram': 'CAN',
  'Vejmelka': 'CZE', 'Durzi': 'CAN', 'Crouse': 'CAN',
  'Maccelli': 'FIN', 'Doan': 'CAN', 'Knies': 'USA', 'Liljegren': 'SWE',
};

function guessNationality(lastName: string): string {
  return NATIONALITY_MAP[lastName] || 'CAN'; // Default to CAN (most NHL players)
}

// ─── OVR CALCULATION FROM REAL STATS ────────────────────────────────
function calculateOVR(pos: string, stats?: PlayerStats, prevStats?: PlayerStats, age?: number): number {
  if (!stats && !prevStats) {
    const a = age || 25;
    const base = pos === 'G' ? 76 : 75;
    const agePrime = pos === 'G' ? 29 : 27;
    const ageDiff = Math.abs(a - agePrime);
    return Math.max(65, Math.min(82, base - Math.max(0, ageDiff - 4) * 2));
  }
  if (pos === 'G') return calculateGoalieOVR(stats, prevStats);

  const cur = stats || { goals: 0, assists: 0, points: 0, plusMinus: 0, gamesPlayed: 0, toi: '0:00' };
  const prev = prevStats || { goals: 0, assists: 0, points: 0, plusMinus: 0, gamesPlayed: 0, toi: '0:00' };
  const curGP = Math.max(cur.gamesPlayed, 1);
  const prevGP = Math.max(prev.gamesPlayed, 1);
  const curPPG = cur.points / curGP;
  const prevPPG = prev.points / prevGP;
  const curGPG = cur.goals / curGP;
  const prevGPG = prev.goals / prevGP;
  const hasCurrentSeason = cur.gamesPlayed >= 5;
  const hasPrevSeason = prev.gamesPlayed >= 10;

  let weightedPPG: number, weightedGPG: number, weightedPM: number;
  if (hasCurrentSeason && hasPrevSeason) {
    weightedPPG = curPPG * 0.7 + prevPPG * 0.3;
    weightedGPG = curGPG * 0.7 + prevGPG * 0.3;
    weightedPM = (cur.plusMinus / curGP) * 0.7 + (prev.plusMinus / prevGP) * 0.3;
  } else if (hasCurrentSeason) {
    weightedPPG = curPPG; weightedGPG = curGPG; weightedPM = cur.plusMinus / curGP;
  } else if (hasPrevSeason) {
    weightedPPG = prevPPG; weightedGPG = prevGPG; weightedPM = prev.plusMinus / prevGP;
  } else { return 72; }

  let ovr: number;
  if (pos === 'D') {
    ovr = 68 + weightedPPG * 22 + Math.max(0, weightedPM) * 2;
    if (weightedPPG > 0.8) ovr += 3;
    if (weightedPPG > 0.6) ovr += 2;
  } else {
    ovr = 65 + weightedPPG * 18 + weightedGPG * 6;
    if (weightedGPG > 0.5) ovr += 3;
    if (weightedGPG > 0.4) ovr += 2;
    if (weightedPPG > 1.0) ovr += 3;
    if (weightedPPG > 0.8) ovr += 2;
  }
  if (weightedPM > 0.3) ovr += 2;
  if (weightedPM < -0.3) ovr -= 1;
  const totalGP = cur.gamesPlayed + prev.gamesPlayed;
  if (totalGP > 140) ovr += 1;
  if (totalGP < 30 && !hasCurrentSeason) ovr -= 2;
  const a = age || 27;
  if (a > 36) ovr -= 2;
  if (a > 38) ovr -= 2;
  if (a < 22 && ovr > 80) ovr += 1;
  return Math.max(62, Math.min(99, Math.round(ovr)));
}

function calculateGoalieOVR(stats?: PlayerStats, prevStats?: PlayerStats): number {
  const cur = stats;
  const prev = prevStats;
  const hasC = cur && cur.gamesPlayed >= 3;
  const hasP = prev && prev.gamesPlayed >= 5;

  let svPct: number, gaa: number, wPct: number;
  if (hasC && hasP) {
    svPct = ((cur.savePct || 0.900) * 0.7 + (prev!.savePct || 0.900) * 0.3);
    gaa = ((cur.gaa || 3.0) * 0.7 + (prev!.gaa || 3.0) * 0.3);
    wPct = (((cur.wins || 0) / Math.max(cur.gamesPlayed, 1)) * 0.7 +
      ((prev!.wins || 0) / Math.max(prev!.gamesPlayed, 1)) * 0.3);
  } else if (hasC) {
    svPct = cur!.savePct || 0.900; gaa = cur!.gaa || 3.0;
    wPct = (cur!.wins || 0) / Math.max(cur!.gamesPlayed, 1);
  } else if (hasP) {
    svPct = prev!.savePct || 0.900; gaa = prev!.gaa || 3.0;
    wPct = (prev!.wins || 0) / Math.max(prev!.gamesPlayed, 1);
  } else { return 75; }

  let ovr = 68;
  ovr += (svPct - 0.890) * 300;
  ovr -= Math.max(0, gaa - 2.5) * 3;
  ovr += wPct * 8;
  ovr += (stats?.shutouts || 0) * 0.5;
  return Math.max(65, Math.min(96, Math.round(ovr)));
}

// ─── CONVERT FALLBACK DATA ──────────────────────────────────────────
let globalPlayerId = 1;

function convertFallbackPlayer(rp: RealPlayer, teamAbbrev: string): NHLPlayer {
  return {
    id: globalPlayerId++,
    firstName: rp.fn,
    lastName: rp.ln,
    position: rp.pos,
    sweaterNumber: rp.num,
    age: rp.age,
    ovr: rp.ovr,
    salary: rp.sal,
    teamAbbrev,
    headshot: '',
    statsLoaded: false,
    birthCountry: rp.nat || guessNationality(rp.ln),
  };
}

function buildTeamsFromFallback(): NHLTeam[] {
  return NHL_TEAMS.map((td: TeamData) => ({
    abbrev: td.abbrev,
    name: td.name,
    logo: `https://assets.nhle.com/logos/nhl/svg/${td.abbrev}_light.svg`,
    conference: td.conference,
    division: td.division,
    color: td.color,
    players: td.players.map(rp => convertFallbackPlayer(rp, td.abbrev)),
    apiLoaded: false,
    statsLoaded: false,
  }));
}

// ─── NHL API ─────────────────────────────────────────────────────────
// Сначала пытаемся загрузить с бэкенда (localhost:3001), потом через CORS-прокси
const BACKEND_URL = 'http://localhost:3001';

const PROXIES = [
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
];

let useBackend = false;
let backendChecked = false;

async function checkBackend(): Promise<boolean> {
  if (backendChecked) return useBackend;
  backendChecked = true;
  try {
    const r = await fetch(`${BACKEND_URL}/api/status`, { signal: AbortSignal.timeout(2000) });
    if (r.ok) { useBackend = true; console.log('✅ Бэкенд найден на localhost:3001'); return true; }
  } catch { /* no backend */ }
  console.log('📡 Бэкенд не найден, используем CORS-прокси');
  return false;
}

async function fetchNHL(path: string): Promise<unknown | null> {
  // Пробуем бэкенд
  if (useBackend) {
    try {
      // Маппинг путей бэкенда
      let backendPath = path;
      if (path.startsWith('/roster/')) backendPath = `/api/team/${path.split('/')[2]}`;
      else if (path.startsWith('/club-stats/')) backendPath = `/api/team/${path.split('/')[2]}`;
      else if (path === '/standings/now') backendPath = '/api/standings';

      const r = await fetch(`${BACKEND_URL}${backendPath}`, { signal: AbortSignal.timeout(5000) });
      if (r.ok) return await r.json();
    } catch { /* fallback to proxies */ }
  }

  // Прямой запрос (может сработать если нет CORS)
  const url = `https://api-web.nhle.com/v1${path}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (r.ok) return r.json();
  } catch { /* CORS */ }

  // CORS прокси
  for (const proxy of PROXIES) {
    try {
      const r = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
      if (r.ok) {
        const text = await r.text();
        try { return JSON.parse(text); } catch { /* not json */ }
      }
    } catch { /* next */ }
  }
  return null;
}

function calcAge(birthDate: string | undefined): number {
  if (!birthDate) return 25;
  const d = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age || 25;
}

async function loadRosterFromAPI(abbrev: string): Promise<NHLPlayer[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await fetchNHL(`/roster/${abbrev}/current`);
  if (!data) return null;
  const players: NHLPlayer[] = [];
  const sections: [string, string][] = [['forwards', ''], ['defensemen', 'D'], ['goalies', 'G']];
  for (const [section, defaultPos] of sections) {
    const list = data[section];
    if (!Array.isArray(list)) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const p of list as any[]) {
      const firstName = typeof p.firstName === 'object' ? p.firstName?.default : p.firstName || '';
      const lastName = typeof p.lastName === 'object' ? p.lastName?.default : p.lastName || '';
      let pos = defaultPos || p.positionCode || 'C';
      // Convert position codes: L→LW, R→RW
      if (pos === 'L') pos = 'LW';
      if (pos === 'R') pos = 'RW';
      const age = calcAge(p.birthDate);
      const birthCountry = p.birthCountry || p.nationality || guessNationality(lastName);
      const birthCity = typeof p.birthCity === 'object' ? p.birthCity?.default : p.birthCity || '';

      players.push({
        id: p.id || globalPlayerId++,
        firstName,
        lastName,
        position: pos,
        sweaterNumber: p.sweaterNumber || 0,
        age,
        ovr: 75,
        salary: Math.round((Math.random() * 8 + 0.8) * 10) / 10,
        teamAbbrev: abbrev,
        headshot: p.headshot || '',
        statsLoaded: false,
        birthCountry,
        birthCity,
        heightInCm: p.heightInCentimeters || undefined,
        weightInKg: p.weightInKilograms || undefined,
        shootsCatches: p.shootsCatches || undefined,
      });
    }
  }
  return players.length > 5 ? players : null;
}

// ─── LOAD PLAYER STATS FROM API ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSkaterStats(s: any): PlayerStats {
  return {
    goals: s.goals ?? 0, assists: s.assists ?? 0, points: s.points ?? 0,
    plusMinus: s.plusMinus ?? 0, gamesPlayed: s.gamesPlayed ?? 0,
    toi: s.avgTimeOnIce ?? s.avgToi ?? '0:00',
    shots: s.shots ?? undefined, hits: s.hits ?? undefined,
    blocks: s.blockedShots ?? s.blocks ?? undefined,
    pim: s.penaltyMinutes ?? s.pim ?? undefined,
    ppGoals: s.powerPlayGoals ?? s.ppGoals ?? undefined,
    shGoals: s.shorthandedGoals ?? s.shGoals ?? undefined,
    gwGoals: s.gameWinningGoals ?? s.gwGoals ?? undefined,
    faceoffPct: s.faceoffWinPctg ?? s.faceoffPct ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseGoalieStats(g: any): PlayerStats {
  return {
    goals: 0, assists: 0, points: 0, plusMinus: 0,
    gamesPlayed: g.gamesPlayed ?? 0,
    toi: g.avgTimeOnIce ?? g.avgToi ?? '0:00',
    gaa: g.goalsAgainstAverage ?? g.goalsAgainstAvg ?? undefined,
    savePct: g.savePercentage ?? g.savePctg ?? undefined,
    wins: g.wins ?? 0, shutouts: g.shutouts ?? 0,
  };
}

async function loadTeamStats(abbrev: string, season?: string): Promise<Map<string, PlayerStats>> {
  const path = season ? `/club-stats/${abbrev}/${season}` : `/club-stats/${abbrev}/now`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await fetchNHL(path);
  const statsMap = new Map<string, PlayerStats>();
  if (!data) return statsMap;
  const skaters = data.skaters || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const s of skaters as any[]) {
    const fn = typeof s.firstName === 'object' ? s.firstName?.default : s.firstName || '';
    const ln = typeof s.lastName === 'object' ? s.lastName?.default : s.lastName || '';
    const key = `${fn}_${ln}`.toLowerCase();
    statsMap.set(key, parseSkaterStats(s));
    if (s.playerId) statsMap.set(`id_${s.playerId}`, parseSkaterStats(s));
  }
  const goalies = data.goalies || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const g of goalies as any[]) {
    const fn = typeof g.firstName === 'object' ? g.firstName?.default : g.firstName || '';
    const ln = typeof g.lastName === 'object' ? g.lastName?.default : g.lastName || '';
    const key = `${fn}_${ln}`.toLowerCase();
    statsMap.set(key, parseGoalieStats(g));
    if (g.playerId) statsMap.set(`id_${g.playerId}`, parseGoalieStats(g));
  }
  return statsMap;
}

async function loadStandingsFromAPI(): Promise<StandingsTeam[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await fetchNHL('/standings/now');
  if (!data?.standings) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.standings.map((t: any) => ({
    abbrev: typeof t.teamAbbrev === 'object' ? t.teamAbbrev?.default : t.teamAbbrev || '',
    name: typeof t.teamName === 'object' ? t.teamName?.default : t.teamName || '',
    logo: t.teamLogo || '',
    gamesPlayed: t.gamesPlayed || 0, wins: t.wins || 0, losses: t.losses || 0,
    otLosses: t.otLosses || 0, points: t.points || 0,
    goalsFor: t.goalFor || 0, goalsAgainst: t.goalAgainst || 0,
    division: t.divisionName || '', conference: t.conferenceName || '',
  }));
}

// ─── FREE AGENTS ─────────────────────────────────────────────────────
function generateFreeAgents(): NHLPlayer[] {
  const agents: [string, string, string, number, number, number, string][] = [
    ['Max', 'Pacioretty', 'LW', 34, 76, 2.0, 'USA'],
    ['Eric', 'Staal', 'C', 39, 72, 1.0, 'CAN'],
    ['Phil', 'Kessel', 'RW', 36, 75, 1.5, 'USA'],
    ['Tyler', 'Johnson', 'C', 34, 74, 1.0, 'USA'],
    ['Sam', 'Gagner', 'C', 34, 72, 0.9, 'CAN'],
    ['Zach', 'Aston-Reese', 'LW', 30, 71, 0.8, 'USA'],
    ['Derick', 'Brassard', 'C', 37, 70, 0.8, 'CAN'],
    ['Evan', 'Rodrigues', 'C', 31, 75, 1.5, 'CAN'],
    ['Sonny', 'Milano', 'LW', 28, 74, 1.0, 'USA'],
    ['Kasperi', 'Kapanen', 'RW', 28, 75, 1.2, 'FIN'],
    ['Kevin', 'Labanc', 'RW', 28, 73, 1.0, 'CAN'],
    ['Denis', 'Malgin', 'C', 27, 73, 0.9, 'CHE'],
    ['Michael', 'Amadio', 'C', 28, 72, 0.8, 'CAN'],
    ['Nathan', 'Bastian', 'RW', 28, 72, 0.9, 'CAN'],
    ['Alex', 'Galchenyuk', 'C', 30, 72, 0.8, 'USA'],
    ['Noel', 'Acciari', 'C', 32, 71, 0.8, 'CAN'],
    ['Eric', 'Robinson', 'LW', 29, 71, 0.8, 'USA'],
    ['Ben', 'Hutton', 'D', 31, 71, 0.8, 'CAN'],
    ['Jack', 'Johnson', 'D', 37, 69, 0.8, 'USA'],
    ['Nikita', 'Zaitsev', 'D', 33, 71, 0.8, 'RUS'],
    ['Keith', 'Yandle', 'D', 38, 68, 0.8, 'USA'],
    ['Calvin', 'Pickard', 'G', 32, 73, 0.8, 'CAN'],
    ['James', 'Reimer', 'G', 36, 75, 1.5, 'CAN'],
    ['Braden', 'Holtby', 'G', 35, 74, 1.0, 'CAN'],
    ['Antti', 'Raanta', 'G', 35, 75, 1.2, 'FIN'],
  ];
  return agents.map(([fn, ln, pos, age, ovr, sal, nat], i) => ({
    id: 800000 + i,
    firstName: fn, lastName: ln, position: pos,
    sweaterNumber: 0, age: age as number, ovr: ovr as number,
    salary: sal as number, teamAbbrev: 'FA', headshot: '',
    isFreeAgent: true, birthCountry: nat,
  }));
}

// ─── LINES BUILDER ──────────────────────────────────────────────────
function buildDefaultLines(players: NHLPlayer[]): Lines {
  const fwds = players.filter(p => ['C', 'LW', 'RW', 'L', 'R'].includes(p.position)).sort((a, b) => b.ovr - a.ovr);
  const dmen = players.filter(p => p.position === 'D').sort((a, b) => b.ovr - a.ovr);
  const gls = players.filter(p => p.position === 'G').sort((a, b) => b.ovr - a.ovr);

  const forwards: (NHLPlayer | null)[][] = Array.from({ length: 4 }, () => [null, null, null]);
  const defense: (NHLPlayer | null)[][] = Array.from({ length: 3 }, () => [null, null]);
  const goalies: (NHLPlayer | null)[] = [null, null];

  const used = new Set<number>();
  const centers = fwds.filter(p => p.position === 'C');
  const lws = fwds.filter(p => p.position === 'LW' || p.position === 'L');
  const rws = fwds.filter(p => p.position === 'RW' || p.position === 'R');

  for (let line = 0; line < 4; line++) {
    const c = centers.find(p => !used.has(p.id));
    if (c) { forwards[line][1] = c; used.add(c.id); }
    const lw = lws.find(p => !used.has(p.id)) || fwds.find(p => !used.has(p.id));
    if (lw) { forwards[line][0] = lw; used.add(lw.id); }
    const rw = rws.find(p => !used.has(p.id)) || fwds.find(p => !used.has(p.id));
    if (rw) { forwards[line][2] = rw; used.add(rw.id); }
  }

  for (let pair = 0; pair < 3; pair++) {
    if (dmen[pair * 2]) defense[pair][0] = dmen[pair * 2];
    if (dmen[pair * 2 + 1]) defense[pair][1] = dmen[pair * 2 + 1];
  }
  goalies[0] = gls[0] || null;
  goalies[1] = gls[1] || null;
  return { forwards, defense, goalies };
}

// ─── UTILS ──────────────────────────────────────────────────────────
// Normalize position for display and filtering
function normalizePosition(pos: string): string {
  if (pos === 'L') return 'LW';
  if (pos === 'R') return 'RW';
  return pos;
}

function isForward(pos: string): boolean {
  const p = normalizePosition(pos);
  return ['C', 'LW', 'RW'].includes(p);
}

function posColor(pos: string): string {
  const p = normalizePosition(pos);
  switch (p) {
    case 'C': return 'bg-red-500';
    case 'LW': return 'bg-emerald-500';
    case 'RW': return 'bg-blue-500';
    case 'D': return 'bg-amber-500';
    case 'G': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}

function ovrColor(ovr: number): string {
  if (ovr >= 93) return 'text-yellow-300 font-black';
  if (ovr >= 88) return 'text-green-400';
  if (ovr >= 83) return 'text-blue-400';
  if (ovr >= 78) return 'text-gray-200';
  if (ovr >= 73) return 'text-gray-400';
  return 'text-gray-500';
}

function ovrBg(ovr: number): string {
  if (ovr >= 93) return 'bg-yellow-900/40 border-yellow-600';
  if (ovr >= 88) return 'bg-green-900/30 border-green-700';
  if (ovr >= 83) return 'bg-blue-900/30 border-blue-700';
  return 'bg-gray-800/30 border-gray-700';
}

function ovrBadge(ovr: number): string {
  if (ovr >= 93) return '💎';
  if (ovr >= 88) return '⭐';
  if (ovr >= 83) return '🔵';
  return '';
}

function formatStat(val: number | undefined): string {
  if (val === undefined) return '-';
  return String(val);
}

// ─── PLAYER PROFILE MODAL ──────────────────────────────────────────
function PlayerProfileModal({ player, onClose, allTeams }: {
  player: NHLPlayer;
  onClose: () => void;
  allTeams: NHLTeam[];
}) {
  const team = allTeams.find(t => t.abbrev === player.teamAbbrev);
  const pos = normalizePosition(player.position);
  const isGoalie = pos === 'G';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-5 pb-3" style={{ background: `linear-gradient(135deg, ${team?.color || '#1e293b'}44, #1e293b)` }}>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">✕</button>
          <div className="flex items-center gap-4">
            {player.headshot ? (
              <img src={player.headshot} alt="" className="w-20 h-20 rounded-full border-2 border-gray-600 bg-gray-800"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-2xl font-black text-gray-500">
                {player.firstName[0]}{player.lastName[0]}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-black">
                {ovrBadge(player.ovr)} {player.firstName} {player.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs text-white ${posColor(player.position)}`}>
                  {pos}
                </span>
                <span className="text-sm text-gray-400">#{player.sweaterNumber}</span>
                {player.birthCountry && (
                  <span className="text-sm" title={getCountryName(player.birthCountry)}>
                    {getFlag(player.birthCountry)} {getCountryName(player.birthCountry)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                {team && (
                  <div className="flex items-center gap-1.5">
                    <img src={team.logo} alt="" className="w-5 h-5" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span className="text-xs text-gray-400">{team.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-black ${ovrColor(player.ovr)}`}>{player.ovr}</div>
              <div className="text-[10px] text-gray-500">OVR</div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-5 pt-3 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['Возраст', `${player.age} лет`],
              ['Зарплата', `$${player.salary}M`],
              ['Рука', player.shootsCatches === 'L' ? 'Левая' : player.shootsCatches === 'R' ? 'Правая' : '—'],
              ['Город', player.birthCity || '—'],
              ...(player.heightInCm ? [['Рост', `${player.heightInCm} см`]] : []),
              ...(player.weightInKg ? [['Вес', `${player.weightInKg} кг`]] : []),
            ].map(([label, val]) => (
              <div key={label as string} className="bg-gray-800/60 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-gray-500 uppercase">{label}</div>
                <div className="text-sm font-medium mt-0.5">{val}</div>
              </div>
            ))}
          </div>

          {/* Current Season Stats */}
          {player.stats && (
            <div>
              <h3 className="text-sm font-bold text-sky-300 mb-2">📊 Текущий сезон</h3>
              <div className="bg-gray-800/60 rounded-xl p-3">
                {isGoalie ? (
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      ['GP', player.stats.gamesPlayed],
                      ['W', player.stats.wins],
                      ['GAA', player.stats.gaa?.toFixed(2)],
                      ['SV%', player.stats.savePct?.toFixed(3)],
                      ['SO', player.stats.shutouts],
                    ].map(([l, v]) => (
                      <div key={l as string}>
                        <div className="text-[10px] text-gray-500">{l}</div>
                        <div className={`text-lg font-bold ${l === 'SV%' ? 'text-yellow-300' : l === 'W' ? 'text-green-400' : ''}`}>{v ?? '-'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-5 gap-2 text-center mb-2">
                      {[
                        ['GP', player.stats.gamesPlayed, ''],
                        ['G', player.stats.goals, 'text-green-400'],
                        ['A', player.stats.assists, 'text-blue-400'],
                        ['P', player.stats.points, 'text-yellow-300'],
                        ['+/-', `${player.stats.plusMinus > 0 ? '+' : ''}${player.stats.plusMinus}`,
                          player.stats.plusMinus > 0 ? 'text-green-400' : player.stats.plusMinus < 0 ? 'text-red-400' : ''],
                      ].map(([l, v, c]) => (
                        <div key={l as string}>
                          <div className="text-[10px] text-gray-500">{l}</div>
                          <div className={`text-lg font-bold ${c}`}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {/* Extra stats */}
                    <div className="grid grid-cols-4 gap-2 text-center border-t border-gray-700/50 pt-2 mt-2">
                      {[
                        ['SOG', player.stats.shots],
                        ['PIM', player.stats.pim],
                        ['PPG', player.stats.ppGoals],
                        ['GWG', player.stats.gwGoals],
                        ['Hits', player.stats.hits],
                        ['BLK', player.stats.blocks],
                        ['SHG', player.stats.shGoals],
                        ['FO%', player.stats.faceoffPct != null ? (player.stats.faceoffPct * 100).toFixed(1) : undefined],
                      ].filter(([, v]) => v != null).map(([l, v]) => (
                        <div key={l as string}>
                          <div className="text-[9px] text-gray-500">{l}</div>
                          <div className="text-xs font-medium">{v}</div>
                        </div>
                      ))}
                    </div>
                    {/* P/GP */}
                    <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between text-xs text-gray-400">
                      <span>P/GP: <span className="text-white font-bold">{(player.stats.points / Math.max(player.stats.gamesPlayed, 1)).toFixed(2)}</span></span>
                      <span>G/GP: <span className="text-white font-bold">{(player.stats.goals / Math.max(player.stats.gamesPlayed, 1)).toFixed(2)}</span></span>
                      {player.stats.shots != null && player.stats.shots > 0 && (
                        <span>S%: <span className="text-white font-bold">{((player.stats.goals / player.stats.shots) * 100).toFixed(1)}%</span></span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Previous Season */}
          {player.prevStats && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-2">📋 Прошлый сезон (2023-24)</h3>
              <div className="bg-gray-800/40 rounded-xl p-3">
                {isGoalie ? (
                  <div className="grid grid-cols-5 gap-2 text-center text-sm">
                    {[
                      ['GP', player.prevStats.gamesPlayed],
                      ['W', player.prevStats.wins],
                      ['GAA', player.prevStats.gaa?.toFixed(2)],
                      ['SV%', player.prevStats.savePct?.toFixed(3)],
                      ['SO', player.prevStats.shutouts],
                    ].map(([l, v]) => (
                      <div key={l as string}>
                        <div className="text-[10px] text-gray-500">{l}</div>
                        <div className="font-medium">{v ?? '-'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2 text-center text-sm">
                    {[
                      ['GP', player.prevStats.gamesPlayed],
                      ['G', player.prevStats.goals],
                      ['A', player.prevStats.assists],
                      ['P', player.prevStats.points],
                      ['+/-', `${player.prevStats.plusMinus > 0 ? '+' : ''}${player.prevStats.plusMinus}`],
                    ].map(([l, v]) => (
                      <div key={l as string}>
                        <div className="text-[10px] text-gray-500">{l}</div>
                        <div className="font-medium">{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Season comparison */}
          {player.stats && player.prevStats && !isGoalie && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-2">📈 Прогресс</h3>
              <div className="bg-gray-800/40 rounded-xl p-3">
                {(() => {
                  const curPPG = player.stats!.points / Math.max(player.stats!.gamesPlayed, 1);
                  const prevPPG = player.prevStats!.points / Math.max(player.prevStats!.gamesPlayed, 1);
                  const diff = curPPG - prevPPG;
                  const improving = diff > 0.05;
                  const declining = diff < -0.05;
                  return (
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-gray-500">Прошлый: </span>
                        <span>{prevPPG.toFixed(2)} P/GP</span>
                      </div>
                      <div className={`text-lg font-black ${improving ? 'text-green-400' : declining ? 'text-red-400' : 'text-gray-400'}`}>
                        {improving ? '📈' : declining ? '📉' : '➡️'} {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500">Текущий: </span>
                        <span>{curPPG.toFixed(2)} P/GP</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {!player.stats && !player.prevStats && (
            <div className="text-center text-gray-600 text-xs py-4">
              Статистика не загружена. Попробуйте перезагрузить страницу.
            </div>
          )}

          {player.statsLoaded && (
            <div className="text-[10px] text-blue-400/60 text-center">
              📊 OVR рассчитан по реальной статистике из NHL API
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('select');
  const [teams, setTeams] = useState<NHLTeam[]>([]);
  const [myTeamAbbrev, setMyTeamAbbrev] = useState('');
  const [freeAgents, setFreeAgents] = useState<NHLPlayer[]>([]);
  const [lines, setLines] = useState<Lines>({ forwards: [], defense: [], goalies: [] });
  const [standings, setStandings] = useState<StandingsTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState('');
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'fallback'>('loading');
  const [tradeLog, setTradeLog] = useState<string[]>([]);
  const [apiLoadedCount, setApiLoadedCount] = useState(0);
  const [statsLoadedCount, setStatsLoadedCount] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<NHLPlayer | null>(null);

  const myTeam = useMemo(() => teams.find(t => t.abbrev === myTeamAbbrev), [teams, myTeamAbbrev]);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAllData() {
    setLoading(true);
    setLoadProgress('Проверка бэкенда...');
    const hasBackend = await checkBackend();

    if (hasBackend) {
      // Загружаем всё с бэкенда одним запросом
      try {
        setLoadProgress('📡 Загрузка данных с бэкенда...');
        const r = await fetch(`${BACKEND_URL}/api/teams`, { signal: AbortSignal.timeout(30000) });
        if (r.ok) {
          const data = await r.json();
          if (data.teams && data.teams.length > 0) {
            const backendTeams: NHLTeam[] = data.teams.map((t: any) => ({
              abbrev: t.abbrev,
              name: t.name,
              logo: t.logo,
              conference: t.conference,
              division: t.division,
              color: '#1e293b',
              players: t.roster.map((p: any) => ({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                position: p.position,
                sweaterNumber: Number(p.jerseyNumber) || 0,
                age: p.age,
                ovr: p.ovr,
                salary: Math.round(p.salary / 100000) / 10,
                teamAbbrev: t.abbrev,
                headshot: p.headshot,
                birthCountry: p.birthCountry,
                birthCity: p.birthCity,
                heightInCm: p.heightCm,
                weightInKg: p.weightKg,
                shootsCatches: p.shoots,
                statsLoaded: !!p.currentStats,
                stats: p.currentStats ? {
                  goals: p.currentStats.goals, assists: p.currentStats.assists,
                  points: p.currentStats.points, plusMinus: p.currentStats.plusMinus,
                  gamesPlayed: p.currentStats.gamesPlayed, toi: p.currentStats.avgToi || '0:00',
                  shots: p.currentStats.shots, hits: p.currentStats.hits,
                  blocks: p.currentStats.blockedShots, pim: p.currentStats.pim,
                  ppGoals: p.currentStats.powerPlayGoals, gwGoals: p.currentStats.gameWinningGoals,
                  shGoals: p.currentStats.shortHandedGoals, faceoffPct: p.currentStats.faceoffWinPct,
                  gaa: p.currentStats.goalsAgainstAvg, savePct: p.currentStats.savePct,
                  wins: p.currentStats.wins, shutouts: p.currentStats.shutouts,
                } : undefined,
                prevStats: p.lastSeasonStats ? {
                  goals: p.lastSeasonStats.goals, assists: p.lastSeasonStats.assists,
                  points: p.lastSeasonStats.points, plusMinus: p.lastSeasonStats.plusMinus,
                  gamesPlayed: p.lastSeasonStats.gamesPlayed, toi: p.lastSeasonStats.avgToi || '0:00',
                  gaa: p.lastSeasonStats.goalsAgainstAvg, savePct: p.lastSeasonStats.savePct,
                  wins: p.lastSeasonStats.wins, shutouts: p.lastSeasonStats.shutouts,
                } : undefined,
              })),
              apiLoaded: true,
              statsLoaded: true,
            }));
            setTeams(backendTeams);
            setApiLoadedCount(backendTeams.length);
            setStatsLoadedCount(backendTeams.length);

            // Загружаем таблицу
            try {
              const sr = await fetch(`${BACKEND_URL}/api/standings`, { signal: AbortSignal.timeout(5000) });
              if (sr.ok) {
                const sd = await sr.json();
                if (sd.standings) setStandings(sd.standings);
              }
            } catch { /* ok */ }

            setFreeAgents(generateFreeAgents());
            setApiStatus('success');
            setLoading(false);
            setLoadProgress('');
            return;
          }
        }
      } catch (err) {
        console.error('Ошибка бэкенда:', err);
      }
    }

    // Фолбек — загружаем через CORS-прокси
    setLoadProgress('Инициализация с реальными составами НХЛ...');
    const fallbackTeams = buildTeamsFromFallback();
    setTeams(fallbackTeams);
    setFreeAgents(generateFreeAgents());

    setLoadProgress('📡 Загрузка турнирной таблицы...');
    const st = await loadStandingsFromAPI();
    if (st.length > 0) {
      setStandings(st);
      setTeams(prev => prev.map(t => {
        const s = st.find(x => x.abbrev === t.abbrev);
        if (s) return { ...t, name: s.name || t.name, logo: s.logo || t.logo };
        return t;
      }));
    }

    setLoadProgress('📡 Загрузка составов из NHL API...');
    let loaded = 0;
    const batchSize = 4;
    for (let i = 0; i < fallbackTeams.length; i += batchSize) {
      const batch = fallbackTeams.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (t) => {
          const apiPlayers = await loadRosterFromAPI(t.abbrev);
          return { abbrev: t.abbrev, players: apiPlayers };
        })
      );
      for (const result of results) {
        if (result.players && result.players.length > 0) {
          loaded++;
          setTeams(prev => prev.map(t =>
            t.abbrev === result.abbrev ? { ...t, players: result.players!, apiLoaded: true } : t
          ));
        }
      }
      setApiLoadedCount(loaded);
      setLoadProgress(`📡 Составы: ${loaded} команд (${i + batch.length}/${fallbackTeams.length})...`);
    }

    setLoadProgress('📊 Загрузка статистики (текущий + прошлый сезон)...');
    let statsLoaded = 0;
    for (let i = 0; i < fallbackTeams.length; i += batchSize) {
      const batch = fallbackTeams.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (t) => {
          const [currentStats, prevStats] = await Promise.all([
            loadTeamStats(t.abbrev),
            loadTeamStats(t.abbrev, '20232024'),
          ]);
          return { abbrev: t.abbrev, currentStats, prevStats };
        })
      );
      for (const result of results) {
        if (result.currentStats.size > 0 || result.prevStats.size > 0) {
          statsLoaded++;
          setTeams(prev => prev.map(t => {
            if (t.abbrev !== result.abbrev) return t;
            const updatedPlayers = t.players.map(p => {
              const nameKey = `${p.firstName}_${p.lastName}`.toLowerCase();
              const idKey = `id_${p.id}`;
              const curStat = result.currentStats.get(idKey) || result.currentStats.get(nameKey);
              const prevStat = result.prevStats.get(idKey) || result.prevStats.get(nameKey);
              if (!curStat && !prevStat) return p;
              const newOVR = calculateOVR(p.position, curStat, prevStat, p.age);
              return { ...p, ovr: newOVR, stats: curStat || undefined, prevStats: prevStat || undefined, statsLoaded: true };
            });
            return { ...t, players: updatedPlayers, statsLoaded: true };
          }));
        }
      }
      setStatsLoadedCount(statsLoaded);
      setLoadProgress(`📊 Статистика: ${statsLoaded} команд (${i + batch.length}/${fallbackTeams.length})...`);
    }

    setApiStatus(loaded > 0 || statsLoaded > 0 ? 'success' : 'fallback');
    setLoading(false);
  }

  function selectTeam(abbrev: string) {
    setMyTeamAbbrev(abbrev);
    const team = teams.find(t => t.abbrev === abbrev);
    if (team) setLines(buildDefaultLines(team.players));
    setPage('dashboard');
  }

  function updateTeamPlayers(abbrev: string, players: NHLPlayer[]) {
    setTeams(prev => prev.map(t => t.abbrev === abbrev ? { ...t, players } : t));
    if (abbrev === myTeamAbbrev) setLines(buildDefaultLines(players));
  }

  function executeTrade(trade: TradeOffer) {
    const fromTeam = teams.find(t => t.abbrev === trade.fromTeam)!;
    const toTeam = teams.find(t => t.abbrev === trade.toTeam)!;
    const newFrom = [
      ...fromTeam.players.filter(p => !trade.playersFrom.some(tp => tp.id === p.id)),
      ...trade.playersTo.map(p => ({ ...p, teamAbbrev: trade.fromTeam })),
    ];
    const newTo = [
      ...toTeam.players.filter(p => !trade.playersTo.some(tp => tp.id === p.id)),
      ...trade.playersFrom.map(p => ({ ...p, teamAbbrev: trade.toTeam })),
    ];
    updateTeamPlayers(trade.fromTeam, newFrom);
    updateTeamPlayers(trade.toTeam, newTo);
    const log = `🔄 ${trade.playersFrom.map(p => `${p.firstName} ${p.lastName}`).join(', ')} → ${toTeam.name} | ` +
      `${trade.playersTo.map(p => `${p.firstName} ${p.lastName}`).join(', ')} → ${fromTeam.name}`;
    setTradeLog(prev => [log, ...prev]);
  }

  function signFreeAgent(player: NHLPlayer) {
    if (!myTeam) return;
    const signed = { ...player, teamAbbrev: myTeamAbbrev, isFreeAgent: false };
    updateTeamPlayers(myTeamAbbrev, [...myTeam.players, signed]);
    setFreeAgents(prev => prev.filter(p => p.id !== player.id));
    setTradeLog(prev => [`✍️ Подписан: ${player.firstName} ${player.lastName} (${normalizePosition(player.position)}, ${player.ovr} OVR)`, ...prev]);
  }

  function releasePlr(player: NHLPlayer) {
    if (!myTeam) return;
    updateTeamPlayers(myTeamAbbrev, myTeam.players.filter(p => p.id !== player.id));
    setFreeAgents(prev => [...prev, { ...player, teamAbbrev: 'FA', isFreeAgent: true }]);
    setTradeLog(prev => [`🚫 Отпущен: ${player.firstName} ${player.lastName}`, ...prev]);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-6xl">🏒</div>
        <h1 className="text-3xl font-black">NHL GM Simulator</h1>
        <div className="loading-spinner" />
        <p className="text-sky-300 font-medium text-center">{loadProgress}</p>
        <p className="text-sm text-gray-500 text-center">Реальные составы всех 32 команд НХЛ</p>
        <div className="flex gap-4 text-sm">
          {apiLoadedCount > 0 && <span className="text-green-400">✅ {apiLoadedCount} составов</span>}
          {statsLoadedCount > 0 && <span className="text-blue-400">📊 {statsLoadedCount} статистик</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Player Profile Modal */}
      {selectedPlayer && (
        <PlayerProfileModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} allTeams={teams} />
      )}

      {page === 'select' ? (
        <TeamSelectView teams={teams} onSelect={selectTeam} standings={standings} apiStatus={apiStatus} apiCount={apiLoadedCount} statsCount={statsLoadedCount} />
      ) : (
        <div className="flex flex-col h-screen">
          <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 px-3 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
            {myTeam && (
              <div className="flex items-center gap-2 mr-3 flex-shrink-0 pr-3 border-r border-gray-700">
                <img src={myTeam.logo} alt="" className="w-8 h-8" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="font-bold text-sm truncate max-w-[120px]">{myTeam.name}</span>
              </div>
            )}
            {([
              ['dashboard', '📊', 'Обзор'],
              ['roster', '👥', 'Состав'],
              ['lines', '📋', 'Звенья'],
              ['trade', '🔄', 'Обмены'],
              ['freeagency', '✍️', 'Агенты'],
              ['standings', '🏆', 'Таблица'],
            ] as [Page, string, string][]).map(([p, icon, label]) => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${page === p ? 'tab-active' : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}>
                {icon} {label}
              </button>
            ))}
            <button onClick={() => { setMyTeamAbbrev(''); setPage('select'); }}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-700/50 hover:text-white flex-shrink-0">
              ← Выход
            </button>
          </nav>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {page === 'dashboard' && myTeam && <DashboardView team={myTeam} standings={standings} tradeLog={tradeLog} lines={lines} onPlayerClick={setSelectedPlayer} />}
            {page === 'roster' && myTeam && <RosterView team={myTeam} onRelease={releasePlr} onPlayerClick={setSelectedPlayer} />}
            {page === 'lines' && myTeam && <LinesView team={myTeam} lines={lines} setLines={setLines} onPlayerClick={setSelectedPlayer} />}
            {page === 'trade' && myTeam && <TradeView myTeam={myTeam} teams={teams} onTrade={executeTrade} onPlayerClick={setSelectedPlayer} />}
            {page === 'freeagency' && <FreeAgencyView freeAgents={freeAgents} onSign={signFreeAgent} teamName={myTeam?.name || ''} onPlayerClick={setSelectedPlayer} />}
            {page === 'standings' && <StandingsView standings={standings} teams={teams} myAbbrev={myTeamAbbrev} />}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TEAM SELECT
// ═══════════════════════════════════════════════════════════════════════
function TeamSelectView({ teams, onSelect, standings, apiStatus, apiCount, statsCount }: {
  teams: NHLTeam[]; onSelect: (a: string) => void; standings: StandingsTeam[];
  apiStatus: string; apiCount: number; statsCount: number;
}) {
  const [search, setSearch] = useState('');
  const divs = ['Atlantic', 'Metropolitan', 'Central', 'Pacific'];
  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.abbrev.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 fade-in">
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-black mb-2">🏒 NHL GM Simulator</h1>
        <p className="text-lg text-sky-300">Стань генеральным менеджером. Управляй командой.</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          {apiStatus === 'success' ? (
            <>
              <span className="text-green-400 bg-green-900/30 px-3 py-1 rounded-full">✅ API: {apiCount} составов</span>
              {statsCount > 0 && <span className="text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">📊 Статистика: {statsCount} команд</span>}
            </>
          ) : (
            <span className="text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded-full">📋 Реальные составы НХЛ (32 команды)</span>
          )}
        </div>
      </div>
      <div className="mb-5 flex justify-center">
        <input type="text" placeholder="🔍 Поиск команды..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-gray-800/80 border border-gray-600 rounded-xl px-4 py-2.5 w-80 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition" />
      </div>
      {divs.map(div => {
        const dt = filtered.filter(t => t.division === div);
        if (dt.length === 0) return null;
        return (
          <div key={div} className="mb-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-800 pb-1">{div} Division</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {dt.map(team => {
                const st = standings.find(s => s.abbrev === team.abbrev);
                const avgOvr = team.players.length > 0 ? Math.round(team.players.reduce((s, p) => s + p.ovr, 0) / team.players.length) : 0;
                return (
                  <button key={team.abbrev} onClick={() => onSelect(team.abbrev)}
                    className="bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 hover:border-sky-500/50 rounded-xl p-3 text-left transition-all group">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <img src={team.logo} alt={team.abbrev} className="w-10 h-10 group-hover:scale-110 transition-transform"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{team.name}</div>
                        <div className="text-xs text-gray-500">
                          {team.abbrev}{team.apiLoaded ? ' 📡' : ''}{team.statsLoaded ? ' 📊' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>👥 {team.players.length} • <span className={ovrColor(avgOvr)}>Ø{avgOvr}</span></span>
                      {st ? <span className="text-sky-400">{st.wins}W-{st.losses}L • {st.points}pts</span> : <span className="text-gray-600">—</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function DashboardView({ team, standings, tradeLog, lines, onPlayerClick }: {
  team: NHLTeam; standings: StandingsTeam[]; tradeLog: string[]; lines: Lines;
  onPlayerClick: (p: NHLPlayer) => void;
}) {
  const st = standings.find(s => s.abbrev === team.abbrev);
  const totalSal = team.players.reduce((s, p) => s + p.salary, 0);
  const cap = 88;
  const avgOvr = team.players.length > 0 ? Math.round(team.players.reduce((s, p) => s + p.ovr, 0) / team.players.length) : 0;
  const top5 = [...team.players].sort((a, b) => b.ovr - a.ovr).slice(0, 5);
  const fCount = team.players.filter(p => isForward(p.position)).length;
  const dCount = team.players.filter(p => p.position === 'D').length;
  const gCount = team.players.filter(p => p.position === 'G').length;
  const topScorers = [...team.players].filter(p => p.stats && p.position !== 'G')
    .sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0)).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="bg-gray-800/50 rounded-2xl p-5 mb-5 flex flex-wrap items-center gap-5 border border-gray-700/50">
        <img src={team.logo} alt="" className="w-16 h-16 sm:w-20 sm:h-20" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl sm:text-3xl font-black">{team.name}</h1>
          <p className="text-gray-400 text-sm">{team.conference} • {team.division}</p>
        </div>
        {st && (
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              [st.points, 'PTS', 'text-sky-300'], [st.wins, 'W', 'text-green-400'],
              [st.losses, 'L', 'text-red-400'], [st.otLosses, 'OTL', 'text-yellow-400'],
            ].map(([val, label, color]) => (
              <div key={label as string}>
                <div className={`text-xl sm:text-2xl font-black ${color}`}>{val}</div>
                <div className="text-[10px] text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-2">
          <h3 className="font-bold text-sky-300 text-sm mb-3">📊 Статистика</h3>
          {[['Игроков', team.players.length], ['Нападающие', fCount], ['Защитники', dCount], ['Вратари', gCount]].map(([label, val]) => (
            <div key={label as string} className="flex justify-between text-sm"><span className="text-gray-400">{label}</span><span>{val}</span></div>
          ))}
          <div className="border-t border-gray-700/50 pt-2 mt-2" />
          <div className="flex justify-between text-sm"><span className="text-gray-400">Средний OVR</span><span className={ovrColor(avgOvr)}>{avgOvr}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Зарплаты</span><span className="text-green-400">${totalSal.toFixed(1)}M</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Потолок</span><span>$88.0M</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Свободно</span>
            <span className={totalSal > cap ? 'text-red-400' : 'text-green-400'}>${(cap - totalSal).toFixed(1)}M</span>
          </div>
          <div className="mt-2 bg-gray-900 rounded-full h-3 overflow-hidden">
            <div className={`h-full rounded-full ${totalSal > cap ? 'bg-red-500' : 'bg-sky-500'}`}
              style={{ width: `${Math.min(100, (totalSal / cap) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <h3 className="font-bold text-sky-300 text-sm mb-3">⭐ Лучшие по OVR</h3>
          <div className="space-y-2">
            {top5.map(p => (
              <div key={p.id} className={`flex items-center gap-2.5 rounded-lg p-2 border cursor-pointer hover:brightness-125 transition ${ovrBg(p.ovr)}`}
                onClick={() => onPlayerClick(p)}>
                {p.headshot ? (
                  <img src={p.headshot} alt="" className="w-9 h-9 rounded-full bg-gray-700 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">#{p.sweaterNumber}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {ovrBadge(p.ovr)} {p.firstName} {p.lastName} {getFlag(p.birthCountry)}
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${posColor(p.position)}`}>{normalizePosition(p.position)}</span>
                    {p.stats && p.position !== 'G' && <span className="text-[10px] text-gray-400">{p.stats.goals}G {p.stats.assists}A {p.stats.points}P</span>}
                    {p.stats && p.position === 'G' && <span className="text-[10px] text-gray-400">{p.stats.wins}W {p.stats.savePct?.toFixed(3)} SV%</span>}
                  </div>
                </div>
                <span className={`text-lg font-black ${ovrColor(p.ovr)}`}>{p.ovr}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {topScorers.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="font-bold text-sky-300 text-sm mb-2">🏒 Лучшие бомбардиры</h3>
              <div className="space-y-1.5">
                {topScorers.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs bg-gray-900/40 rounded-lg p-1.5 cursor-pointer hover:bg-gray-700/40 transition"
                    onClick={() => onPlayerClick(p)}>
                    <span className="text-gray-600 w-4 text-right">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate">{p.firstName[0]}. {p.lastName} {getFlag(p.birthCountry)}</span>
                    </div>
                    <div className="flex gap-2 text-[10px] font-mono">
                      <span className="text-green-400">{p.stats!.goals}G</span>
                      <span className="text-blue-400">{p.stats!.assists}A</span>
                      <span className="text-yellow-300 font-bold">{p.stats!.points}P</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-bold text-sky-300 text-sm mb-2">📋 1-е звено</h3>
            {lines.forwards[0] && (
              <div className="flex gap-1.5 mb-2">
                {lines.forwards[0].map((pl, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-lg p-2 text-center text-xs flex-1">
                    {pl ? (<><div className="font-medium truncate text-[11px]">{pl.lastName} {getFlag(pl.birthCountry)}</div>
                      <span className={`text-[10px] ${ovrColor(pl.ovr)}`}>{pl.ovr}</span></>) : <span className="text-gray-600">—</span>}
                  </div>
                ))}
              </div>
            )}
            {lines.defense[0] && (
              <div className="flex gap-1.5">
                {lines.defense[0].map((pl, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-lg p-2 text-center text-xs flex-1">
                    {pl ? (<><div className="font-medium truncate text-[11px]">{pl.lastName} {getFlag(pl.birthCountry)}</div>
                      <span className={`text-[10px] ${ovrColor(pl.ovr)}`}>{pl.ovr}</span></>) : <span className="text-gray-600">—</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-bold text-sky-300 text-sm mb-2">📰 Лог событий</h3>
            {tradeLog.length === 0 ? (
              <p className="text-gray-600 text-xs">Проведите обмен или подпишите агента</p>
            ) : (
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {tradeLog.slice(0, 15).map((l, i) => (
                  <div key={i} className="text-[11px] text-gray-300 bg-gray-900/50 rounded p-1.5">{l}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROSTER (with position filter fix + nationality + clickable)
// ═══════════════════════════════════════════════════════════════════════
function RosterView({ team, onRelease, onPlayerClick }: {
  team: NHLTeam; onRelease: (p: NHLPlayer) => void;
  onPlayerClick: (p: NHLPlayer) => void;
}) {
  const [sortBy, setSortBy] = useState<'ovr' | 'points' | 'goals' | 'salary' | 'age' | 'name'>('ovr');
  const [filterPos, setFilterPos] = useState('ALL');
  const [confirmRelease, setConfirmRelease] = useState<NHLPlayer | null>(null);
  const [showStats, setShowStats] = useState(true);

  const sorted = useMemo(() => {
    let list = [...team.players];
    if (filterPos !== 'ALL') {
      list = list.filter(p => {
        const np = normalizePosition(p.position);
        if (filterPos === 'F') return isForward(p.position);
        return np === filterPos;
      });
    }
    switch (sortBy) {
      case 'ovr': list.sort((a, b) => b.ovr - a.ovr); break;
      case 'points': list.sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0)); break;
      case 'goals': list.sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)); break;
      case 'salary': list.sort((a, b) => b.salary - a.salary); break;
      case 'age': list.sort((a, b) => a.age - b.age); break;
      case 'name': list.sort((a, b) => a.lastName.localeCompare(b.lastName)); break;
    }
    return list;
  }, [team.players, sortBy, filterPos]);

  const hasStats = team.players.some(p => p.statsLoaded);

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <h2 className="text-2xl font-black mb-1">👥 Состав — {team.name}</h2>
      {hasStats && <p className="text-[11px] text-blue-400 mb-3">📊 Нажмите на игрока для подробной статистики</p>}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {['ALL', 'F', 'C', 'LW', 'RW', 'D', 'G'].map(pos => (
          <button key={pos} onClick={() => setFilterPos(pos)}
            className={`px-3 py-1 rounded-lg text-sm ${filterPos === pos ? 'bg-sky-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {pos === 'ALL' ? 'Все' : pos === 'F' ? 'Нап' : pos}
          </button>
        ))}
        <div className="ml-auto flex gap-1.5 flex-wrap">
          {(['ovr', 'points', 'goals', 'salary', 'age', 'name'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-2.5 py-1 rounded-lg text-xs ${sortBy === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}`}>
              {s === 'ovr' ? 'OVR' : s === 'points' ? 'Очки' : s === 'goals' ? 'Голы' : s === 'salary' ? '$' : s === 'age' ? 'Возр' : 'Имя'}
            </button>
          ))}
          {hasStats && (
            <button onClick={() => setShowStats(!showStats)}
              className={`px-2.5 py-1 rounded-lg text-xs ${showStats ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
              📊 Стат
            </button>
          )}
        </div>
      </div>

      {confirmRelease && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setConfirmRelease(null)}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm border border-gray-600" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Отпустить игрока?</h3>
            <p className="text-gray-400 mb-4">{confirmRelease.firstName} {confirmRelease.lastName} ({normalizePosition(confirmRelease.position)}, {confirmRelease.ovr} OVR)</p>
            <div className="flex gap-2">
              <button onClick={() => { onRelease(confirmRelease); setConfirmRelease(null); }}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-bold">Отпустить</button>
              <button onClick={() => setConfirmRelease(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900/80 text-gray-500 text-[11px] uppercase">
                <th className="p-2.5 text-left">#</th>
                <th className="p-2.5 text-left">Игрок</th>
                <th className="p-2.5 text-center">🌍</th>
                <th className="p-2.5 text-center">POS</th>
                <th className="p-2.5 text-center">OVR</th>
                {showStats && hasStats && (
                  <>
                    <th className="p-2.5 text-center">GP</th>
                    <th className="p-2.5 text-center">G</th>
                    <th className="p-2.5 text-center">A</th>
                    <th className="p-2.5 text-center">P</th>
                    <th className="p-2.5 text-center hidden sm:table-cell">+/-</th>
                  </>
                )}
                <th className="p-2.5 text-center hidden sm:table-cell">Возр</th>
                <th className="p-2.5 text-right">$M</th>
                <th className="p-2.5 text-center w-10"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id}
                  className={`border-t border-gray-700/30 hover:bg-gray-700/20 cursor-pointer ${i % 2 === 0 ? 'bg-gray-800/20' : ''}`}
                  onClick={() => onPlayerClick(p)}>
                  <td className="p-2.5 text-gray-600 text-xs">{p.sweaterNumber}</td>
                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      {p.headshot ? (
                        <img src={p.headshot} alt="" className="w-7 h-7 rounded-full bg-gray-700 flex-shrink-0"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                      )}
                      <span className="font-medium text-sm">{ovrBadge(p.ovr)} {p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-center text-sm" title={getCountryName(p.birthCountry)}>
                    {getFlag(p.birthCountry)}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${posColor(p.position)}`}>{normalizePosition(p.position)}</span>
                  </td>
                  <td className={`p-2.5 text-center font-black ${ovrColor(p.ovr)}`}>{p.ovr}</td>
                  {showStats && hasStats && (
                    p.position === 'G' ? (
                      <>
                        <td className="p-2.5 text-center text-gray-400 text-xs">{p.stats?.gamesPlayed ?? '-'}</td>
                        <td className="p-2.5 text-center text-green-400 text-xs" title="Wins">{p.stats?.wins ?? '-'}</td>
                        <td className="p-2.5 text-center text-blue-400 text-xs" title="GAA">{p.stats?.gaa?.toFixed(2) ?? '-'}</td>
                        <td className="p-2.5 text-center text-yellow-300 text-xs font-bold" title="SV%">{p.stats?.savePct?.toFixed(3) ?? '-'}</td>
                        <td className="p-2.5 text-center text-gray-500 text-xs hidden sm:table-cell" title="SO">{p.stats?.shutouts ?? '-'}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2.5 text-center text-gray-400 text-xs">{formatStat(p.stats?.gamesPlayed)}</td>
                        <td className="p-2.5 text-center text-green-400 text-xs">{formatStat(p.stats?.goals)}</td>
                        <td className="p-2.5 text-center text-blue-400 text-xs">{formatStat(p.stats?.assists)}</td>
                        <td className="p-2.5 text-center text-yellow-300 text-xs font-bold">{formatStat(p.stats?.points)}</td>
                        <td className="p-2.5 text-center text-gray-500 text-xs hidden sm:table-cell">
                          {p.stats ? (
                            <span className={p.stats.plusMinus > 0 ? 'text-green-400' : p.stats.plusMinus < 0 ? 'text-red-400' : ''}>
                              {p.stats.plusMinus > 0 ? '+' : ''}{p.stats.plusMinus}
                            </span>
                          ) : '-'}
                        </td>
                      </>
                    )
                  )}
                  <td className="p-2.5 text-center text-gray-500 hidden sm:table-cell text-xs">{p.age}</td>
                  <td className="p-2.5 text-right text-green-400 text-xs">${p.salary}M</td>
                  <td className="p-2.5 text-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setConfirmRelease(p)} className="text-red-400/50 hover:text-red-400 text-xs" title="Отпустить">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap justify-between text-[11px] text-gray-600">
        <span>{sorted.length} игроков • ${team.players.reduce((s, p) => s + p.salary, 0).toFixed(1)}M / $88.0M</span>
        {hasStats && <span className="text-blue-400">📊 Для вратарей: GP/W/GAA/SV%/SO</span>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LINES EDITOR
// ═══════════════════════════════════════════════════════════════════════
function LinesView({ team, lines, setLines, onPlayerClick }: {
  team: NHLTeam; lines: Lines; setLines: (l: Lines) => void;
  onPlayerClick: (p: NHLPlayer) => void;
}) {
  const dragPlayer = useRef<NHLPlayer | null>(null);
  const dragSource = useRef<{ type: string; li: number; pi: number } | null>(null);

  const bench = useMemo(() => {
    const inLines = new Set<number>();
    lines.forwards.forEach(l => l.forEach(p => { if (p) inLines.add(p.id); }));
    lines.defense.forEach(l => l.forEach(p => { if (p) inLines.add(p.id); }));
    lines.goalies.forEach(p => { if (p) inLines.add(p.id); });
    return team.players.filter(p => !inLines.has(p.id));
  }, [team.players, lines]);

  const onDragStart = useCallback((e: React.DragEvent, player: NHLPlayer, src: { type: string; li: number; pi: number } | null) => {
    dragPlayer.current = player; dragSource.current = src;
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).classList.add('dragging');
  }, []);
  const onDragEnd = useCallback((e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('dragging');
    dragPlayer.current = null; dragSource.current = null;
  }, []);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    (e.currentTarget as HTMLElement).classList.add('drag-over');
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
  }, []);

  const onDropSlot = useCallback((e: React.DragEvent, tType: string, tLi: number, tPi: number) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
    const player = dragPlayer.current;
    if (!player) return;
    const nl = {
      forwards: lines.forwards.map(l => [...l]),
      defense: lines.defense.map(l => [...l]),
      goalies: [...lines.goalies],
    };
    let occ: NHLPlayer | null = null;
    if (tType === 'F') occ = nl.forwards[tLi][tPi];
    else if (tType === 'D') occ = nl.defense[tLi][tPi];
    else if (tType === 'G') occ = nl.goalies[tPi];
    const src = dragSource.current;
    if (src) {
      if (src.type === 'F') nl.forwards[src.li][src.pi] = occ;
      else if (src.type === 'D') nl.defense[src.li][src.pi] = occ;
      else if (src.type === 'G') nl.goalies[src.pi] = occ;
    }
    if (tType === 'F') nl.forwards[tLi][tPi] = player;
    else if (tType === 'D') nl.defense[tLi][tPi] = player;
    else if (tType === 'G') nl.goalies[tPi] = player;
    setLines(nl);
  }, [lines, setLines]);

  const onDropBench = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
    const src = dragSource.current;
    if (!src) return;
    const nl = {
      forwards: lines.forwards.map(l => [...l]),
      defense: lines.defense.map(l => [...l]),
      goalies: [...lines.goalies],
    };
    if (src.type === 'F') nl.forwards[src.li][src.pi] = null;
    else if (src.type === 'D') nl.defense[src.li][src.pi] = null;
    else if (src.type === 'G') nl.goalies[src.pi] = null;
    setLines(nl);
  }, [lines, setLines]);

  const autoFill = useCallback(() => setLines(buildDefaultLines(team.players)), [team.players, setLines]);
  const clearAll = useCallback(() => setLines({
    forwards: Array.from({ length: 4 }, () => [null, null, null]),
    defense: Array.from({ length: 3 }, () => [null, null]),
    goalies: [null, null],
  }), [setLines]);

  const lineOvr = (players: (NHLPlayer | null)[]) => {
    const active = players.filter(Boolean) as NHLPlayer[];
    return active.length === 0 ? 0 : Math.round(active.reduce((s, p) => s + p.ovr, 0) / active.length);
  };

  const lineNames = ['1-е звено', '2-е звено', '3-е звено', '4-е звено'];
  const defNames = ['1-я пара', '2-я пара', '3-я пара'];
  const fwdPos = ['LW', 'C', 'RW'];

  const Slot = ({ pl, sType, li, pi, label }: { pl: NHLPlayer | null; sType: string; li: number; pi: number; label: string }) => (
    <div className={`line-slot p-1.5 flex items-center gap-1.5 ${pl ? 'filled bg-gray-800/80' : 'bg-gray-900/30'}`}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={e => onDropSlot(e, sType, li, pi)}>
      {pl ? (
        <div className="player-card flex items-center gap-1.5 flex-1 min-w-0" draggable
          onDragStart={e => onDragStart(e, pl, { type: sType, li, pi })} onDragEnd={onDragEnd}>
          <div className="flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPlayerClick(pl); }}>
            {pl.headshot ? (
              <img src={pl.headshot} alt="" className="w-7 h-7 rounded-full bg-gray-700 hover:ring-2 hover:ring-sky-400 transition-all"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-[9px] hover:ring-2 hover:ring-sky-400 transition-all">{pl.firstName[0]}{pl.lastName[0]}</div>
            )}
          </div>
          <div className="min-w-0 flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPlayerClick(pl); }}>
            <div className="text-[11px] font-medium truncate hover:text-sky-300 transition-colors">
              {pl.firstName[0]}. {pl.lastName} {getFlag(pl.birthCountry)}
            </div>
            <div className="flex gap-1 items-center">
              <span className={`text-[9px] px-1 rounded ${posColor(pl.position)} text-white`}>{normalizePosition(pl.position)}</span>
              <span className={`text-[9px] font-bold ${ovrColor(pl.ovr)}`}>{pl.ovr}</span>
              {pl.stats && pl.position !== 'G' && <span className="text-[8px] text-gray-500">{pl.stats.points}P</span>}
              {pl.stats && pl.position === 'G' && <span className="text-[8px] text-gray-500">{pl.stats.savePct?.toFixed(3)}</span>}
            </div>
          </div>
        </div>
      ) : (
        <span className="text-gray-600 text-[10px] w-full text-center">{label}</span>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-2xl font-black">📋 Редактор звеньев</h2>
        <div className="flex gap-2">
          <button onClick={autoFill} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition">⚡ Авто</button>
          <button onClick={clearAll} className="px-3 py-1.5 bg-red-600/80 hover:bg-red-700 rounded-lg text-sm font-medium transition">🗑️ Очистить</button>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 mb-3">🖱️ Перетаскивайте мышкой • 🔍 Клик для профиля</p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2 space-y-2.5">
          <h3 className="font-bold text-sky-300 text-sm">🏒 Нападающие</h3>
          {lines.forwards.map((line, li) => {
            const avg = lineOvr(line);
            return (
              <div key={li} className="bg-gray-800/30 rounded-xl p-2.5 border border-gray-700/40">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-gray-500 font-medium">{lineNames[li]}</span>
                  {avg > 0 && <span className={`text-[10px] font-bold ${ovrColor(avg)}`}>Ø{avg}</span>}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {line.map((pl, pi) => <Slot key={pi} pl={pl} sType="F" li={li} pi={pi} label={fwdPos[pi]} />)}
                </div>
              </div>
            );
          })}
          <h3 className="font-bold text-sky-300 text-sm mt-3">🛡️ Защитники</h3>
          {lines.defense.map((pair, di) => {
            const avg = lineOvr(pair);
            return (
              <div key={di} className="bg-gray-800/30 rounded-xl p-2.5 border border-gray-700/40">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-gray-500 font-medium">{defNames[di]}</span>
                  {avg > 0 && <span className={`text-[10px] font-bold ${ovrColor(avg)}`}>Ø{avg}</span>}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {pair.map((pl, pi) => <Slot key={pi} pl={pl} sType="D" li={di} pi={pi} label="D" />)}
                </div>
              </div>
            );
          })}
          <h3 className="font-bold text-sky-300 text-sm mt-3">🥅 Вратари</h3>
          <div className="bg-gray-800/30 rounded-xl p-2.5 border border-gray-700/40">
            <div className="grid grid-cols-2 gap-1.5">
              {lines.goalies.map((pl, gi) => (
                <Slot key={gi} pl={pl} sType="G" li={0} pi={gi} label={gi === 0 ? 'Основной' : 'Запасной'} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-2.5 border border-gray-700/40 h-fit max-h-[78vh] overflow-y-auto"
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDropBench}>
          <h3 className="font-bold text-gray-400 text-sm mb-2 sticky top-0 bg-gray-800/95 py-1 z-10 backdrop-blur-sm">
            🪑 Скамейка ({bench.length})
          </h3>
          {bench.length === 0 && <p className="text-[11px] text-gray-600 text-center py-3">Все расставлены!</p>}
          <div className="space-y-0.5">
            {bench.sort((a, b) => b.ovr - a.ovr).map(p => (
              <div key={p.id} className="player-card flex items-center gap-1.5 bg-gray-900/50 rounded-lg p-1.5"
                draggable onDragStart={e => onDragStart(e, p, null)} onDragEnd={onDragEnd}>
                <div className="flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); onPlayerClick(p); }}>
                  {p.headshot ? (
                    <img src={p.headshot} alt="" className="w-6 h-6 rounded-full bg-gray-700 hover:ring-2 hover:ring-sky-400 transition-all"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[8px] hover:ring-2 hover:ring-sky-400 transition-all">{p.firstName[0]}{p.lastName[0]}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); onPlayerClick(p); }}>
                  <div className="text-[10px] font-medium truncate hover:text-sky-300 transition-colors">
                    {p.firstName[0]}. {p.lastName} {getFlag(p.birthCountry)}
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className={`text-[8px] px-0.5 rounded ${posColor(p.position)} text-white`}>{normalizePosition(p.position)}</span>
                    <span className={`text-[8px] font-bold ${ovrColor(p.ovr)}`}>{p.ovr}</span>
                    {p.stats && p.position !== 'G' && <span className="text-[7px] text-gray-500">{p.stats.points}P</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TRADE CENTER
// ═══════════════════════════════════════════════════════════════════════
function TradeView({ myTeam, teams, onTrade, onPlayerClick }: {
  myTeam: NHLTeam; teams: NHLTeam[];
  onTrade: (t: TradeOffer) => void;
  onPlayerClick: (p: NHLPlayer) => void;
}) {
  const [partnerAbbrev, setPartnerAbbrev] = useState('');
  const [myPick, setMyPick] = useState<NHLPlayer[]>([]);
  const [theirPick, setTheirPick] = useState<NHLPlayer[]>([]);
  const [showOk, setShowOk] = useState(false);
  const [searchMy, setSearchMy] = useState('');
  const [searchTheir, setSearchTheir] = useState('');

  const partner = teams.find(t => t.abbrev === partnerAbbrev);
  const others = teams.filter(t => t.abbrev !== myTeam.abbrev);

  const toggle = (_list: NHLPlayer[], set: React.Dispatch<React.SetStateAction<NHLPlayer[]>>, p: NHLPlayer) => {
    set(prev => prev.some(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };

  const canTrade = myPick.length > 0 && theirPick.length > 0 && partner;
  const myVal = myPick.reduce((s, p) => s + p.ovr, 0);
  const theirVal = theirPick.reduce((s, p) => s + p.ovr, 0);

  const doTrade = () => {
    if (!canTrade) return;
    onTrade({ fromTeam: myTeam.abbrev, toTeam: partnerAbbrev, playersFrom: myPick, playersTo: theirPick });
    setMyPick([]); setTheirPick([]);
    setShowOk(true); setTimeout(() => setShowOk(false), 3000);
  };

  const filterPl = (players: NHLPlayer[], search: string) =>
    players.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.ovr - a.ovr);

  const PlayerRow = ({ p, selected, onClick, side }: { p: NHLPlayer; selected: boolean; onClick: () => void; side: 'my' | 'their' }) => (
    <div className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all cursor-pointer ${selected ? side === 'my' ? 'bg-red-900/40 border border-red-500/50' : 'bg-green-900/40 border border-green-500/50'
      : 'bg-gray-900/40 hover:bg-gray-700/40 border border-transparent'
      }`}>
      <div className="flex-1 min-w-0 flex items-center gap-2" onClick={onClick}>
        {p.headshot ? (
          <img src={p.headshot} alt="" className="w-7 h-7 rounded-full bg-gray-700 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-[9px] flex-shrink-0">{p.firstName[0]}{p.lastName[0]}</div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">
            {p.firstName} {p.lastName} {getFlag(p.birthCountry)}
          </div>
          <div className="flex gap-1 items-center">
            <span className={`text-[9px] px-1 rounded ${posColor(p.position)} text-white`}>{normalizePosition(p.position)}</span>
            <span className={`text-[9px] ${ovrColor(p.ovr)}`}>{p.ovr}</span>
            <span className="text-[9px] text-gray-600">${p.salary}M</span>
          </div>
        </div>
      </div>
      <button className="text-[10px] text-gray-500 hover:text-sky-400 px-1" onClick={(e) => { e.stopPropagation(); onPlayerClick(p); }}>🔍</button>
      {selected && <span className={side === 'my' ? 'text-red-400 text-xs' : 'text-green-400 text-xs'}>✓</span>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <h2 className="text-2xl font-black mb-4">🔄 Центр обменов</h2>
      {showOk && (
        <div className="bg-green-900/60 border border-green-600 rounded-xl p-3 mb-4 text-center text-sm font-bold animate-pulse">✅ Обмен проведён!</div>
      )}
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1.5 block">Команда-партнёр:</label>
        <div className="flex flex-wrap gap-1.5">
          {others.map(t => (
            <button key={t.abbrev} onClick={() => { setPartnerAbbrev(t.abbrev); setTheirPick([]); setSearchTheir(''); }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] border transition-all ${partnerAbbrev === t.abbrev ? 'bg-sky-600 border-sky-500 text-white' : 'bg-gray-800/60 border-gray-700/50 text-gray-400 hover:border-gray-500'
                }`}>
              <img src={t.logo} alt="" className="w-4 h-4" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              {t.abbrev}
            </button>
          ))}
        </div>
      </div>
      {partner && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <img src={myTeam.logo} alt="" className="w-5 h-5" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <h3 className="font-bold text-sm">{myTeam.name}</h3>
              </div>
              <input type="text" placeholder="Поиск..." value={searchMy} onChange={e => setSearchMy(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-sky-500" />
              <div className="max-h-64 overflow-y-auto space-y-0.5">
                {filterPl(myTeam.players, searchMy).map(p => (
                  <PlayerRow key={p.id} p={p} selected={myPick.some(x => x.id === p.id)}
                    onClick={() => toggle(myPick, setMyPick, p)} side="my" />
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <img src={partner.logo} alt="" className="w-5 h-5" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <h3 className="font-bold text-sm">{partner.name}</h3>
              </div>
              <input type="text" placeholder="Поиск..." value={searchTheir} onChange={e => setSearchTheir(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-sky-500" />
              <div className="max-h-64 overflow-y-auto space-y-0.5">
                {filterPl(partner.players, searchTheir).map(p => (
                  <PlayerRow key={p.id} p={p} selected={theirPick.some(x => x.id === p.id)}
                    onClick={() => toggle(theirPick, setTheirPick, p)} side="their" />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <p className="text-[10px] text-gray-500 mb-1 uppercase">{myTeam.name} отдаёт:</p>
                {myPick.length === 0 ? <p className="text-xs text-gray-600">Не выбраны</p> : (
                  <div className="space-y-1">
                    {myPick.map(p => (
                      <div key={p.id} className="bg-red-900/20 rounded p-1.5 text-xs flex justify-between items-center">
                        <span>{p.firstName} {p.lastName} {getFlag(p.birthCountry)}</span>
                        <span className={ovrColor(p.ovr)}>{p.ovr}</span>
                      </div>
                    ))}
                    <div className="text-[10px] text-gray-500">Σ OVR: {myVal}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl">⇄</div>
                <button onClick={doTrade} disabled={!canTrade}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${canTrade ? 'bg-green-600 hover:bg-green-700 text-white pulse-glow' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}>Обменять</button>
                {canTrade && (
                  <span className={`text-[10px] ${Math.abs(myVal - theirVal) > 15 ? 'text-red-400' : 'text-green-400'}`}>
                    {Math.abs(myVal - theirVal) > 15 ? '⚠️ Неравный' : '✅ Справедливый'}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1 uppercase">{partner.name} отдаёт:</p>
                {theirPick.length === 0 ? <p className="text-xs text-gray-600">Не выбраны</p> : (
                  <div className="space-y-1">
                    {theirPick.map(p => (
                      <div key={p.id} className="bg-green-900/20 rounded p-1.5 text-xs flex justify-between items-center">
                        <span>{p.firstName} {p.lastName} {getFlag(p.birthCountry)}</span>
                        <span className={ovrColor(p.ovr)}>{p.ovr}</span>
                      </div>
                    ))}
                    <div className="text-[10px] text-gray-500">Σ OVR: {theirVal}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FREE AGENCY
// ═══════════════════════════════════════════════════════════════════════
function FreeAgencyView({ freeAgents, onSign, teamName, onPlayerClick }: {
  freeAgents: NHLPlayer[]; onSign: (p: NHLPlayer) => void; teamName: string;
  onPlayerClick: (p: NHLPlayer) => void;
}) {
  const [filterPos, setFilterPos] = useState('ALL');
  const [sortBy, setSortBy] = useState<'ovr' | 'salary' | 'age'>('ovr');
  const [confirmPl, setConfirmPl] = useState<NHLPlayer | null>(null);

  const filtered = useMemo(() => {
    let list = [...freeAgents];
    if (filterPos !== 'ALL') {
      list = list.filter(p => {
        const np = normalizePosition(p.position);
        if (filterPos === 'F') return isForward(p.position);
        return np === filterPos;
      });
    }
    switch (sortBy) {
      case 'ovr': list.sort((a, b) => b.ovr - a.ovr); break;
      case 'salary': list.sort((a, b) => a.salary - b.salary); break;
      case 'age': list.sort((a, b) => a.age - b.age); break;
    }
    return list;
  }, [freeAgents, filterPos, sortBy]);

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <h2 className="text-2xl font-black mb-4">✍️ Свободные агенты</h2>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {['ALL', 'F', 'C', 'LW', 'RW', 'D', 'G'].map(pos => (
          <button key={pos} onClick={() => setFilterPos(pos)}
            className={`px-3 py-1 rounded-lg text-sm ${filterPos === pos ? 'bg-sky-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {pos === 'ALL' ? 'Все' : pos === 'F' ? 'Нап' : pos}
          </button>
        ))}
        <div className="ml-auto flex gap-1.5">
          {(['ovr', 'salary', 'age'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-2.5 py-1 rounded-lg text-xs ${sortBy === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}`}>
              {s === 'ovr' ? 'OVR' : s === 'salary' ? '$' : 'Возр'}
            </button>
          ))}
        </div>
      </div>
      {confirmPl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setConfirmPl(null)}>
          <div className="bg-gray-800 rounded-xl p-5 max-w-sm border border-gray-600" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Подписать?</h3>
            <div className="bg-gray-900 rounded-lg p-3 mb-3">
              <div className="font-bold">{confirmPl.firstName} {confirmPl.lastName} {getFlag(confirmPl.birthCountry)}</div>
              <div className="flex gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs text-white ${posColor(confirmPl.position)}`}>{normalizePosition(confirmPl.position)}</span>
                <span className={ovrColor(confirmPl.ovr)}>{confirmPl.ovr} OVR</span>
              </div>
              <div className="mt-1.5 text-sm text-gray-400">Возр: {confirmPl.age} • <span className="text-green-400">${confirmPl.salary}M</span></div>
            </div>
            <p className="text-sm text-gray-400 mb-3">Подписать в {teamName}?</p>
            <div className="flex gap-2">
              <button onClick={() => { onSign(confirmPl); setConfirmPl(null); }}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold text-sm">✅ Подписать</button>
              <button onClick={() => setConfirmPl(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-600"><div className="text-3xl mb-2">🚫</div><p>Нет свободных агентов</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filtered.map(p => (
            <div key={p.id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-sky-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="cursor-pointer" onClick={() => onPlayerClick(p)}>
                  <div className="font-bold text-sm">{p.firstName} {p.lastName} {getFlag(p.birthCountry)}</div>
                  <div className="flex gap-1.5 items-center mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${posColor(p.position)}`}>{normalizePosition(p.position)}</span>
                    <span className="text-xs text-gray-500">Возр: {p.age}</span>
                    <span className="text-xs" title={getCountryName(p.birthCountry)}>{getFlag(p.birthCountry)}</span>
                  </div>
                </div>
                <span className={`text-xl font-black ${ovrColor(p.ovr)}`}>{p.ovr}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-green-400 text-sm font-medium">${p.salary}M</span>
                <button onClick={() => setConfirmPl(p)}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 rounded-lg text-xs font-medium transition">✍️ Подписать</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// STANDINGS
// ═══════════════════════════════════════════════════════════════════════
function StandingsView({ standings, teams, myAbbrev }: {
  standings: StandingsTeam[]; teams: NHLTeam[]; myAbbrev: string;
}) {
  const [view, setView] = useState<'division' | 'conference' | 'league'>('division');
  const data: StandingsTeam[] = useMemo(() => {
    if (standings.length > 0) return standings;
    return teams.map(t => {
      const w = Math.floor(Math.random() * 30) + 20;
      const l = Math.floor(Math.random() * 25) + 15;
      const otl = Math.floor(Math.random() * 10);
      return {
        abbrev: t.abbrev, name: t.name, logo: t.logo,
        gamesPlayed: w + l + otl, wins: w, losses: l, otLosses: otl, points: w * 2 + otl,
        goalsFor: Math.floor(Math.random() * 100) + 180, goalsAgainst: Math.floor(Math.random() * 100) + 180,
        division: t.division, conference: t.conference,
      };
    });
  }, [standings, teams]);

  const sorted = [...data].sort((a, b) => b.points - a.points);
  const divs = ['Atlantic', 'Metropolitan', 'Central', 'Pacific'];

  const Table = ({ title, list }: { title: string; list: StandingsTeam[] }) => (
    <div className="mb-5">
      <h3 className="font-bold text-sky-300 text-sm mb-2">{title}</h3>
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900/80 text-gray-500 text-[10px] uppercase">
              <th className="p-2 text-left w-8">#</th><th className="p-2 text-left">Команда</th>
              <th className="p-2 text-center">GP</th><th className="p-2 text-center">W</th>
              <th className="p-2 text-center">L</th><th className="p-2 text-center">OTL</th>
              <th className="p-2 text-center font-bold">PTS</th>
              <th className="p-2 text-center hidden sm:table-cell">GF</th>
              <th className="p-2 text-center hidden sm:table-cell">GA</th>
            </tr>
          </thead>
          <tbody>
            {list.sort((a, b) => b.points - a.points).map((t, i) => (
              <tr key={t.abbrev}
                className={`border-t border-gray-700/30 ${t.abbrev === myAbbrev ? 'bg-sky-900/20' : i % 2 === 0 ? 'bg-gray-800/20' : ''}`}>
                <td className="p-2 text-gray-600 text-xs">{i + 1}</td>
                <td className="p-2">
                  <div className="flex items-center gap-1.5">
                    <img src={t.logo || `https://assets.nhle.com/logos/nhl/svg/${t.abbrev}_light.svg`} alt="" className="w-5 h-5"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span className={`text-xs ${t.abbrev === myAbbrev ? 'text-sky-300 font-bold' : ''}`}>{t.name || t.abbrev}</span>
                  </div>
                </td>
                <td className="p-2 text-center text-gray-500 text-xs">{t.gamesPlayed}</td>
                <td className="p-2 text-center text-green-400 text-xs">{t.wins}</td>
                <td className="p-2 text-center text-red-400 text-xs">{t.losses}</td>
                <td className="p-2 text-center text-yellow-400 text-xs">{t.otLosses}</td>
                <td className="p-2 text-center font-black text-xs">{t.points}</td>
                <td className="p-2 text-center text-gray-500 text-xs hidden sm:table-cell">{t.goalsFor}</td>
                <td className="p-2 text-center text-gray-500 text-xs hidden sm:table-cell">{t.goalsAgainst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-black">🏆 Таблица НХЛ</h2>
        <div className="flex gap-1.5">
          {(['division', 'conference', 'league'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg text-xs ${view === v ? 'bg-sky-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {v === 'division' ? 'Дивизионы' : v === 'conference' ? 'Конференции' : 'Общая'}
            </button>
          ))}
        </div>
      </div>
      {standings.length > 0 && <p className="text-[10px] text-gray-600 mb-3">📡 Данные из api-web.nhle.com</p>}
      {view === 'league' && <Table title="Все команды" list={sorted} />}
      {view === 'conference' && (
        <><Table title="Eastern Conference" list={sorted.filter(t => t.conference === 'Eastern')} />
          <Table title="Western Conference" list={sorted.filter(t => t.conference === 'Western')} /></>
      )}
      {view === 'division' && divs.map(d => {
        let list = sorted.filter(t => t.division === d);
        if (list.length === 0) {
          const tms = teams.filter(t => t.division === d);
          list = tms.map(t => data.find(x => x.abbrev === t.abbrev)).filter(Boolean) as StandingsTeam[];
        }
        return list.length > 0 ? <Table key={d} title={`${d} Division`} list={list} /> : null;
      })}
    </div>
  );
}
