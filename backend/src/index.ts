import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load data
let players: any[] = [];
let playerStats: any[] = [];

function loadData() {
  try {
    const playersPath = path.join(__dirname, '../../data/players.json');
    const statsPath = path.join(__dirname, '../../data/player-stats.json');
    
    if (fs.existsSync(playersPath)) {
      players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    }
    
    if (fs.existsSync(statsPath)) {
      playerStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    }
    
    console.log(`📊 Loaded ${players.length} players and ${playerStats.length} stats`);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Load data on startup
loadData();

// API Routes

// Get all players with filters
app.get('/api/players', (req, res) => {
  const { search, country, role, format, page = 1, limit = 20 } = req.query;
  
  let filteredPlayers = [...players];
  
  // Apply filters
  if (search) {
    filteredPlayers = filteredPlayers.filter(p => 
      p.name.toLowerCase().includes((search as string).toLowerCase())
    );
  }
  
  if (country) {
    filteredPlayers = filteredPlayers.filter(p => p.country === country);
  }
  
  if (role) {
    filteredPlayers = filteredPlayers.filter(p => p.primary_role === role);
  }
  
  // Add stats for each player
  const playersWithStats = filteredPlayers.map(player => {
    const stats = playerStats.filter(stat => stat.player_name === player.name);
    return {
      ...player,
      stats: stats
    };
  });
  
  // Filter by format if specified
  let finalPlayers = playersWithStats;
  if (format) {
    finalPlayers = playersWithStats.filter(player => 
      player.stats.some((stat: any) => stat.format === format)
    );
  }
  
  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedPlayers = finalPlayers.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedPlayers,
    total: finalPlayers.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(finalPlayers.length / Number(limit))
  });
});

// Get single player
app.get('/api/players/:id', (req, res) => {
  const playerId = parseInt(req.params.id);
  const player = players.find(p => p.id === playerId);
  
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  const stats = playerStats.filter(stat => stat.player_name === player.name);
  
  res.json({
    ...player,
    stats: stats
  });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const { format = 'odi', type = 'runs', limit = 50 } = req.query;
  
  let filteredStats = playerStats.filter(stat => stat.format === format);
  
  // Filter out invalid data
  filteredStats = filteredStats.filter(stat => {
    const value = stat[type as string];
    return value && value > 0 && !isNaN(value);
  });
  
  // Sort by the specified type
  filteredStats.sort((a, b) => {
    const aValue = a[type as string] || 0;
    const bValue = b[type as string] || 0;
    return bValue - aValue;
  });
  
  // Take top N
  const topStats = filteredStats.slice(0, Number(limit));
  
  res.json(topStats);
});

// Compare players
app.get('/api/compare', (req, res) => {
  const { players: playerIds, metrics = 'runs,average,strike_rate' } = req.query;
  
  if (!playerIds) {
    return res.status(400).json({ error: 'Player IDs required' });
  }
  
  const ids = (playerIds as string).split(',').map(id => parseInt(id.trim()));
  const selectedPlayers = players.filter(p => ids.includes(p.id));
  
  const comparison = selectedPlayers.map(player => {
    const stats = playerStats.filter(stat => stat.player_name === player.name);
    const formatStats = stats.reduce((acc, stat) => {
      acc[stat.format] = {
        runs: stat.runs,
        average: stat.average,
        strike_rate: stat.strike_rate,
        hundreds: stat.hundreds,
        fifties: stat.fifties,
        wickets: stat.wickets,
        bowling_average: stat.bowling_average,
        matches: stat.matches
      };
      return acc;
    }, {} as any);
    
    return {
      id: player.id,
      name: player.name,
      country: player.country,
      primary_role: player.primary_role,
      stats: formatStats
    };
  });
  
  res.json(comparison);
});

// Get countries
app.get('/api/countries', (req, res) => {
  const countries = [...new Set(players.map(p => p.country))].sort();
  res.json(countries);
});

// Get roles
app.get('/api/roles', (req, res) => {
  const roles = [...new Set(players.map(p => p.primary_role))].sort();
  res.json(roles);
});

// Get formats
app.get('/api/formats', (req, res) => {
  res.json(['test', 'odi', 't20']);
});

// Analytics endpoints

