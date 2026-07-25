import { pool } from './database.js'
import 'dotenv/config'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../data/data.json'), 'utf8')
const tripsData = JSON.parse(tripsFile)

const createTripsTable = async () => {
    const createTripsTableQuery = `
        DROP TABLE IF EXISTS trips_users;
        DROP TABLE IF EXISTS users_trips;
        DROP TABLE IF EXISTS trips_destinations;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS destinations;
        DROP TABLE IF EXISTS trips;

        CREATE TABLE trips (
            id serial PRIMARY KEY,
            title varchar(100) NOT NULL,
            description text NOT NULL,
            img_url text NOT NULL,
            num_days integer NOT NULL,
            start_date date NOT NULL,
            end_date date NOT NULL,
            total_cost money NOT NULL
        );
    `

    try {
        const res = await pool.query(createTripsTableQuery)
        console.log('🎉 trips table created successfully')
    }
    catch(error) {
        console.error('error creating trips table:', error)
        throw error
    }
}

const seedTripsTable = async () => {
    await createTripsTable()
    await createDestinationsTable()
    await createActivitiesTable()
    await createTripsDestinationsTable()
    await createUsersTable()
    await createTripsUsersTable()
    await createUsersTripsTable()

    for (const trip of tripsData) {
        const insertQuery = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        }
        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost
        ]

        try {
            await pool.query(insertQuery, values)
            console.log(`✅ ${trip.title} added successfully`)
        }
        catch (err) {
            console.error('error inserting trip', err)
        }
    }
}

const createDestinationsTable = async () => {
    const createDestinationsTableQuery = `
        CREATE TABLE destinations (
            id serial PRIMARY KEY,
            destination varchar(100) NOT NULL,
            description text,
            city varchar(100) NOT NULL,
            country varchar(100) NOT NULL,
            img_url text NOT NULL,
            flag_img_url text  NOT NULL
        );
    `
    try {
        const res = await pool.query(createDestinationsTableQuery)
        console.log('🎉 destinations table created successfully')
    }
    catch(error) {
        console.error('error creating destinations table:', error)
        throw error
    }
}


const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        CREATE TABLE activities (
            id serial PRIMARY KEY,
            trip_id int NOT NULL,
            activity varchar(100) NOT NULL,
            num_votes integer DEFAULT 0,
            FOREIGN KEY (trip_id) REFERENCES trips(id)    
        );
    `
    try {
        const res = await pool.query(createActivitiesTableQuery)
        console.log('🎉 activities table created successfully')
    }
    catch(error) {
        console.error('error creating activities table:', error)
        throw error
    }
}

const createTripsDestinationsTable = async () => {
    const createTripsDestinationsTableQuery = `
        CREATE TABLE trips_destinations (
            trip_id int NOT NULL,
            destination_id int NOT NULL,
            PRIMARY KEY (trip_id, destination_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsDestinationsTableQuery)
        console.log('🎉 trips_destinations table created successfully')
    }
    catch(error) {
        console.error('error creating trips_destinations table:', error)
        throw error
    }
}

const createUsersTable = async () => {
    const createUsersTableQuery = `
        CREATE TABLE users (
            id serial PRIMARY KEY,
            githubid int NOT NULL,
            username varchar(100) NOT NULL,
            avatarurl varchar(500) NOT NULL,
            accesstoken varchar(500) NOT NULL
        );
    `
    try {
        const res = await pool.query(createUsersTableQuery)
        console.log('🎉 users table created successfully')
    }
    catch(error) {
        console.error('error creating users table:', error)
        throw error
    }
}

const createTripsUsersTable = async () => {
    const createTripsUsersTableQuery = `
        CREATE TABLE trips_users (
            trip_id int NOT NULL,
            user_id int NOT NULL,
            PRIMARY KEY (trip_id, user_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsUsersTableQuery)
        console.log('🎉 trips_users table created successfully')
    }
    catch(error) {
        console.error('error creating trips_users table:', error)
        throw error
    }
}

const createUsersTripsTable = async () => {
    const createUsersTripsTableQuery = `
        CREATE TABLE users_trips (
            id serial PRIMARY KEY,
            trip_id int NOT NULL REFERENCES trips(id),
            username text NOT NULL,
            UNIQUE (trip_id, username)
        );
    `
    try {
        const res = await pool.query(createUsersTripsTableQuery)
        console.log('🎉 users_trips table created successfully')
    }
    catch(error) {
        console.error('error creating users_trips table:', error)
        throw error
    }
}

seedTripsTable()
    .catch((error) => {
        console.error('error during database reset:', error)
        process.exitCode = 1
    })
    .finally(() => pool.end())

export { seedTripsTable, createDestinationsTable, createActivitiesTable, createTripsDestinationsTable, createUsersTable, createUsersTripsTable }
