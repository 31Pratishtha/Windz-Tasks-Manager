import User from '../models/User.js'
import Task from '../models/Task.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select('-password').lean()
	if (!users?.length) {
		return res.status(400).json({ message: 'No users found' })
	}
	res.json(users)
})

// @desc Create new users
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body

	// Confirm data
	if (!username || !password) {
		return res.status(400).json({ message: 'All fields are required' })
	}

	// Check for duplicate
	const duplicate = await User.findOne({ username })
		.collation({ locale: 'en', strength: 2 })
		.lean()
		.exec()

	if (duplicate) {
		return res.status(409).json({ message: 'Duplicate username' })
	}

	//Hash Password
	const hashedPwd = await bcrypt.hash(password, 10)

	const userObject =
		(!Array.isArray(roles) || !roles.length)
			? { username, password: hashedPwd }
			: { username, password: hashedPwd, roles }

	//Create and store user
	const user = await User.create(userObject)

	if (user) {
		res.status(201).json({ message: `New User ${username} created` })
	} else {
		res.status(400).json({ message: 'Invalid user data received' })
	}
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body

	// Confirm data
	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== 'boolean'
	) {
		return res.status(400).json({ message: 'All fields except password are required' })
	}

	const user = await User.findById(id).exec()

	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}

	//check duplicate
	const duplicate = await User.findOne({ username })
		.collation({ locale: 'en', strength: 2 })
		.lean()
		.exec()

	//allow updates to the original user
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'Duplicate username' })
	}

	user.username = username
	user.roles = roles
	user.active = active

	if (password) {
		//hash password
		user.password = await bcrypt.hash(password, 10)
	}

	const updatedUser = await user.save()

	res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body

	//check id
	if (!id) {
		return res.status(400).json({ message: 'User ID required' })
	}

	//check assigned task
	const task = await Task.findOne({ user: id }).lean().exec()

	if (task) {
		return res.status(400).json({ message: 'User has assigned tasks' })
	}

	//find user
	const user = await User.findById(id).exec()

	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}

	const result = await user.deleteOne()

	if (result.deletedCount === 0) {
		return res.status(400).json({ message: 'User deletion failed' })
	}
	const reply = `Username ${user.username} with ID ${user._id} deleted`

	res.json(reply)
})

export { getAllUsers, createNewUser, updateUser, deleteUser }
