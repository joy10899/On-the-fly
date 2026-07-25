import express from 'express'
import cors from 'cors'
import tripsRoutes from './routes/trips.js'
import destinationsRoutes from './routes/destinations.js'
import activitiesRoutes from './routes/activities.js'
import tripsDestRoutes from './routes/trips-destinations.js'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'
import userTripRoutes from './routes/users-trips.js'

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(session({
    secret: process.env.SESSION_SECRET || 'codepath-development-secret',
    resave: false,
    saveUninitialized: true
}))
app.use(express.json())
app.use(cors({
    origin: CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)
app.use('/auth', authRoutes)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

app.use('/api/trips', tripsRoutes)
app.use('/api/destinations', destinationsRoutes)
app.use('/api/activities', activitiesRoutes)
app.use('/api/trips-destinations', tripsDestRoutes)
app.use('/api/users-trips', userTripRoutes)

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API </h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
