# 🎵 Quantum Radio

> **AI-Powered Music Streaming Platform**
> 
> Experience the future of music with our cutting-edge AI-generated track collection featuring 965+ tracks from 367 channels with over 529M total views.

![Quantum Radio](https://img.shields.io/badge/Quantum-Radio-gold?style=for-the-badge&logo=music&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-green?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal?style=for-the-badge&logo=fastapi)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Quantum Brand Theme** with radiant gold, neon blue, and electric accents
- **Mobile-First Design** with responsive 2-column grid on mobile
- **Onboarding Splash Screen** with animated progress and particle effects
- **50% Larger Logo** for enhanced brand visibility
- **Glass Morphism Effects** with modern gradients and blur effects

### 🎵 **Music Platform**
- **965+ AI-Generated Tracks** from APIFY data collection
- **367 Unique Channels** with diverse music styles
- **Advanced Filtering** by channel, hashtags, views, likes, and date
- **Smart Search** across titles, channels, and descriptions
- **Multiple View Modes** (Grid/List) with mobile optimization
- **Audio Player Integration** with YouTube playback

### 🔧 **Technical Features**
- **Real-Time File Watching** for automatic JSON data updates
- **Dynamic Statistics** with live track counts and metrics
- **Mobile-Optimized Cards** with compact layouts
- **Responsive Design** across all device sizes
- **Error Handling** with graceful fallbacks
- **Performance Optimized** with efficient animations

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.11+
- **Git**

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/QuantumClimb/QuantumRadio.git
cd QuantumRadio
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

#### **Option 1: Using PowerShell Script (Windows)**
```powershell
.\start-backend.ps1
```

#### **Option 2: Manual Start**

**Backend (Terminal 1):**
```bash
cd backend
python main.py
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### 📱 **Access Points**
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🏗️ Architecture

### **Frontend Stack**
- **React 18.3** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** components
- **Zustand** for state management
- **React Router** for navigation

### **Backend Stack**
- **FastAPI** for REST API
- **Python 3.11** with async support
- **Watchdog** for file monitoring
- **CORS** enabled for frontend communication

### **Data Management**
- **APIFY Integration** for music data collection
- **JSON File Storage** with real-time updates
- **File Watcher** for automatic data reload
- **Statistics Engine** for metrics calculation

## 📂 Project Structure

```
quantum-radio/
├── frontend/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── OnboardingSplash.tsx
│   │   │   ├── QuantumLogo.tsx
│   │   │   ├── TrackCard.tsx
│   │   │   └── AudioPlayer.tsx
│   │   ├── pages/           # Route components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS and themes
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # FastAPI Python Backend
│   ├── main.py             # FastAPI application
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   │   ├── apify_data_service.py
│   │   └── audio_downloader.py
│   └── requirements.txt
├── AI_Setlist.json         # Music data (965 tracks)
├── start-backend.ps1       # PowerShell startup script
└── README.md
```

## 🎨 Brand Theme

### **Color Palette**
- **Radiant Gold**: `#F4B843` (Primary brand color)
- **Neon Sky Blue**: `#2DB6FF` (Secondary accent)
- **Electric Blue Glow**: `#00CFFF` (Highlights)
- **Midnight Navy**: `#0C0F1E` (Dark backgrounds)
- **Bronze Shadow**: `#924C14` (Depth effects)

### **Design Principles**
- **Quantum Aesthetics** with glow effects and particles
- **Modern Glass Morphism** with backdrop blur
- **Responsive Mobile-First** approach
- **Accessible UI** with proper contrast ratios

## 📱 Mobile Experience

### **2-Column Grid Layout**
- **Mobile (≤768px)**: 2 columns with 12px gaps
- **Small Mobile (≤480px)**: Tighter 2-column grid
- **Tablet (481-768px)**: 3-column layout
- **Desktop (≥769px)**: 4-column responsive grid

### **Optimized Features**
- **Compact Cards** with essential information only
- **Touch-Friendly** buttons and interactions
- **Hidden Elements** on mobile for cleaner design
- **Faster Loading** with optimized assets

## 🔧 API Endpoints

### **Tracks**
- `GET /api/tracks` - Get all tracks with filtering
- `GET /api/tracks/stats` - Get track statistics
- `GET /api/tracks/watcher/status` - File watcher status
- `POST /api/tracks/reload` - Manual data reload

### **Channels**
- `GET /api/channels` - Get all unique channels
- `GET /api/channels/{channel_name}` - Get tracks by channel

## 🎯 Key Features Implemented

### ✅ **Completed Features**
- [x] **Onboarding Splash Screen** with particles and animations
- [x] **Mobile 2-Column Grid** with responsive design
- [x] **50% Larger Logo** across all screen sizes
- [x] **File Watcher System** for real-time data updates
- [x] **Dynamic Statistics** with live metrics
- [x] **Brand Theme Implementation** with quantum colors
- [x] **Mobile-Optimized Cards** with compact layouts
- [x] **Audio Player Integration** with YouTube support
- [x] **Advanced Filtering** and search capabilities

### 🚧 **Future Enhancements**
- [ ] User authentication and playlists
- [ ] AI-powered music recommendations
- [ ] Social features and sharing
- [ ] Offline mode and downloads
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**QuantumClimb**
- Email: qc@quantum-climb.com
- GitHub: [@QuantumClimb](https://github.com/QuantumClimb)
- Project: [QuantumRadio](https://github.com/QuantumClimb/QuantumRadio)

## 🙏 Acknowledgments

- **APIFY** for music data collection
- **React & FastAPI** communities
- **Radix UI** for accessible components
- **Tailwind CSS** for styling framework

---

<div align="center">

**🎵 Built with ❤️ for the future of AI music 🎵**

[⭐ Star this repository](https://github.com/QuantumClimb/QuantumRadio) | [🐛 Report Bug](https://github.com/QuantumClimb/QuantumRadio/issues) | [💡 Request Feature](https://github.com/QuantumClimb/QuantumRadio/issues)

</div> 