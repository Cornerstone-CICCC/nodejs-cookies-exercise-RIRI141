import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import pageRouter from './routes/page.routes'
import dotenv from 'dotenv'
dotenv.config()


// create a server
const app = express()

// middleware
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../src/views'))
app.use(express.static(path.join(__dirname, 'public'))) // Set public assets directory

//rotes
app.use('/', pageRouter)

// start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}...`)
})