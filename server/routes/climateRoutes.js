import express from 'express';
import climateDataController from '../controllers/climateDataController.js';
import geoDataController from '../controllers/geoDataController.js';

const router = express.Router();

// Climate data routes
router.get('/temperature', climateDataController.getTemperatureData);
router.get('/co2', climateDataController.getCO2Data);
router.get('/sea-level', climateDataController.getSeaLevelData);
router.get('/arctic-ice', climateDataController.getArcticIceData);
router.get('/precipitation', climateDataController.getPrecipitationData);
router.get('/region/:region', climateDataController.getRegionalClimateData);
router.get('/stats', climateDataController.getGlobalStats);

// GeoJSON data routes
router.get('/geo/world', geoDataController.getWorldGeoData);
router.get('/geo/region/:region', geoDataController.getRegionGeoData);

module.exports = router;