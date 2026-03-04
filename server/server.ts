// ============================================================
// 🏒 NHL GM SIMULATOR — BACKEND (Express + TypeScript)
// ============================================================
// Загружает реальные данные с api-web.nhle.com
// Использует встроенный https модуль Node.js (БЕЗ node-fetch)
// Кэширует в памяти, отдаёт фронтенду через REST API
// ============================================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import https from 'https';
import path from 'path';

const app = express();
const PORT = 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Типы ───────────────────────────────────────────────────

interface PlayerStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  shots: number;
  hits: number;
  blockedShots: number;
  powerPlayGoals: number;
  gameWinningGoals: number;
  shortHandedGoals: number;
  faceoffWinPct: number;
  avgToi: string;
  wins?: number;
  losses?: number;
  otLosses?: number;
  goalsAgainstAvg?: number;
  savePct?: number;
  shutouts?: number;
}

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  jerseyNumber: string;
  age: number;
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  nationality: string;
  heightCm: number;
  weightKg: number;
  shoots: string;
  salary: number;
  ovr: number;
  headshot: string;
  currentStats: PlayerStats | null;
  lastSeasonStats: PlayerStats | null;
}

interface Team {
  id: number;
  abbrev: string;
  name: string;
  city: string;
  conference: string;
  division: string;
  logo: string;
  roster: Player[];
  loadedFromAPI: boolean;
}

interface StandingsTeam {
  abbrev: string;
  name: string;
  conference: string;
  division: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  streakCode: string;
  logo: string;
}

interface CacheData {
  teams: Team[];
  standings: StandingsTeam[];
  lastUpdated: string;
  loadTime: number;
}

// ── Кэш в памяти ──────────────────────────────────────────

let cache: CacheData | null = null;
let isLoading = false;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 часов

// ── Все 32 команды НХЛ ────────────────────────────────────

const NHL_TEAMS = [
  { abbrev: 'ANA', name: 'Anaheim Ducks', city: 'Anaheim', conference: 'Western', division: 'Pacific' },
  { abbrev: 'BOS', name: 'Boston Bruins', city: 'Boston', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'BUF', name: 'Buffalo Sabres', city: 'Buffalo', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'CGY', name: 'Calgary Flames', city: 'Calgary', conference: 'Western', division: 'Pacific' },
  { abbrev: 'CAR', name: 'Carolina Hurricanes', city: 'Raleigh', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'CHI', name: 'Chicago Blackhawks', city: 'Chicago', conference: 'Western', division: 'Central' },
  { abbrev: 'COL', name: 'Colorado Avalanche', city: 'Denver', conference: 'Western', division: 'Central' },
  { abbrev: 'CBJ', name: 'Columbus Blue Jackets', city: 'Columbus', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'DAL', name: 'Dallas Stars', city: 'Dallas', conference: 'Western', division: 'Central' },
  { abbrev: 'DET', name: 'Detroit Red Wings', city: 'Detroit', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'EDM', name: 'Edmonton Oilers', city: 'Edmonton', conference: 'Western', division: 'Pacific' },
  { abbrev: 'FLA', name: 'Florida Panthers', city: 'Sunrise', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'LAK', name: 'Los Angeles Kings', city: 'Los Angeles', conference: 'Western', division: 'Pacific' },
  { abbrev: 'MIN', name: 'Minnesota Wild', city: 'St. Paul', conference: 'Western', division: 'Central' },
  { abbrev: 'MTL', name: 'Montréal Canadiens', city: 'Montréal', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'NSH', name: 'Nashville Predators', city: 'Nashville', conference: 'Western', division: 'Central' },
  { abbrev: 'NJD', name: 'New Jersey Devils', city: 'Newark', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'NYI', name: 'New York Islanders', city: 'Elmont', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'NYR', name: 'New York Rangers', city: 'New York', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'OTT', name: 'Ottawa Senators', city: 'Ottawa', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'PHI', name: 'Philadelphia Flyers', city: 'Philadelphia', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'PIT', name: 'Pittsburgh Penguins', city: 'Pittsburgh', conference: 'Eastern', division: 'Metropolitan' },
  { abbrev: 'SJS', name: 'San Jose Sharks', city: 'San Jose', conference: 'Western', division: 'Pacific' },
  { abbrev: 'SEA', name: 'Seattle Kraken', city: 'Seattle', conference: 'Western', division: 'Pacific' },
  { abbrev: 'STL', name: 'St. Louis Blues', city: 'St. Louis', conference: 'Western', division: 'Central' },
  { abbrev: 'TBL', name: 'Tampa Bay Lightning', city: 'Tampa', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'TOR', name: 'Toronto Maple Leafs', city: 'Toronto', conference: 'Eastern', division: 'Atlantic' },
  { abbrev: 'UTA', name: 'Utah Hockey Club', city: 'Salt Lake City', conference: 'Western', division: 'Central' },
  { abbrev: 'VAN', name: 'Vancouver Canucks', city: 'Vancouver', conference: 'Western', division: 'Pacific' },
  { abbrev: 'VGK', name: 'Vegas Golden Knights', city: 'Las Vegas', conference: 'Western', division: 'Pacific' },
  { abbrev: 'WPG', name: 'Winnipeg Jets', city: 'Winnipeg', conference: 'Western', division: 'Central' },
  { abbrev: 'WSH', name: 'Washington Capitals', city: 'Washington', conference: 'Eastern', division: 'Metropolitan' },
];

