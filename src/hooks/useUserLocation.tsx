
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchLocation = async () => {
      if ('geolocation' in navigator) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                loading: false,
                error: null
              });
            },
            (error) => {
              console.error('Error getting location:', error);
              setLocation({
                latitude: null,
                longitude: null,
                loading: false,
                error: 'Unable to retrieve your location'
              });
              toast.error('Location access denied. Distance calculations will not be accurate.');
            }
          );
        } catch (error) {
          console.error('Error in geolocation:', error);
          setLocation({
            latitude: null,
            longitude: null,
            loading: false,
            error: 'An error occurred while retrieving location'
          });
        }
      } else {
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: 'Geolocation is not supported by your browser'
        });
        toast.error('Geolocation is not supported by your browser. Distance calculations will not be accurate.');
      }
    };

    fetchLocation();
  }, []);

  return location;
};

export default useUserLocation;