// Era distribution
app.get('/api/analytics/era-distribution', (req, res) => {
  const { format = 'odi', metric = 'average' } = req.query;
  
  const filteredStats = playerStats.filter(stat => 
    stat.format === format && 
    stat[metric as string] && 
    stat[metric as string] > 0
  );
  
  // Group by decade
  const distribution: any = {};
  
  filteredStats.forEach(stat => {
    if (stat.span_start) {
      const decade = Math.floor(stat.span_start / 10) * 10;
      const decadeKey = `${decade}s`;
      
      if (!distribution[decadeKey]) {
        distribution[decadeKey] = [];
      }
      
      distribution[decadeKey].push(stat[metric as string]);
    }
  });
  
  // Calculate statistics for each decade
  const result = Object.entries(distribution).map(([decade, values]: [string, any]) => {
    const sorted = values.sort((a: number, b: number) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    
    return {
      decade,
      min: sorted[0],
      q1,
      median,
      q3,
      max: sorted[sorted.length - 1],
      mean: values.reduce((sum: number, val: number) => sum + val, 0) / values.length,
      count: values.length
    };
  });
  
  res.json(result);
});

// Country contribution
app.get('/api/analytics/country-contribution', (req, res) => {
  const { format = 'odi' } = req.query;
  
  const filteredStats = playerStats.filter(stat => stat.format === format);
  
  const countryStats: any = {};
  
  filteredStats.forEach(stat => {
    const country = stat.player_country;
    if (!countryStats[country]) {
      countryStats[country] = {
        country,
        player_count: 0,
        total_runs: 0,
        total_wickets: 0,
        avg_batting_avg: 0,
        avg_bowling_avg: 0
      };
    }
    
    countryStats[country].player_count++;
    countryStats[country].total_runs += stat.runs || 0;
    countryStats[country].total_wickets += stat.wickets || 0;
  });
  
  // Calculate averages
  Object.values(countryStats).forEach((country: any) => {
    const countryStatsList = filteredStats.filter(stat => stat.player_country === country.country);
    const battingAvgs = countryStatsList.filter(stat => stat.average > 0).map(stat => stat.average);
    const bowlingAvgs = countryStatsList.filter(stat => stat.bowling_average > 0).map(stat => stat.bowling_average);
    
    country.avg_batting_avg = battingAvgs.length > 0 ? 
      battingAvgs.reduce((sum, avg) => sum + avg, 0) / battingAvgs.length : 0;
    country.avg_bowling_avg = bowlingAvgs.length > 0 ? 
      bowlingAvgs.reduce((sum, avg) => sum + avg, 0) / bowlingAvgs.length : 0;
  });
  
  const result = Object.values(countryStats).sort((a: any, b: any) => b.total_runs - a.total_runs);
  
  res.json(result);
});

// Top boundary hitters
app.get('/api/analytics/top-boundary-hitters', (req, res) => {
  const { format = 'odi', limit = 20 } = req.query;
  
  const filteredStats = playerStats.filter(stat => 
    stat.format === format && 
    (stat.fours > 0 || stat.sixes > 0)
  );
  
  const boundaryStats = filteredStats.map(stat => ({
    name: stat.player_name,
    country: stat.player_country,
    fours: stat.fours,
    sixes: stat.sixes,
    total_boundaries: stat.fours + stat.sixes,
    runs: stat.runs,
    matches: stat.matches
  }));
  
  boundaryStats.sort((a, b) => b.total_boundaries - a.total_boundaries);
  
  res.json(boundaryStats.slice(0, Number(limit)));
});

// Strike rate vs average
app.get('/api/analytics/strike-rate-vs-average', (req, res) => {
  const { format = 'odi', minRuns = 1000 } = req.query;
  
  const filteredStats = playerStats.filter(stat => 
    stat.format === format && 
    stat.runs >= Number(minRuns) &&
    stat.average > 0 &&
    stat.strike_rate > 0
  );
  
  const result = filteredStats.map(stat => ({
    name: stat.player_name,
    country: stat.player_country,
    average: stat.average,
    strike_rate: stat.strike_rate,
    runs: stat.runs,
    matches: stat.matches
  }));
  
  res.json(result);
});

// Dashboard analytics
app.get('/api/analytics/dashboard-stats', (req, res) => {
  const { format = 'odi' } = req.query;
  
  const filteredStats = playerStats.filter(stat => stat.format === format);
  
  // Calculate various statistics
  const totalRuns = filteredStats.reduce((sum, stat) => sum + (stat.runs || 0), 0);
  const totalWickets = filteredStats.reduce((sum, stat) => sum + (stat.wickets || 0), 0);
  const totalMatches = filteredStats.reduce((sum, stat) => sum + (stat.matches || 0), 0);
  const totalCenturies = filteredStats.reduce((sum, stat) => sum + (stat.hundreds || 0), 0);
  const totalFifties = filteredStats.reduce((sum, stat) => sum + (stat.fifties || 0), 0);
  
  // Top performers
  const topRunScorers = filteredStats
    .filter(stat => stat.runs > 0)
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 5);
    
  const topWicketTakers = filteredStats
    .filter(stat => stat.wickets > 0)
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, 5);
    
  const topAverages = filteredStats
    .filter(stat => stat.average > 0 && stat.runs > 1000)
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);
  
  // Country distribution
  const countryStats: any = {};
  filteredStats.forEach(stat => {
    const country = stat.player_country;
    if (!countryStats[country]) {
      countryStats[country] = {
        country,
        players: new Set(),
        totalRuns: 0,
        totalWickets: 0
      };
    }
    countryStats[country].players.add(stat.player_name);
    countryStats[country].totalRuns += stat.runs || 0;
    countryStats[country].totalWickets += stat.wickets || 0;
  });
  
  const topCountries = Object.values(countryStats)
    .map((data: any) => ({
      country: data.country,
      playerCount: data.players.size,
      totalRuns: data.totalRuns,
      totalWickets: data.totalWickets
    }))
    .sort((a: any, b: any) => b.totalRuns - a.totalRuns)
    .slice(0, 10);
  
  res.json({
    summary: {
      totalPlayers: players.length,
      totalStats: playerStats.length,
      totalRuns,
      totalWickets,
      totalMatches,
      totalCenturies,
      totalFifties
    },
    topRunScorers,
    topWicketTakers,
    topAverages,
    topCountries
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    players: players.length, 
    stats: playerStats.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cricket Insights API running on port ${PORT}`);
  console.log(`📊 Loaded ${players.length} players and ${playerStats.length} stats`);
});
