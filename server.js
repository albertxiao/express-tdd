require('dotenv/config')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const zlib = require('zlib')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const consola = require('consola')

const routeProduct = require('./routes/route.product')

/**
 * @description setup global promise for mongoose
 */
mongoose.Promise = global.Promise

/**
 * @description setup database connection
 */
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		poolSize: 10
	})
	.then(() => consola.info('database is connected'))
	.catch(() => consola.info('database is not connected'))

/**
 * @description initialize application
 */
const app = express()
const server = http.createServer(app)

/**
 * @description setup all plugin middleware for app
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(
	compression({
		level: zlib.constants.Z_BEST_COMPRESSION,
		strategy: zlib.constants.Z_RLE
	})
)
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

/**
 * @description init all endpoint route app
 */
app.use('/api/v1', routeProduct)

/**
 * @description listening server
 */
server.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV !== 'production') consola.info(`server is running on port ${server.address().port}`)
})
