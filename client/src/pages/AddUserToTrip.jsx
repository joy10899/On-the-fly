import { useState } from 'react'
import { useParams } from 'react-router-dom'
import './CreateActivity.css'


const AddUserToTrip = ( { api_url } ) => {
    const [username, setUsername] = useState({username: ''})
    const { trip_id } = useParams()

    const handleChange = (event) => {
        const {name, value} = event.target
        setUsername((prev) => {
            return {
                ...prev,
                [name]:value
            }
        })
    }

    const addUserToTrip = async (event) => {
        event.preventDefault()

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(username)
        }

        const response = await fetch(`${api_url}/api/users-trips/create/${trip_id}`, options)
        if (!response.ok) {
            throw new Error('Unable to add traveler')
        }
        window.location = '/'
    }

    return (
        <div>
            <center><h3>Add User to Trip</h3></center>
            <form onSubmit={addUserToTrip}>
                <label>Enter GitHub Username:</label><br />
                <input 
                    type='text' 
                    id='username' 
                    name='username' 
                    value={username.username}
                    onChange={handleChange}
                /><br />

                <label htmlFor='trip_id'>Trip ID</label><br />
                <input 
                    type='number' 
                    id='trip_id' 
                    name='trip_id' 
                    value={trip_id} 
                    readOnly 
                /><br />

                <input type='submit' value='Submit' />
            </form>
        </div>
    )
}

export default AddUserToTrip
