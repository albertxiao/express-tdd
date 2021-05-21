const httpMock = require('node-mocks-http')
const { productCreate, productResults, productResult } = require('../mock-data/fakeData')
const model = require('../../models/model.product')
const { addProduct } = require('../../controllers/addProduct')
const { resultsProduct } = require('../../controllers/resultsProduct')
const { resultProductById } = require('../../controllers/resultProductById')
const { deleteProductById } = require('../../controllers/deleteProduct')
const { updateProduct } = require('../../controllers/updateProduct')

let req, res, next

// create mocking for database
jest.mock('../../models/model.product')

describe('[Unit Testing] - Product Controller', () => {
	beforeEach(() => {
		req = httpMock.createRequest()
		res = httpMock.createResponse()
		next = jest.fn()
	})

	afterEach(() => {
		// clear mock after every each test success/error
		jest.clearAllMocks()
	})

	it('add new product', async (done) => {
		model.create.mockReturnValue(productCreate)
		await addProduct(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'create')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.create(productCreate))

		expect(res._isEndCalled()).toBeTruthy()
		expect(201).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('add new product successfully').toBe(data.message)
		done()
	})

	it('add new product failed', async (done) => {
		model.create.mockReturnValue(null)
		await addProduct(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'create')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.create(null))

		expect(res._isEndCalled()).toBeTruthy()
		expect(403).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('add new product failed').toBe(data.message)
		done()
	})

	it('results product', async (done) => {
		model.find.mockReturnValue(productResults)
		await resultsProduct(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'find')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.find(productResults))

		expect(res._isEndCalled()).toBeTruthy()
		expect(200).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('products already to use').toBe(data.message)
		expect(productResults).toStrictEqual(data.products)
		done()
	})

	it('results products failed', async (done) => {
		model.find.mockReturnValue([])
		await resultsProduct(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'find')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.find([]))

		expect(res._isEndCalled()).toBeTruthy()
		expect(404).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('products is not exist').toBe(data.message)
		done()
	})

	it('result product', async (done) => {
		req.params.id = 3

		model.findOne.mockReturnValue(productResult)
		await resultProductById(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'findOne')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.findOne(productResult))

		expect(res._isEndCalled()).toBeTruthy()
		expect(200).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('product already to use').toBe(data.message)
		expect(productResult).toStrictEqual(data.product)
		done()
	})

	it('result product failed', async (done) => {
		req.params.id = 1

		model.findOne.mockReturnValue(null)
		await resultProductById(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'findOne')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.findOne(null))

		expect(res._isEndCalled()).toBeTruthy()
		expect(404).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('product is not exist').toBe(data.message)
		done()
	})

	it('delete product', async (done) => {
		req.params.id = 1

		model.findByIdAndDelete.mockReturnValue(true)
		await deleteProductById(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'findByIdAndDelete')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.findByIdAndDelete(true))

		expect(res._isEndCalled()).toBeTruthy()
		expect(200).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('delete product successfully').toBe(data.message)
		done()
	})

	it('delete product failed', async (done) => {
		req.params.id = 1

		model.findByIdAndDelete.mockReturnValue(false)
		await deleteProductById(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'findByIdAndDelete')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.findByIdAndDelete(false))

		expect(res._isEndCalled()).toBeTruthy()
		expect(404).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('product is not exist or deleted from owner').toBe(data.message)
		done()
	})

	it('update product', async (done) => {
		req.params.id = 1

		model.findByIdAndUpdate.mockReturnValue(true)
		await updateProduct(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'findByIdAndUpdate')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.findByIdAndUpdate(true))

		expect(res._isEndCalled()).toBeTruthy()
		expect(200).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('update product successfully').toBe(data.message)
		done()
	})

	it('update product failed', async (done) => {
		req.params.id = 1

		model.findByIdAndUpdate.mockReturnValue(false)
		await updateProduct(req, res, next)

		const data = res._getJSONData()
		const mockSpy = jest.spyOn(model, 'findByIdAndUpdate')

		expect(mockSpy).toHaveBeenCalled()
		expect(mockSpy).toHaveBeenCalledTimes(1)
		expect(mockSpy).toHaveBeenCalledWith(model.findByIdAndUpdate(false))

		expect(res._isEndCalled()).toBeTruthy()
		expect(404).toBe(res._getStatusCode())
		expect({ 'content-type': 'application/json' }).toMatchObject(res._getHeaders())
		expect('product is not exist or deleted from owner').toBe(data.message)
		done()
	})
})
