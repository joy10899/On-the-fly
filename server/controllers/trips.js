import {pool} from '../config/database.js'

const createTrip = async (req,res) => {
    const client = await pool.connect()
    try {
        const {title, description, img_url, num_days, start_date, end_date, total_cost, username} = req.body
        await client.query('BEGIN')
        const results = await client.query(
            'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description, img_url, num_days, start_date, end_date, total_cost]
        )
        const createdTrip = results.rows[0]
        await client.query(
            'INSERT INTO users_trips (trip_id, username) VALUES ($1, $2)',
            [createdTrip.id, username]
        )
        await client.query(
            'INSERT INTO trips_users (trip_id, user_id) SELECT $1, id FROM users WHERE username = $2',
            [createdTrip.id, username]
        )
        await client.query('COMMIT')
        res.status(201).json(createdTrip)
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.status(409).json({message: error.message})
    }
    finally {
        client.release()
    }
}

const getTrips = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM trips')
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getTrip = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query('SELECT * FROM trips WHERE id = $1', [id])
        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({message: error.message})
    }
}

const updateTrip = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const {title, description, img_url, num_days, start_date, end_date, total_cost} = req.body
        console.log('PATCH /api/trips/' + id + ' body:', req.body)
        const results = await pool.query(
            'UPDATE trips SET title = $1, description = $2, img_url = $3, num_days = $4, start_date = $5, end_date = $6, total_cost = $7 WHERE id = $8 RETURNING *',
            [title, description, img_url, num_days, start_date, end_date, total_cost, id]
        )
        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({message: error.message})
    }
}

const deleteTrip = async (req, res) => {
    const id = parseInt(req.params.id)
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query('DELETE FROM activities WHERE trip_id = $1', [id])
        await client.query('DELETE FROM users_trips WHERE trip_id = $1', [id])
        await client.query('DELETE FROM trips_users WHERE trip_id = $1', [id])
        await client.query('DELETE FROM trips_destinations WHERE trip_id = $1', [id])
        await client.query('DELETE FROM trips WHERE id = $1', [id])
        await client.query('COMMIT')
        res.status(200).json({message: `Trip with id ${id} deleted successfully`})
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.status(409).json({message: error.message})
    }
    finally {
        client.release()
    }
}

const TripsControllers = {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip
}

export {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip
}

export default TripsControllers
