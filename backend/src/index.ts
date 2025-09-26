import 'dotenv/config'
import express from 'express'
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'
const app = express()
const PORT = 3000
app.use(cors())
app.use(clerkMiddleware())

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})