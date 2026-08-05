import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Static curated dataset of geographic features along major Indian railway routes
const GEOGRAPHIC_FEATURES: Record<string, any[]> = {
  '22436': [
    { type: 'River', name: 'Yamuna River Bridge', distanceKm: 145, description: 'Crossing historic Yamuna River near Mathura' },
    { type: 'River', name: 'Ganga River Railway Bridge', distanceKm: 630, description: 'Major railway bridge over holy River Ganga at Prayagraj' },
    { type: 'Monument', name: 'Kashi Vishwanath Corridor View', distanceKm: 755, description: 'Ancient spiritual heritage city of Varanasi' }
  ],
  '12952': [
    { type: 'Ghat', name: 'Dara Pass & Chambal Valley', distanceKm: 460, description: 'Scenic railway cutting through Chambal gorge in Kota' },
    { type: 'River', name: 'Narmada River Bridge', distanceKm: 990, description: 'Historic 1.4 km long Golden Bridge over River Narmada' },
    { type: 'Bridge', name: 'Vaitarna River Viaduct', distanceKm: 1320, description: 'Major twin bridges over Vaitarna estuarine creeks' }
  ],
  '12002': [
    { type: 'Monument', name: 'Taj Mahal View Corridor', distanceKm: 194, description: 'Railway line passes within 3 km of Taj Mahal' },
    { type: 'Bridge', name: 'Chambal River Bridge', distanceKm: 310, description: 'Dramatic bridge crossing deep Chambal river ravines' },
    { type: 'Ghat', name: 'Bhopal Lake & Vindhya Hills', distanceKm: 700, description: 'Surrounded by Upper Bhopal Lake and Vindhyachal mountain range' }
  ]
};

router.get('/:number', cacheMiddleware(86400), (req, res) => {
  const { number } = req.params;
  const features = GEOGRAPHIC_FEATURES[number] || [
    { type: 'River', name: 'Scenic River Crossing', distanceKm: 120, description: 'Major river valley bridge' },
    { type: 'Ghat', name: 'Mountain Tunnel & Pass', distanceKm: 340, description: 'Railway tunnel through mountain range' }
  ];

  res.json({
    success: true,
    data: features,
    timestamp: new Date().toISOString(),
  });
});

export default router;
