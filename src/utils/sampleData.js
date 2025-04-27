// Sample data for the climate dashboard
// In a real application, this data would come from APIs or a backend

// Global temperature anomaly data (1880-2023)
export const globalTemperatureData = {
  labels: [
    '1880', '1890', '1900', '1910', '1920', '1930', '1940', '1950', 
    '1960', '1970', '1980', '1990', '2000', '2010', '2020', '2023'
  ],
  values: [
    -0.16, -0.27, -0.15, -0.28, -0.21, -0.03, 0.13, -0.02, 
    0.03, 0.01, 0.27, 0.45, 0.61, 0.82, 1.02, 1.18
  ]
};

// CO2 concentration data (1960-2023)
export const co2ConcentrationData = {
  labels: [
    '1960', '1965', '1970', '1975', '1980', '1985', '1990', '1995', 
    '2000', '2005', '2010', '2015', '2020', '2023'
  ],
  values: [
    316.91, 320.04, 325.68, 331.08, 338.68, 346.04, 354.35, 360.80, 
    369.40, 379.80, 389.85, 400.83, 412.44, 420.76
  ]
};

// Sea level rise data (1900-2020)
export const seaLevelRiseData = {
  labels: [
    '1900', '1910', '1920', '1930', '1940', '1950', '1960', '1970', 
    '1980', '1990', '2000', '2010', '2020'
  ],
  values: [
    -120, -110, -100, -80, -60, -40, -20, 0, 
    20, 40, 70, 110, 160
  ]
};

// Arctic sea ice extent data (1979-2023)
export const arcticIceData = {
  labels: [
    '1979', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2023'
  ],
  values: [
    7.05, 6.93, 6.24, 6.13, 6.32, 5.57, 4.90, 4.68, 4.27, 4.23
  ]
};

// Sample GeoJSON data for the world map
// This is a simplified version - in a real app, this would be more detailed
export const worldGeoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Global",
        temperature: 1.1,
        precipitation: 60,
        co2: 420
      },
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "North America",
        temperature: 1.4,
        precipitation: 70,
        co2: 415
      },
      geometry: {
        type: "Point",
        coordinates: [-100, 40]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "South America",
        temperature: 0.9,
        precipitation: 90,
        co2: 410
      },
      geometry: {
        type: "Point",
        coordinates: [-60, -15]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Europe",
        temperature: 1.6,
        precipitation: 65,
        co2: 425
      },
      geometry: {
        type: "Point",
        coordinates: [15, 50]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Africa",
        temperature: 1.2,
        precipitation: 40,
        co2: 405
      },
      geometry: {
        type: "Point",
        coordinates: [20, 0]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Asia",
        temperature: 1.5,
        precipitation: 75,
        co2: 430
      },
      geometry: {
        type: "Point",
        coordinates: [100, 30]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Australia",
        temperature: 1.3,
        precipitation: 30,
        co2: 415
      },
      geometry: {
        type: "Point",
        coordinates: [135, -25]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Antarctica",
        temperature: 2.0,
        precipitation: 10,
        co2: 400
      },
      geometry: {
        type: "Point",
        coordinates: [0, -80]
      }
    }
  ]
};

// Global climate statistics
export const globalStats = {
  temperature: {
    value: 1.1,
    unit: "°C",
    trend: "up"
  },
  co2: {
    value: 420,
    unit: "ppm",
    trend: "up"
  },
  seaLevel: {
    value: 3.6,
    unit: "mm/year",
    trend: "up"
  },
  arcticIce: {
    value: 13.1,
    unit: "%",
    trend: "down"
  }
};