// ── Флаги стран ────────────────────────────────────────────

const FLAGS: Record<string, string> = {
  CAN: '🇨🇦', USA: '🇺🇸', SWE: '🇸🇪', FIN: '🇫🇮', RUS: '🇷🇺',
  CZE: '🇨🇿', SVK: '🇸🇰', DEU: '🇩🇪', CHE: '🇨🇭', DNK: '🇩🇰',
  NOR: '🇳🇴', AUT: '🇦🇹', LVA: '🇱🇻', SVN: '🇸🇮', BLR: '🇧🇾',
  GBR: '🇬🇧', FRA: '🇫🇷', NLD: '🇳🇱', AUS: '🇦🇺', BGR: '🇧🇬',
  UKR: '🇺🇦', LTU: '🇱🇹', HRV: '🇭🇷', JPN: '🇯🇵', KOR: '🇰🇷',
  NGA: '🇳🇬', JAM: '🇯🇲', HTI: '🇭🇹', BHS: '🇧🇸', POL: '🇵🇱',
};

function getFlag(code: string): string {
  return FLAGS[code] || '🏳️';
}

// ═══════════════════════════════════════════════════════════
// 🌐 HTTPS запросы через встроенный модуль Node.js
//    (НИКАКОГО node-fetch — работает на ЛЮБОЙ версии Node!)
// ═══════════════════════════════════════════════════════════

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'NHL-GM-Simulator/1.0',
        'Accept': 'application/json',
      },
      timeout: 15000,
    }, (res) => {
      // Обработка редиректов (301, 302, 307, 308)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode && res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume(); // очищаем ответ
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk: string) => { data += chunk; });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function fetchJSON(url: string): Promise<any> {
  try {
    const raw = await httpsGet(url);
    return JSON.parse(raw);
  } catch (err) {
    console.error(`  ❌ Ошибка: ${url} — ${(err as Error).message}`);
    return null;
  }
}

// ── Нормализация позиции ───────────────────────────────────

function normalizePosition(pos: string): string {
  if (pos === 'L') return 'LW';
  if (pos === 'R') return 'RW';
  return pos;
}

// ── Расчёт OVR по статистике ───────────────────────────────

