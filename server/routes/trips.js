import express from 'express'
import cors from 'cors'
import TripsControllers from '../controllers/trips.js'

const router = express.Router()
router.get('/', TripsControllers.getTrips)
router.get('/:id', TripsControllers.getTrip)
router.post('/', TripsControllers.createTrip)
router.patch('/:id', TripsControllers.updateTrip)
router.delete('/:id', TripsControllers.deleteTrip)

export default router