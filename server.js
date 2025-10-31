import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Mock data
const regions = [
  { id: 'global', name: 'Global' },
  { id: 'north-america', name: 'North America' },
  { id: 'europe', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'south-america', name: 'South America' },
  { id: 'oceania', name: 'Oceania' }
];

const variables = [
  { id: 'temperature', name: 'Temperature' },
  { id: 'co2', name: 'CO2 Levels' },
  { id: 'sea-level', name: 'Sea Level Rise' },
  { id: 'ice-sheets', name: 'Ice Sheet Mass' },
  { id: 'precipitation', name: 'Precipitation' }
];

// Helper function to generate mock time series data
function generateMockTimeSeriesData(startYear, endYear, increment, baseValue, unit = '°C') {
  const data = [];
  let value = baseValue;

  for (let year = startYear; year <= endYear; year++) {
    // Add some randomness to make the data look more realistic
    const randomFactor = Math.random() * 0.4 - 0.2; // Random value between -0.2 and 0.2
    value += increment + randomFactor;

    data.push({
      year,
      value: parseFloat(value.toFixed(2)),
      unit
    });
  }

  return data;
}

// Generate mock climate data
const climateData = {
  temperature: {
    global: generateMockTimeSeriesData(1950, 2023, 0.01, 0.5),
    'north-america': generateMockTimeSeriesData(1950, 2023, 0.015, 0.6),
    europe: generateMockTimeSeriesData(1950, 2023, 0.02, 0.7),
    asia: generateMockTimeSeriesData(1950, 2023, 0.018, 0.65),
    africa: generateMockTimeSeriesData(1950, 2023, 0.016, 0.55),
    'south-america': generateMockTimeSeriesData(1950, 2023, 0.014, 0.5),
    oceania: generateMockTimeSeriesData(1950, 2023, 0.012, 0.45)
  },
  co2: {
    global: generateMockTimeSeriesData(1950, 2023, 1.5, 315, 'ppm')
  },
  'sea-level': {
    global: generateMockTimeSeriesData(1950, 2023, 0.3, 0, 'mm')
  }
};

// API Routes
app.get('/api/regions', (req, res) => {
  res.json(regions);
});

app.get('/api/variables', (req, res) => {
  res.json(variables);
});

app.get('/api/climate-data', (req, res) => {
  const { region = 'global', variable = 'temperature' } = req.query;

  if (!climateData[variable] || !climateData[variable][region]) {
    return res.status(404).json({ error: 'Data not found for the specified region and variable' });
  }

  res.json(climateData[variable][region]);
});

app.get('/api/time-series', (req, res) => {
  const { region = 'global', variable = 'temperature', startYear = 1950, endYear = 2023 } = req.query;

  if (!climateData[variable] || !climateData[variable][region]) {
    return res.status(404).json({ error: 'Data not found for the specified region and variable' });
  }

  const filteredData = climateData[variable][region].filter(
    item => item.year >= parseInt(startYear) && item.year <= parseInt(endYear)
  );

  res.json(filteredData);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
