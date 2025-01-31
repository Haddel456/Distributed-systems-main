const express = require('express')
require('./db/mongoose')
const memberRouter = require('./routers/members')
const projectRouter = require('./routers/projects')

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(memberRouter)
app.use(projectRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})