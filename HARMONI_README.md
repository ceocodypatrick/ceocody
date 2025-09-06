# 🎵 HARMONI Music Platform Prototype

A revolutionary music platform that transforms how artists create, distribute, and monetize their music while building deeper connections with fans.

## 🚀 Live Demo

**Frontend Application**: https://3002-ce7feb93-d96d-4154-b9bf-775af3b41c49.h3007.daytona.work  
**Backend API**: https://5001-ce7feb93-d96d-4154-b9bf-775af3b41c49.h3007.daytona.work

## 🎯 Key Features

### For Artists
- **Comprehensive Dashboard**: Real-time analytics and performance metrics
- **Track Management**: Upload, organize, and manage your music catalog
- **Release Management**: Create and schedule releases across platforms
- **Analytics**: Interactive charts showing audience engagement
- **Revenue Tracking**: Monitor earnings across all platforms

### For Listeners
- **Music Discovery**: Advanced recommendation engine
- **Artist Connections**: Direct communication with favorite artists
- **Personalized Experience**: Custom playlists and recommendations
- **Support Artists**: Direct tipping and subscription features

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 15.4.2
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Charts**: Chart.js & react-chartjs-2
- **Icons**: Heroicons & React Icons

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (mock data)
- **File Upload**: Multer
- **CORS**: Cross-origin resource sharing
- **API**: RESTful architecture

## 📁 Project Structure

```
harmoni-prototype/
├── frontend/          # Next.js frontend application
│   ├── components/    # Reusable React components
│   ├── pages/        # Next.js pages
│   ├── utils/        # Utilities and API services
│   └── styles/       # CSS and styling
├── backend/          # Express.js backend API
│   ├── api/routes/   # API endpoints
│   ├── server.js     # Main server file
│   └── uploads/      # File storage
├── docs/            # Documentation files
├── assets/          # Static assets
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ceocodypatrick/ceocody.git
   cd ceocody
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## 📊 Demo Data

The prototype includes realistic mock data:
- **6 tracks** with cover art and audio
- **Multiple genres**: Electronic, Pop, Jazz, Hip Hop
- **Performance metrics**: 45K-124K plays, 987-3,245 likes
- **Professional cover art** from Unsplash

## 🎨 UI Components

### Artist Dashboard
- Performance metrics visualization
- Recent tracks and releases
- Audience demographics charts
- Geographic distribution of listeners
- Revenue tracking

### Track Management
- Upload tracks with metadata
- View detailed track information
- Track performance metrics
- Organize tracks into releases

### Release Management
- Create and schedule releases
- Select tracks for releases
- Add artwork and metadata
- Monitor distribution status

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/:id` - Get specific track
- `POST /api/tracks` - Upload new track
- `PUT /api/tracks/:id` - Update track
- `DELETE /api/tracks/:id` - Delete track

### Releases
- `GET /api/releases` - Get all releases
- `GET /api/releases/:id` - Get specific release
- `POST /api/releases` - Create new release
- `PUT /api/releases/:id` - Update release
- `DELETE /api/releases/:id` - Delete release

### Analytics
- `GET /api/analytics/overview` - Get overview analytics
- `GET /api/analytics/tracks/:id` - Get track analytics
- `GET /api/analytics/releases/:id` - Get release analytics

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run build
npm run start
```

### Backend Testing
```bash
cd backend
npm run dev
```

## 📈 Performance Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Fast Loading**: Optimized images and assets
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Comprehensive error states
- **Loading States**: Smooth user experience

## 🔒 Security

- **JWT Authentication**: Secure user sessions
- **Input Validation**: Server-side validation
- **File Upload Security**: Safe file handling
- **CORS Protection**: Cross-origin security

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

## 📞 Support

For questions or support, please:
- Create an issue in this repository
- Check the documentation in `/docs`
- Review the API documentation at `/api`

## 📄 License

This prototype is for demonstration purposes. Full licensing will be determined upon production release.

## 🎯 Next Steps

1. **Database Integration**: Replace mock data with real database
2. **Payment Processing**: Add Stripe integration
3. **Music Streaming**: Implement audio streaming
4. **Social Features**: Add comments and shares
5. **Mobile App**: Create React Native version

---

**Created with ❤️ for the music community**