function calculateSkaterOVR(
  current: PlayerStats | null,
  last: PlayerStats | null,
  position: string,
  age: number
): number {
  if (!current && !last) return 70 + Math.floor(Math.random() * 10);

  const calc = (s: PlayerStats): number => {
    const gp = s.gamesPlayed || 1;
    const ppg = s.points / gp;
    const gpg = s.goals / gp;
    const pm = s.plusMinus;

    let base: number;
    if (position === 'D') {
      base = 68 + ppg * 22 + gpg * 8 + Math.max(pm, -10) * 0.15;
      base += Math.min((s.blockedShots || 0) / gp * 1.5, 3);
      base += Math.min((s.hits || 0) / gp * 0.5, 2);
    } else {
      base = 65 + ppg * 28 + gpg * 12 + Math.max(pm, -15) * 0.12;
      base += Math.min((s.shots || 0) / gp * 0.3, 3);
      base += Math.min((s.powerPlayGoals || 0) * 0.15, 3);
    }

    if (gp >= 70) base += 2;
    else if (gp >= 50) base += 1;

    return base;
  };

  let ovr = 70;
  if (current && current.gamesPlayed > 5) {
    const currentOVR = calc(current);
    if (last && last.gamesPlayed > 20) {
      const lastOVR = calc(last);
      ovr = currentOVR * 0.7 + lastOVR * 0.3;
    } else {
      ovr = currentOVR;
    }
  } else if (last && last.gamesPlayed > 10) {
    ovr = calc(last) - 1;
  }

  if (age >= 38) ovr -= 3;
  else if (age >= 36) ovr -= 1;
  else if (age <= 21) ovr -= 1;

  return Math.min(99, Math.max(58, Math.round(ovr)));
}

function calculateGoalieOVR(
  current: PlayerStats | null,
  last: PlayerStats | null,
  age: number
): number {
  if (!current && !last) return 72 + Math.floor(Math.random() * 8);

  const calc = (s: PlayerStats): number => {
    const svPct = s.savePct || 0;
    const gaa = s.goalsAgainstAvg || 3.5;
    const gp = s.gamesPlayed || 1;
    const wins = s.wins || 0;
    const shutouts = s.shutouts || 0;

    let base = 60;
    base += (svPct - 0.880) * 500;
    base -= (gaa - 2.5) * 3;
    base += (wins / gp) * 8;
    base += Math.min(shutouts * 0.8, 4);
    if (gp >= 50) base += 2;
    else if (gp >= 30) base += 1;

    return base;
  };

  let ovr = 72;
  if (current && current.gamesPlayed > 5) {
    const currentOVR = calc(current);
    if (last && last.gamesPlayed > 15) {
      const lastOVR = calc(last);
      ovr = currentOVR * 0.7 + lastOVR * 0.3;
    } else {
      ovr = currentOVR;
    }
  } else if (last && last.gamesPlayed > 10) {
    ovr = calc(last) - 1;
  }

  if (age >= 37) ovr -= 2;
  else if (age >= 35) ovr -= 1;

  return Math.min(99, Math.max(58, Math.round(ovr)));
}

// ── Зарплата по OVR ────────────────────────────────────────

function estimateSalary(ovr: number, position: string): number {
  let base: number;
  if (ovr >= 92) base = 9_000_000 + (ovr - 92) * 1_500_000;
  else if (ovr >= 88) base = 7_000_000 + (ovr - 88) * 500_000;
  else if (ovr >= 84) base = 4_500_000 + (ovr - 84) * 625_000;
  else if (ovr >= 80) base = 2_500_000 + (ovr - 80) * 500_000;
  else if (ovr >= 75) base = 1_200_000 + (ovr - 75) * 260_000;
  else base = 775_000 + (ovr - 65) * 42_500;

  if (position === 'G') base *= 0.85;
  if (position === 'D') base *= 0.95;

  return Math.max(775_000, Math.round(base / 50_000) * 50_000);
}

// ── Расчёт возраста ────────────────────────────────────────

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ═══════════════════════════════════════════════════════════
// 📡 Загрузка состава команды с NHL API
// ═══════════════════════════════════════════════════════════

