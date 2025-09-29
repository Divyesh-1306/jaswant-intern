const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Data storage
let players = new Map();
let playerStats = [];

// Helper function to extract player name and country
function parsePlayer(playerString) {
  const match = playerString.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) {
    return {
      name: match[1].trim(),
      country: match[2].trim()
    };
  }
  return {
    name: playerString.trim(),
    country: 'Unknown'
  };
}

// Helper function to parse span
function parseSpan(spanString) {
  if (!spanString) return { start: null, end: null };
  const parts = spanString.split('-');
  return {
    start: parts[0] ? parseInt(parts[0]) : null,
    end: parts[1] ? parseInt(parts[1]) : null
  };
}

// Process batting data
async function processBattingData() {
  const formats = ['ODI data', 't20', 'test'];
  
  for (const format of formats) {
    const filePath = path.join(__dirname, '../cricket data/Batting', `${format}.csv`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }

    console.log(`Processing ${format} batting data...`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const { name, country } = parsePlayer(row.Player);
          const span = parseSpan(row.Span);
          
          // Create player if not exists
          if (!players.has(name)) {
            players.set(name, {
              id: players.size + 1,
              name,
              country,
              primary_role: 'batsman'
            });
          }
          
          const player = players.get(name);
          
          // Add batting stats
          playerStats.push({
            player_id: player.id,
            player_name: name,
            player_country: country,
            format: format.toLowerCase().replace(' data', ''),
            span_start: span.start,
            span_end: span.end,
            matches: parseInt(row.Mat) || 0,
            innings: parseInt(row.Inns) || 0,
            not_out: parseInt(row.NO) || 0,
            runs: parseInt(row.Runs) || 0,
            highest: row.HS || '',
            average: parseFloat(row.Ave) || 0,
            balls_faced: parseInt(row.BF) || 0,
            strike_rate: parseFloat(row.SR) || 0,
            hundreds: parseInt(row['100']) || 0,
            fifties: parseInt(row['50']) || 0,
            fours: parseInt(row['4s']) || 0,
            sixes: parseInt(row['6s']) || 0,
            catches: 0,
            stumpings: 0,
            wickets: 0,
            bowling_average: 0,
            bowling_economy: 0,
            bowling_strike_rate: 0
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }
}

// Process bowling data
async function processBowlingData() {
  const formats = ['Bowling_ODI', 'Bowling_t20', 'Bowling_test'];
  
  for (const format of formats) {
    const filePath = path.join(__dirname, '../cricket data/Bowling', `${format}.csv`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }

    console.log(`Processing ${format} bowling data...`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const { name, country } = parsePlayer(row.Player);
          const span = parseSpan(row.Span);
          
          // Create player if not exists
          if (!players.has(name)) {
            players.set(name, {
              id: players.size + 1,
              name,
              country,
              primary_role: 'bowler'
            });
          }
          
          const player = players.get(name);
          
          // Find existing stats or create new
          let existingStats = playerStats.find(stat => 
            stat.player_name === name && 
            stat.format === format.toLowerCase().replace('bowling_', '')
          );
          
          if (existingStats) {
            // Update existing stats
            existingStats.wickets = parseInt(row.Wkts) || 0;
            existingStats.bowling_average = parseFloat(row.Ave) || 0;
            existingStats.bowling_economy = parseFloat(row.Econ) || 0;
            existingStats.bowling_strike_rate = parseFloat(row.SR) || 0;
            existingStats.best_bowling = row.BBI || '';
            existingStats.five_wickets = parseInt(row['5']) || 0;
            existingStats.ten_wickets = parseInt(row['10']) || 0;
          } else {
            // Create new stats entry
            playerStats.push({
              player_id: player.id,
              player_name: name,
              player_country: country,
              format: format.toLowerCase().replace('bowling_', ''),
              span_start: span.start,
              span_end: span.end,
              matches: parseInt(row.Mat) || 0,
              innings: parseInt(row.Inns) || 0,
              not_out: 0,
              runs: 0,
              highest: '',
              average: 0,
              balls_faced: 0,
              strike_rate: 0,
              hundreds: 0,
              fifties: 0,
              fours: 0,
              sixes: 0,
              catches: 0,
              stumpings: 0,
              wickets: parseInt(row.Wkts) || 0,
              bowling_average: parseFloat(row.Ave) || 0,
              bowling_economy: parseFloat(row.Econ) || 0,
              bowling_strike_rate: parseFloat(row.SR) || 0,
              best_bowling: row.BBI || '',
              five_wickets: parseInt(row['5']) || 0,
              ten_wickets: parseInt(row['10']) || 0
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }
}

// Process fielding data
async function processFieldingData() {
  const formats = ['Fielding_ODI', 'Fielding_t20', 'Fielding_test'];
  
  for (const format of formats) {
    const filePath = path.join(__dirname, '../cricket data/Fielding', `${format}.csv`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }

    console.log(`Processing ${format} fielding data...`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const { name, country } = parsePlayer(row.Player);
          
          // Find existing stats
          let existingStats = playerStats.find(stat => 
            stat.player_name === name && 
            stat.format === format.toLowerCase().replace('fielding_', '')
          );
          
          if (existingStats) {
            // Update existing stats
            existingStats.catches = parseInt(row.Ct) || 0;
            existingStats.stumpings = parseInt(row.St) || 0;
          } else {
            // Create new stats entry if no existing stats
            const player = players.get(name) || {
              id: players.size + 1,
              name,
              country,
              primary_role: 'wicket-keeper'
            };
            
            if (!players.has(name)) {
              players.set(name, player);
            }
            
            playerStats.push({
              player_id: player.id,
              player_name: name,
              player_country: country,
              format: format.toLowerCase().replace('fielding_', ''),
              span_start: null,
              span_end: null,
              matches: parseInt(row.Mat) || 0,
              innings: parseInt(row.Inns) || 0,
              not_out: 0,
              runs: 0,
              highest: '',
              average: 0,
              balls_faced: 0,
              strike_rate: 0,
              hundreds: 0,
              fifties: 0,
              fours: 0,
              sixes: 0,
              catches: parseInt(row.Ct) || 0,
              stumpings: parseInt(row.St) || 0,
              wickets: 0,
              bowling_average: 0,
              bowling_economy: 0,
              bowling_strike_rate: 0,
              best_bowling: '',
              five_wickets: 0,
              ten_wickets: 0
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }
}

// Main ETL function
async function runETL() {
  console.log('🏏 Starting Cricket Data ETL...');
  
  try {
    await processBattingData();
    await processBowlingData();
    await processFieldingData();
    
    // Update player roles based on stats
    players.forEach(player => {
      const playerStatsList = playerStats.filter(stat => stat.player_name === player.name);
      const hasBowling = playerStatsList.some(stat => stat.wickets > 0);
      const hasBatting = playerStatsList.some(stat => stat.runs > 1000);
      const hasFielding = playerStatsList.some(stat => stat.stumpings > 0);
      
      if (hasBowling && hasBatting) {
        player.primary_role = 'all-rounder';
      } else if (hasBowling) {
        player.primary_role = 'bowler';
      } else if (hasFielding) {
        player.primary_role = 'wicket-keeper';
      } else {
        player.primary_role = 'batsman';
      }
    });
    
    // Convert players map to array
    const playersArray = Array.from(players.values());
    
    // Save processed data
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'players.json'),
      JSON.stringify(playersArray, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'player-stats.json'),
      JSON.stringify(playerStats, null, 2)
    );
    
    console.log(`✅ ETL Complete!`);
    console.log(`📊 Processed ${playersArray.length} players`);
    console.log(`📈 Processed ${playerStats.length} stat records`);
    console.log(`💾 Data saved to /data/players.json and /data/player-stats.json`);
    
  } catch (error) {
    console.error('❌ ETL Error:', error);
  }
}

// Run ETL if called directly
if (require.main === module) {
  runETL();
}

module.exports = { runETL, players, playerStats };
