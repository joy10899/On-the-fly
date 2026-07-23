import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './TripDetails.css';

const TripDetails = ({ data }) => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([])
  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    if (!data || data.length === 0) {
      setTrip(null);
      return;
    }

    const foundTrip = data.find((item) => item.id === parseInt(id));
    setTrip(foundTrip || null);

    const fetchActivities = async () => {
      const response = await fetch('/api/activities/' + id)
      const activitiesData = await response.json()
      setActivities(activitiesData)
    }

    const fetchDestination = async () => {
      const response = await fetch('/api/trips-destinations/destinations/' + id)
      const destinationsData = await response.json()
      setDestinations(destinationsData)
    }

    fetchActivities()
    fetchDestination()

  }, [data, id]);

  if (!trip) {
    return <h3 className="noResults">Trip not found</h3>;
  }

  return (
    <div className="TripDetails">
      <h2>{trip.title}</h2>
      <p>{trip.description}</p>
      {trip.img_url ? <img src={trip.img_url} alt={trip.title} /> : null}
      <p>Days: {trip.num_days}</p>
      <p>
        Dates: {trip.start_date ? trip.start_date.slice(0, 10) : 'N/A'} to{' '}
        {trip.end_date ? trip.end_date.slice(0, 10) : 'N/A'}
      </p>
      <p>Total Cost: ${trip.total_cost}</p>
    </div>
  );
};

export default TripDetails;
