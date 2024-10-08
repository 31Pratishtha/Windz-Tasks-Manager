import { logEvents } from './logger.js'

const errorHandler = (err, req, res, next) => {
	logEvents(
		`${err.name}: ${err.message}\t${req.method}\t${req.headers.origin}\t${req.url}`,
		'errLog.log'
	)
	console.log(err.stack)

	const status = res.statusCode ? res.statusCode : 500 //server error
	res.status(status)  

	res.json({ message: err.message, isError: true })
	next()
}

export { errorHandler }
