# Interactive Global Climate Change Dashboard

An interactive web application for visualizing and exploring climate change data from around the world, featuring real-time data from NASA, NOAA, and World Bank APIs.

## Features

- **Interactive Maps**: Visualize climate data across different regions with interactive choropleth maps
- **Time Series Charts**: Explore climate trends over time with dynamic, interactive charts
- **Multiple Climate Indicators**: Analyze temperature, CO2 levels, sea level rise, Arctic ice extent, and precipitation patterns
- **Regional Comparisons**: Compare climate data across different global regions
- **Data Upload**: Contribute your own climate datasets in CSV, JSON, or Excel formats
- **Data Download**: Export visualizations and raw data for further analysis
- **Responsive Design**: Access the dashboard on any device with a fully responsive interface

## Tech Stack

### Frontend
- **React.js**: Component-based UI development
- **Chart.js & react-chartjs-2**: Interactive data visualization
- **Leaflet.js**: Interactive mapping library
- **Axios**: API communication

### Backend
- **Node.js & Express.js**: Server framework
- **MongoDB & Mongoose**: Database for storing climate data
- **Multer**: File upload handling
- **CSV-Parser**: Processing CSV data files

### Data Sources
- **NASA GISTEMP**: Global temperature data
- **NOAA**: Sea level and Arctic ice data
- **World Bank Climate API**: Regional climate data
- **Natural Earth**: GeoJSON data for mapping

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/climate-dashboard.git
   cd climate-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   REACT_APP_API_URL=http://localhost:5000/api
   MONGO_URI=mongodb://localhost:27017/climate-dashboard
   
   # Optional API keys for higher rate limits
   NASA_API_KEY=DEMO_KEY
   NOAA_API_KEY=
   WORLD_BANK_API_KEY=
   ```

### Database Setup

1. Make sure MongoDB is running locally or update the MONGO_URI in your .env file to point to your MongoDB Atlas cluster.

2. Seed the database with initial climate data:
   ```
   npm run seed
   ```
   This will fetch and process climate data from various sources and store it in your MongoDB database.

### Running the Application

1. Start the development server:
   ```
   npm run dev
   ```
   This will start both the React frontend and Node.js backend concurrently.

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

1. Create a production build:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## API Endpoints

The backend provides the following API endpoints:

### Climate Data
- `GET /api/climate/temperature` - Get global or regional temperature data
- `GET /api/climate/co2` - Get CO2 concentration data
- `GET /api/climate/sea-level` - Get sea level rise data
- `GET /api/climate/arctic-ice` - Get Arctic sea ice extent data
- `GET /api/climate/precipitation` - Get precipitation data
- `GET /api/climate/region/:region` - Get all climate indicators for a specific region
- `GET /api/climate/stats` - Get global climate statistics

### GeoJSON Data
- `GET /api/climate/geo/world` - Get world GeoJSON data with climate indicators
- `GET /api/climate/geo/region/:region` - Get GeoJSON data for a specific region

### Data Upload
- `POST /api/uploads/file` - Upload a climate data file
- `GET /api/uploads` - Get all user uploads
- `GET /api/uploads/:id` - Get a specific user upload
- `PUT /api/uploads/:id/approve` - Approve a user upload
- `PUT /api/uploads/:id/reject` - Reject a user upload

## Project Structure

```
climate-dashboard/
├── public/                 # Static files
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── utils/              # Utility functions and data
│   ├── App.js              # Main App component
│   └── index.js            # Entry point
├── server/                 # Node.js backend
│   ├── config/             # Server configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Data fetching services
│   ├── scripts/            # Data seeding scripts
│   ├── uploads/            # User uploaded files
│   ├── temp/               # Temporary files
│   └── index.js            # Server entry point
├── .env                    # Environment variables
└── package.json            # Project dependencies
```

## Data Processing

The application processes climate data from various sources:

1. **Data Fetching**: Services fetch data from NASA, NOAA, and World Bank APIs
2. **Data Cleaning**: Remove duplicates, handle missing values, and standardize formats
3. **Data Transformation**: Convert raw data into a format suitable for visualization
4. **Data Storage**: Store processed data in MongoDB for efficient retrieval
5. **Data Caching**: Cache frequently accessed data to reduce API calls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [NASA Climate Change Data](https://climate.nasa.gov/)
- [NOAA Climate Data](https://www.noaa.gov/climate)
- [World Bank Climate Change Knowledge Portal](https://climateknowledgeportal.worldbank.org/)
- [Natural Earth](https://www.naturalearthdata.com/)
- [Open Climate Data](https://openclimatedata.net/)