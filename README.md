# 🏏 Cricket Insights

A comprehensive cricket analytics platform built with Next.js, featuring interactive dashboards, player statistics, and advanced visualizations powered by the ICC cricket dataset.

## ✨ Features

- **Player Database**: Comprehensive database of 4,981+ cricket players
- **Interactive Dashboards**: Real-time analytics with 6 unique widgets
- **Advanced Visualizations**: D3.js and Recharts powered charts
- **Player Comparisons**: Side-by-side performance analysis
- **Leaderboards**: Top performers across all formats (Test, ODI, T20)
- **Responsive Design**: Modern UI with dark/light theme support
- **Authentication**: Secure login system with protected routes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts & D3.js** for visualizations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **CSV Parser** for data processing
- **In-memory caching** for performance

### Data Processing
- **ETL Scripts** for data normalization
- **Kaggle ICC Dataset** integration
- **JSON caching** for fast API responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cricket-insights.git
   cd cricket-insights
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Run ETL to process data**
   ```bash
   # From root directory
   node etl/import_kaggle.js
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend (Port 3001)
   cd backend && npm run dev
   
   # Terminal 2 - Frontend (Port 3000)
   cd frontend && npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📊 Data Sources

This application uses the comprehensive ICC cricket dataset from Kaggle, including:
- **Batting Statistics**: Runs, averages, strike rates, centuries, etc.
- **Bowling Statistics**: Wickets, economy rates, averages, etc.
- **Fielding Statistics**: Catches, stumpings, run-outs, etc.
- **Player Information**: Countries, roles, career spans, etc.

## 🎯 Key Pages

- **Home**: Landing page with features overview
- **About**: Platform information and mission
- **Login**: Authentication system
- **Players**: Searchable player database with charts
- **Leaderboards**: Top performers by format and metric
- **Dashboard**: Interactive analytics with 6 unique widgets
- **Profile**: User profile management

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get player details
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/compare` - Compare players
- `GET /api/analytics/dashboard-stats` - Dashboard statistics

## 🎨 UI/UX Features

- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion powered
- **Interactive Charts**: Hover effects and tooltips
- **Modern Design**: Glassmorphism and gradients
- **Accessibility**: WCAG compliant components

## 📱 Screenshots

![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Preview)
![Players](https://via.placeholder.com/800x400?text=Players+Page+Preview)
![Leaderboards](https://via.placeholder.com/800x400?text=Leaderboards+Preview)

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/out`
4. Deploy!

### Vercel
1. Import project from GitHub
2. Set framework preset to Next.js
3. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Kaggle ICC Cricket Dataset](https://www.kaggle.com/datasets/mahendran1/icc-cricket)
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) for data visualization

## 📞 Support

If you have any questions or need help, please open an issue or contact us at [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ for cricket fans and data enthusiasts