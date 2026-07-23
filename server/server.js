import express from 'express'
import cors from 'cors'
import tripsRoutes from './routes/trips.js'
import destinationsRoutes from './routes/destinations.js'
import activitiesRoutes from './routes/activities.js'
import tripsDestRoutes from './routes/trips-destinations.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/trips', tripsRoutes)
app.use('/api/destinations', destinationsRoutes)
app.use('/api/activities', activitiesRoutes)
app.use('/api/trips-destinations', tripsDestRoutes)
app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API </h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
