# HARMONI Music Platform Prototype

This repository contains the technical prototype for the HARMONI music platform, an integrated ecosystem for music creation, distribution, discovery, and monetization.

## Overview

HARMONI is a revolutionary music platform that connects artists directly with fans, providing tools for music distribution, analytics, fan engagement, and monetization. The platform aims to solve key pain points in the music industry by creating a more transparent, artist-friendly ecosystem.

This prototype demonstrates the core functionality and user experience of the HARMONI platform, focusing on the key user journeys for both artists and fans.

## Project Structure

The project is organized into two main directories:

- `frontend/`: Next.js application for the user interface
- `backend/`: Express.js API for the backend services

### Frontend Structure

- `components/`: Reusable UI components
  - `layout/`: Layout components (MainLayout, Sidebar, Navbar, etc.)
  - `player/`: Music player components
  - `common/`: Common UI components (buttons, cards, etc.)
- `pages/`: Next.js pages
- `styles/`: Global styles and Tailwind configuration
- `utils/`: Utility functions and Redux store

### Backend Structure

- `api/`: API routes and controllers
  - `routes/`: Express routes
  - `controllers/`: Route controllers
  - `models/`: Data models
  - `middleware/`: Express middleware
- `uploads/`: Directory for uploaded files
  - `tracks/`: Uploaded audio files
  - `images/`: Uploaded images
  - `avatars/`: User avatars

## Features

### Artist Experience

- **Dashboard**: Overview of performance metrics, audience insights, and revenue
- **Music Upload & Management**: Upload, organize, and manage music catalog
- **Release Creation & Distribution**: Create and distribute releases to streaming platforms
- **Analytics**: Comprehensive analytics for tracks, audience, and revenue
- **Fan Engagement**: Tools to connect with fans and build a community

### Fan Experience

- **Music Discovery & Playback**: Discover and listen to music with high-quality playback
- **Artist Following**: Follow favorite artists and receive updates
- **Direct Support**: Support artists directly through tips, subscriptions, and purchases
- **Personalized Recommendations**: Receive personalized music recommendations

## Technology Stack

### Frontend

- **Framework**: React with Next.js
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Audio Processing**: Web Audio API with wavesurfer.js
- **UI Components**: Custom components with Heroicons and Framer Motion

### Backend

- **Framework**: Express.js
- **Authentication**: JWT-based authentication
- **File Storage**: Local storage (simulated cloud storage)
- **Database**: MongoDB (simulated with mock data for prototype)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`

## Demo Accounts

For testing purposes, you can use the following demo accounts:

### Artist Account
- Email: james@artist.com
- Password: password123

### Listener Account
- Email: alex@listener.com
- Password: password123

## Prototype Limitations

This prototype focuses on demonstrating the core user experience and has the following limitations:

- Limited catalog of music (pre-loaded samples)
- Simulated distribution to streaming platforms
- Mock analytics data
- Simplified payment flows without actual payment processing
- Limited social features

## Next Steps

Following the prototype development, the next steps will include:

1. User testing and feedback collection
2. Refinement of features based on feedback
3. Development of a more comprehensive MVP
4. Integration with actual third-party services
5. Preparation for beta launch

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For more information about the HARMONI platform, please contact the HARMONI team.