async function loadTeamRoster(abbrev: string): Promise<any[]> {
  const data = await fetchJSON(`https://api-web.nhle.com/v1/roster/${abbrev}/current`);
  if (!data) return [];

  const players: any[] = [];
  for (const group of ['forwards', 'defensemen', 'goalies']) {
    if (data[group] && Array.isArray(data[group])) {
      for (const p of data[group]) {
        players.push(p);
      }
    }
  }
  return players;
}

// ═══════════════════════════════════════════════════════════
// 📊 Загрузка статистики команды за сезон
// ═══════════════════════════════════════════════════════════

async function loadTeamStats(abbrev: string, season: string): Promise<Map<number, any>> {
  const map = new Map<number, any>();

  const url = season === 'now'
    ? `https://api-web.nhle.com/v1/club-stats/${abbrev}/now`
    : `https://api-web.nhle.com/v1/club-stats/${abbrev}/${season}`;

  const data = await fetchJSON(url);
  if (!data) return map;

  // Полевые игроки
  if (data.skaters && Array.isArray(data.skaters)) {
    for (const s of data.skaters) {
      map.set(s.playerId, {
        gamesPlayed: s.gamesPlayed || 0,
        goals: s.goals || 0,
        assists: s.assists || 0,
        points: s.points || 0,
        plusMinus: s.plusMinus || 0,
        pim: s.penaltyMinutes || s.pim || 0,
        shots: s.shots || 0,
        hits: s.hits || 0,
        blockedShots: s.blockedShots || 0,
        powerPlayGoals: s.powerPlayGoals || 0,
        gameWinningGoals: s.gameWinningGoals || 0,
        shortHandedGoals: s.shorthandGoals || s.shortHandedGoals || 0,
        faceoffWinPct: s.faceoffWinPct || s.faceoffWinningPctg || 0,
        avgToi: s.avgTimeOnIce || s.avgToi || '0:00',
        type: 'skater',
      });
    }
  }

  // Вратари
  if (data.goalies && Array.isArray(data.goalies)) {
    for (const g of data.goalies) {
      map.set(g.playerId, {
        gamesPlayed: g.gamesPlayed || 0,
        goals: 0,
        assists: g.assists || 0,
        points: g.points || 0,
        plusMinus: 0,
        pim: g.penaltyMinutes || g.pim || 0,
        shots: 0,
        hits: 0,
        blockedShots: 0,
        powerPlayGoals: 0,
        gameWinningGoals: 0,
        shortHandedGoals: 0,
        faceoffWinPct: 0,
        avgToi: g.avgToi || '0:00',
        wins: g.wins || 0,
        losses: g.losses || 0,
        otLosses: g.otLosses || 0,
        goalsAgainstAvg: g.goalsAgainstAvg || g.goalsAgainstAverage || 0,
        savePct: g.savePct || g.savePercentage || g.savePctg || 0,
        shutouts: g.shutouts || 0,
        type: 'goalie',
      });
    }
  }

  return map;
}

// ═══════════════════════════════════════════════════════════
// 🔄 Форматирование статистики
// ═══════════════════════════════════════════════════════════

function formatStats(s: any): PlayerStats | null {
  if (!s) return null;
  return {
    gamesPlayed: s.gamesPlayed || 0,
    goals: s.goals || 0,
    assists: s.assists || 0,
    points: s.points || 0,
    plusMinus: s.plusMinus || 0,
    pim: s.pim || 0,
    shots: s.shots || 0,
    hits: s.hits || 0,
    blockedShots: s.blockedShots || 0,
    powerPlayGoals: s.powerPlayGoals || 0,
    gameWinningGoals: s.gameWinningGoals || 0,
    shortHandedGoals: s.shortHandedGoals || 0,
    faceoffWinPct: s.faceoffWinPct || 0,
    avgToi: s.avgToi || '0:00',
    wins: s.wins,
    losses: s.losses,
    otLosses: s.otLosses,
    goalsAgainstAvg: s.goalsAgainstAvg,
    savePct: s.savePct,
    shutouts: s.shutouts,
  };
}

