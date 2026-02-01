export const generateRandomLocation = () => {
  const locations = [
    { lat: 48.8584, lng: 2.2945 }, { lat: 40.7128, lng: -74.0060 }, { lat: 35.6762, lng: 139.6503 },
    { lat: 51.5074, lng: -0.1278 }, { lat: -33.8688, lng: 151.2093 }, { lat: 41.8902, lng: 12.4922 },
    { lat: 55.7558, lng: 37.6173 }, { lat: -23.5505, lng: -46.6333 }, { lat: 19.4326, lng: -99.1332 },
    { lat: 1.3521, lng: 103.8198 }, { lat: 34.0522, lng: -118.2437 }, { lat: 52.5200, lng: 13.4050 },
    { lat: 43.6532, lng: -79.3832 }, { lat: -34.6037, lng: -58.3816 }, { lat: 25.2048, lng: 55.2708 },
    { lat: 31.2304, lng: 121.4737 }, { lat: 28.6139, lng: 77.2090 }, { lat: 59.3293, lng: 18.0686 },
    { lat: 45.4215, lng: -75.6972 }, { lat: 52.3676, lng: 4.9041 }, { lat: -37.8136, lng: 144.9631 },
    { lat: 37.5665, lng: 126.9780 }, { lat: -33.9249, lng: 18.4241 }, { lat: 40.4168, lng: -3.7038 },
    { lat: 60.1695, lng: 24.9458 }, { lat: 41.3851, lng: 2.1734 }, { lat: 50.0755, lng: 14.4378 },
    { lat: 41.0082, lng: 28.9784 }, { lat: 53.3498, lng: -6.2603 }, { lat: -26.2041, lng: 28.0473 },
    { lat: 13.7563, lng: 100.5018 }, { lat: 22.3193, lng: 114.1694 }, { lat: 39.9042, lng: 116.4074 },
    { lat: 3.1390, lng: 101.6869 }, { lat: 34.6937, lng: 135.5023 }, { lat: 48.2082, lng: 16.3738 },
    { lat: 45.5017, lng: -73.5673 }, { lat: 38.7223, lng: -9.1393 }, { lat: 50.8503, lng: 4.3517 },
    { lat: 37.9838, lng: 23.7275 }, { lat: 59.9139, lng: 10.7522 }, { lat: 55.6761, lng: 12.5683 },
    { lat: 47.3769, lng: 8.5417 }, { lat: 45.4642, lng: 9.1900 }, { lat: 52.2297, lng: 21.0122 },
    { lat: 32.7157, lng: -117.1611 }, { lat: 21.3069, lng: -157.8583 }, { lat: -12.0464, lng: -77.0428 },
    { lat: 33.4484, lng: -112.0740 }, { lat: 39.7392, lng: -104.9903 }, { lat: 25.7617, lng: -80.1918 },
    { lat: 36.1699, lng: -115.1398 }, { lat: 47.6062, lng: -122.3321 }, { lat: -33.4489, lng: -70.6693 },
    { lat: 4.7110, lng: -74.0721 }, { lat: 14.5995, lng: 120.9842 }, { lat: 32.0853, lng: 34.7818 },
    { lat: 33.8688, lng: 151.2093 }, { lat: 37.7749, lng: -122.4194 }, { lat: 51.2217, lng: 6.7762 },
    { lat: 44.4268, lng: 26.1025 }, { lat: 42.6977, lng: 23.3219 }, { lat: 46.0569, lng: 14.5058 },
    { lat: 44.8125, lng: 20.4612 }, { lat: 41.9981, lng: 21.4254 }, { lat: 42.4304, lng: 19.2594 },
    { lat: 41.3275, lng: 19.8187 }, { lat: 54.6872, lng: 25.2797 }, { lat: 56.9496, lng: 24.1052 },
    { lat: 59.4370, lng: 24.7535 }, { lat: 47.4979, lng: 19.0402 }, { lat: 50.4501, lng: 30.5234 },
    { lat: 44.7866, lng: 20.4489 }, { lat: 43.8563, lng: 18.4131 }, { lat: 42.6629, lng: 21.1655 },
    { lat: 10.7627, lng: 106.6602 }, { lat: 21.0285, lng: 105.8542 }, { lat: 16.8409, lng: 96.1735 },
    { lat: 6.9271, lng: 79.8612 }, { lat: 1.2903, lng: 103.8519 }, { lat: 22.3964, lng: 114.1095 },
    { lat: 34.3333, lng: 108.9000 }, { lat: 23.1291, lng: 113.2644 }, { lat: 30.5728, lng: 104.0668 },
    { lat: 39.9042, lng: 116.4074 }, { lat: 34.0522, lng: -118.2437 }, { lat: 36.1627, lng: -86.7816 }
  ]
  return locations[Math.floor(Math.random() * locations.length)]
}

export const calculateDistance = (loc1, loc2) => {
  const r = 6371
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(r * c)
}

export const calculateScore = (distance) => {
  return Math.max(0, 5000 - Math.round(distance * 2))
}
