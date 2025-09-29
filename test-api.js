const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing Cricket Insights API...');
    
    // Test health endpoint
    const health = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check:', health.data);
    
    // Test players endpoint
    const players = await axios.get('http://localhost:3001/api/players?limit=5');
    console.log('✅ Players endpoint:', players.data.data.length, 'players loaded');
    
    // Test leaderboard
    const leaderboard = await axios.get('http://localhost:3001/api/leaderboard?format=odi&type=runs&limit=5');
    console.log('✅ Leaderboard:', leaderboard.data.length, 'entries');
    
    // Test analytics
    const analytics = await axios.get('http://localhost:3001/api/analytics/top-boundary-hitters?format=odi&limit=5');
    console.log('✅ Analytics:', analytics.data.length, 'boundary hitters');
    
    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