// ═══════════════════════════════════════════════════════════
// 🏒 ГЛАВНАЯ ФУНКЦИЯ: Загрузка ВСЕХ данных
// ═══════════════════════════════════════════════════════════

async function loadAllData(): Promise<CacheData> {
  const startTime = Date.now();
  console.log('\n📡 ═══════════════════════════════════════════');
  console.log('📡  Загрузка данных с NHL API...');
  console.log('📡 ═══════════════════════════════════════════\n');

  const teams: Team[] = [];

  // Загружаем по 6 команд параллельно (чтобы не перегружать API)
  const batchSize = 6;
  for (let i = 0; i < NHL_TEAMS.length; i += batchSize) {
    const batch = NHL_TEAMS.slice(i, i + batchSize);

    const results = await Promise.all(batch.map(async (teamInfo) => {
      try {
        // Параллельно загружаем: состав + статистика за 2 сезона
        const [rosterData, currentStats, lastStats] = await Promise.all([
          loadTeamRoster(teamInfo.abbrev),
          loadTeamStats(teamInfo.abbrev, 'now'),
          loadTeamStats(teamInfo.abbrev, '20232024'),
        ]);

        if (rosterData.length === 0) {
          console.log(`  ⚠️  ${teamInfo.abbrev}: состав не загружен, пропускаю`);
          return null;
        }

        // Конвертируем каждого игрока
        const roster: Player[] = rosterData.map((p: any) => {
          const id = p.id;
          const firstName = p.firstName?.default || p.firstName || '';
          const lastName = p.lastName?.default || p.lastName || '';
          const rawPos = p.positionCode || p.position || 'C';
          const position = normalizePosition(rawPos);
          const birthDate = p.birthDate || '1995-01-01';
          const age = calcAge(birthDate);
          const birthCountry = p.birthCountry || 'CAN';

          const curStats = currentStats.get(id) || null;
          const lstStats = lastStats.get(id) || null;

          const ovr = position === 'G'
            ? calculateGoalieOVR(curStats, lstStats, age)
            : calculateSkaterOVR(curStats, lstStats, position, age);

          const salary = estimateSalary(ovr, position);
          const headshot = p.headshot || `https://assets.nhle.com/mugs/nhl/latest/${id}.png`;

          return {
            id,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            position,
            jerseyNumber: String(p.sweaterNumber || p.jerseyNumber || '0'),
            age,
            birthDate,
            birthCity: p.birthCity?.default || p.birthCity || '',
            birthCountry,
            nationality: getFlag(birthCountry),
            heightCm: p.heightInCentimeters || p.heightCm || 183,
            weightKg: p.weightInKilograms || p.weightKg || 86,
            shoots: p.shootsCatches || 'L',
            salary,
            ovr,
            headshot,
            currentStats: formatStats(curStats),
            lastSeasonStats: formatStats(lstStats),
          };
        });

        roster.sort((a, b) => b.ovr - a.ovr);

        const team: Team = {
          id: 0,
          abbrev: teamInfo.abbrev,
          name: teamInfo.name,
          city: teamInfo.city,
          conference: teamInfo.conference,
          division: teamInfo.division,
          logo: `https://assets.nhle.com/logos/nhl/svg/${teamInfo.abbrev}_light.svg`,
          roster,
          loadedFromAPI: true,
        };

        console.log(`  ✅ ${teamInfo.abbrev} — ${teamInfo.name} (${roster.length} игроков, ` +
          `${currentStats.size} с текущей стат., ${lastStats.size} с прошлой)`);
        return team;

      } catch (err) {
        console.error(`  ❌ ${teamInfo.abbrev}: ${(err as Error).message}`);
        return null;
      }
    }));

    for (const r of results) {
      if (r) teams.push(r);
    }

    // Маленькая пауза между батчами, чтобы API не заблокировал
    if (i + batchSize < NHL_TEAMS.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // ── Загрузка таблицы ───────────────────────────────────
  console.log('\n  📊 Загружаю турнирную таблицу...');
  const standings: StandingsTeam[] = [];

  const standingsData = await fetchJSON('https://api-web.nhle.com/v1/standings/now');
  if (standingsData && standingsData.standings) {
    for (const s of standingsData.standings) {
      standings.push({
        abbrev: s.teamAbbrev?.default || s.teamAbbrev || '',
        name: s.teamName?.default || s.teamName || '',
        conference: s.conferenceName || '',
        division: s.divisionName || '',
        gamesPlayed: s.gamesPlayed || 0,
        wins: s.wins || 0,
        losses: s.losses || 0,
        otLosses: s.otLosses || 0,
        points: s.points || 0,
        goalsFor: s.goalFor || s.goalsFor || 0,
        goalsAgainst: s.goalAgainst || s.goalsAgainst || 0,
        goalDiff: (s.goalFor || 0) - (s.goalAgainst || 0),
        streakCode: s.streakCode || '',
        logo: s.teamLogo || `https://assets.nhle.com/logos/nhl/svg/${s.teamAbbrev?.default || ''}_light.svg`,
      });
    }
    console.log(`  ✅ Таблица загружена (${standings.length} команд)`);
  } else {
    console.log('  ⚠️  Таблица не загружена');
  }

  const loadTime = Date.now() - startTime;
  const totalPlayers = teams.reduce((sum, t) => sum + t.roster.length, 0);

  console.log('\n═══════════════════════════════════════════════');
  console.log(`✅ Загрузка завершена!`);
  console.log(`   🏒 Команд:  ${teams.length} / ${NHL_TEAMS.length}`);
  console.log(`   👤 Игроков: ${totalPlayers}`);
  console.log(`   ⏱  Время:   ${(loadTime / 1000).toFixed(1)} сек`);
  console.log('═══════════════════════════════════════════════\n');

  return {
    teams,
    standings,
    lastUpdated: new Date().toISOString(),
    loadTime,
  };
}

// ═══════════════════════════════════════════════════════════
// 🔌 API РОУТЫ
// ═══════════════════════════════════════════════════════════

// 📊 Статус сервера
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    cached: !!cache,
    lastUpdated: cache?.lastUpdated || null,
    teamsCount: cache?.teams.length || 0,
    playersCount: cache?.teams.reduce((sum, t) => sum + t.roster.length, 0) || 0,
    loadTime: cache?.loadTime || 0,
    isLoading,
    cacheAge: cache ? Date.now() - new Date(cache.lastUpdated).getTime() : 0,
    cacheTTL: CACHE_TTL,
  });
});

