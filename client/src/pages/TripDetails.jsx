import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import './TripDetails.css';

const TripDetails = ({ data, api_url }) => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([])
  const [destinations, setDestinations] = useState([])
  const [travelers, setTravelers] = useState([])

  useEffect(() => {
    if (!data || data.length === 0) {
      setTrip(null);
      return;
    }

    const fetchTravelers = async () => {
      const response = await fetch(`${api_url}/api/users-trips/users/${id}`)
      const travelersJson = await response.json()
      setTravelers(travelersJson)
    }

    const foundTrip = data.find((item) => item.id === parseInt(id));
    setTrip(foundTrip || null);

    const fetchActivities = async () => {
      const response = await fetch(`${api_url}/api/activities/${id}`)
      const activitiesData = await response.json()
      setActivities(activitiesData)
    }

    const fetchDestination = async () => {
      const response = await fetch(`${api_url}/api/trips-destinations/destinations/${id}`)
      const destinationsData = await response.json()
      setDestinations(destinationsData)
    }

    fetchTravelers()
    fetchActivities()
    fetchDestination()

  }, [data, id, api_url]);

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

      <div>
        <h3>Destinations</h3>
        {destinations.map((destination) => (
          <p key={destination.id}>{destination.destination}</p>
        ))}
        <Link to={`/destination/new/${id}`}>+ Add Destination</Link>
      </div>

      <div>
        <h3>Activities</h3>
        {activities.map((activity) => (
          <p key={activity.id}>{activity.activity}</p>
        ))}
        <Link to={`/activity/create/${id}`}>+ Add Activity</Link>
      </div>

      <div className='travelers'>
        {
            travelers && travelers.length > 0 ?
            travelers.map((traveler, index) =>
                <p key={index} style={{ textAlign: 'center', lineHeight: 0, paddingTop: 20 }}>
                    {traveler.username}
                </p>
            ) : ''
        }

        <br/>
        <Link to={'/users/add/' + id }><button className='addActivityBtn'>+ Add Traveler</button></Link>
    </div>
    </div>

  );
};

export default TripDetails;