// 🏒 Все команды с составами и статистикой
app.get('/api/teams', async (_req: Request, res: Response) => {
  try {
    // Проверяем не устарел ли кэш
    if (cache) {
      const age = Date.now() - new Date(cache.lastUpdated).getTime();
      if (age > CACHE_TTL) {
        console.log('⏰ Кэш устарел, обновляю данные...');
        if (!isLoading) {
          isLoading = true;
          cache = await loadAllData();
          isLoading = false;
        }
      }
    }

    if (!cache) {
      if (!isLoading) {
        isLoading = true;
        cache = await loadAllData();
        isLoading = false;
      } else {
        res.status(503).json({
          error: 'Данные загружаются... Подождите 30-60 секунд и обновите страницу.',
          isLoading: true
        });
        return;
      }
    }

    res.json({
      teams: cache.teams,
      standings: cache.standings,
      lastUpdated: cache.lastUpdated,
      loadTime: cache.loadTime,
      source: 'api-web.nhle.com',
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 👥 Одна команда
app.get('/api/team/:abbrev', async (req: Request, res: Response) => {
  try {
    if (!cache) {
      if (!isLoading) {
        isLoading = true;
        cache = await loadAllData();
        isLoading = false;
      } else {
        res.status(503).json({ error: 'Данные загружаются...' });
        return;
      }
    }
    const abbrev = req.params.abbrev.toUpperCase();
    const team = cache.teams.find(t => t.abbrev === abbrev);
    if (!team) {
      res.status(404).json({ error: `Команда ${abbrev} не найдена` });
      return;
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 👤 Детальная статистика игрока (загружает с NHL API)
app.get('/api/player/:id', async (req: Request, res: Response) => {
  try {
    const playerId = req.params.id;

    // Ищем в кэше
    let cachedPlayer: Player | null = null;
    let playerTeam = '';

    if (cache) {
      for (const team of cache.teams) {
        const found = team.roster.find(p => String(p.id) === playerId);
        if (found) {
          cachedPlayer = found;
          playerTeam = team.abbrev;
          break;
        }
      }
    }

    // Загружаем детальные данные с NHL API
    const detailed = await fetchJSON(`https://api-web.nhle.com/v1/player/${playerId}/landing`);

    if (detailed) {
      res.json({
        ...cachedPlayer,
        team: playerTeam,
        featuredStats: detailed.featuredStats || null,
        seasonTotals: detailed.seasonTotals || [],
        awards: detailed.awards || [],
        draftDetails: detailed.draftDetails || null,
        heroImage: detailed.heroImage || null,
        careerTotals: detailed.careerTotals || null,
        currentTeamAbbrev: detailed.currentTeamAbbrev || playerTeam,
        position: normalizePosition(detailed.position || cachedPlayer?.position || 'C'),
        heightInFeetInches: detailed.heightInFeetInches || '',
        weightInPounds: detailed.weightInPounds || 0,
      });
    } else if (cachedPlayer) {
      res.json({ ...cachedPlayer, team: playerTeam });
    } else {
      res.status(404).json({ error: 'Игрок не найден' });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🏆 Таблица
app.get('/api/standings', async (_req: Request, res: Response) => {
  try {
    if (!cache) {
      if (!isLoading) {
        isLoading = true;
        cache = await loadAllData();
        isLoading = false;
      } else {
        res.status(503).json({ error: 'Данные загружаются...' });
        return;
      }
    }
    res.json({
      standings: cache.standings,
      lastUpdated: cache.lastUpdated,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🔍 Поиск игроков
app.get('/api/search', (req: Request, res: Response) => {
  if (!cache) {
    res.status(503).json({ error: 'Данные ещё не загружены' });
    return;
  }

  const query = String(req.query.q || '').toLowerCase().trim();
  if (query.length < 2) {
    res.json({ results: [] });
    return;
  }

  const results: (Player & { team: string })[] = [];
  for (const team of cache.teams) {
    for (const player of team.roster) {
      if (
        player.fullName.toLowerCase().includes(query) ||
        player.lastName.toLowerCase().includes(query) ||
        player.firstName.toLowerCase().includes(query)
      ) {
        results.push({ ...player, team: team.abbrev });
      }
    }
  }

  results.sort((a, b) => b.ovr - a.ovr);
  res.json({ results: results.slice(0, 30) });
});

// 📊 Лидеры лиги
app.get('/api/leaders', (req: Request, res: Response) => {
  if (!cache) {
    res.status(503).json({ error: 'Данные ещё не загружены' });
    return;
  }

  const category = String(req.query.cat || 'points');
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const allPlayers: (Player & { team: string })[] = [];
  for (const team of cache.teams) {
    for (const player of team.roster) {
      if (player.currentStats && player.currentStats.gamesPlayed > 0) {
        allPlayers.push({ ...player, team: team.abbrev });
      }
    }
  }

  allPlayers.sort((a, b) => {
    const aS = a.currentStats!;
    const bS = b.currentStats!;

    switch (category) {
      case 'goals': return bS.goals - aS.goals;
      case 'assists': return bS.assists - aS.assists;
      case 'points': return bS.points - aS.points;
      case 'plusMinus': return bS.plusMinus - aS.plusMinus;
      case 'ovr': return b.ovr - a.ovr;
      case 'hits': return bS.hits - aS.hits;
      case 'blockedShots': return bS.blockedShots - aS.blockedShots;
      case 'pim': return bS.pim - aS.pim;
      case 'savePct': return (bS.savePct || 0) - (aS.savePct || 0);
      case 'gaa': return (aS.goalsAgainstAvg || 99) - (bS.goalsAgainstAvg || 99);
      case 'wins': return (bS.wins || 0) - (aS.wins || 0);
      default: return bS.points - aS.points;
    }
  });

  res.json({ leaders: allPlayers.slice(0, limit), category });
});

// 🔄 Принудительное обновление
app.post('/api/refresh', async (_req: Request, res: Response) => {
  if (isLoading) {
    res.json({ message: 'Уже загружается, подождите...' });
    return;
  }

  console.log('\n🔄 Принудительное обновление данных...');
  isLoading = true;
  try {
    cache = await loadAllData();
    isLoading = false;
    res.json({
      message: '✅ Данные обновлены!',
      teamsCount: cache.teams.length,
      playersCount: cache.teams.reduce((sum, t) => sum + t.roster.length, 0),
      lastUpdated: cache.lastUpdated,
      loadTime: cache.loadTime,
    });
  } catch (err) {
    isLoading = false;
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── Раздача фронтенда ─────────────────────────────────────

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <head><title>NHL GM Simulator</title></head>
          <body style="font-family:sans-serif; text-align:center; padding:50px; background:#0a0e1a; color:white;">
            <h1>🏒 NHL GM Simulator — API Server</h1>
            <p>Бэкенд работает! Фронтенд ещё не собран.</p>
            <p>Выполните <code>npm run build</code> в корне проекта.</p>
            <hr style="border-color:#333; margin:30px 0;">
            <h3>📡 API Эндпоинты:</h3>
            <ul style="list-style:none; line-height:2;">
              <li><a href="/api/status" style="color:#60a5fa">/api/status</a> — Статус сервера</li>
              <li><a href="/api/teams" style="color:#60a5fa">/api/teams</a> — Все команды + составы</li>
              <li><a href="/api/standings" style="color:#60a5fa">/api/standings</a> — Таблица</li>
              <li><a href="/api/leaders?cat=points" style="color:#60a5fa">/api/leaders?cat=points</a> — Лидеры</li>
              <li><a href="/api/search?q=mcdavid" style="color:#60a5fa">/api/search?q=mcdavid</a> — Поиск</li>
            </ul>
          </body>
        </html>
      `);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// 🚀 ЗАПУСК СЕРВЕРА
// ═══════════════════════════════════════════════════════════

app.listen(PORT, async () => {
  console.log('');
  console.log('🏒 ═══════════════════════════════════════════════');
  console.log(`🏒   NHL GM Simulator — Backend Server`);
  console.log(`🏒   http://localhost:${PORT}`);
  console.log('🏒 ═══════════════════════════════════════════════');
  console.log('');
  console.log('📡 API эндпоинты:');
  console.log(`   GET  http://localhost:${PORT}/api/status`);
  console.log(`   GET  http://localhost:${PORT}/api/teams`);
  console.log(`   GET  http://localhost:${PORT}/api/team/:abbrev`);
  console.log(`   GET  http://localhost:${PORT}/api/player/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/standings`);
  console.log(`   GET  http://localhost:${PORT}/api/search?q=...`);
  console.log(`   GET  http://localhost:${PORT}/api/leaders?cat=points`);
  console.log(`   POST http://localhost:${PORT}/api/refresh`);
  console.log('');

  // Предзагрузка данных при старте
  console.log('⏳ Предзагрузка данных...');
  isLoading = true;
  try {
    cache = await loadAllData();
  } catch (err) {
    console.error('❌ Ошибка предзагрузки:', (err as Error).message);
  }
  isLoading = false;

  // Автообновление каждые 6 часов
  setInterval(async () => {
    console.log('\n⏰ Автообновление данных (каждые 6 часов)...');
    if (!isLoading) {
      isLoading = true;
      try {
        cache = await loadAllData();
      } catch (err) {
        console.error('❌ Ошибка автообновления:', (err as Error).message);
      }
      isLoading = false;
    }
  }, CACHE_TTL);
});
