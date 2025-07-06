import { ApiClient, type ApiResponse } from '@/lib/api/client'
import { testUtils } from '@/lib/test-utils'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('ApiClient', () => {
  let apiClient: ApiClient

  beforeEach(() => {
    apiClient = new ApiClient('https://api.example.com')
    jest.clearAllMocks()
  })

  afterEach(() => {
    apiClient.clearCache()
  })

  describe('constructor', () => {
    it('initializes with base URL and default headers', () => {
      const client = new ApiClient('https://test.com', { 'Custom-Header': 'value' })
      expect(client).toBeInstanceOf(ApiClient)
    })
  })

  describe('setDefaultHeaders', () => {
    it('sets default headers correctly', () => {
      apiClient.setDefaultHeaders({ 'Authorization': 'Bearer token' })
      // Headers are private, so we test through a request
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse({ success: true }))
      
      apiClient.get('/test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token'
          })
        })
      )
    })
  })

  describe('setAuthToken', () => {
    it('sets authorization header', () => {
      apiClient.setAuthToken('test-token')
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse({ success: true }))
      
      apiClient.get('/test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      )
    })
  })

  describe('removeAuthToken', () => {
    it('removes authorization header', () => {
      apiClient.setAuthToken('test-token')
      apiClient.removeAuthToken()
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse({ success: true }))
      
      apiClient.get('/test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      )
    })
  })

  describe('GET requests', () => {
    it('makes GET request successfully', async () => {
      const responseData = { message: 'success' }
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse(responseData))

      const result = await apiClient.get('/users')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toBeValidApiResponse()
      expect(result.data).toEqual(responseData)
      expect(result.success).toBe(true)
    })

    it('includes query parameters', async () => {
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse({ success: true }))

      await apiClient.get('/users', { page: 1, limit: 10 })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users?page=1&limit=10',
        expect.any(Object)
      )
    })
  })

  describe('POST requests', () => {
    it('makes POST request with data', async () => {
      const requestData = { name: 'John', email: 'john@example.com' }
      const responseData = { id: 1, ...requestData }
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse(responseData))

      const result = await apiClient.post('/users', requestData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result.data).toEqual(responseData)
    })
  })

  describe('error handling', () => {
    it('handles HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse(
        { error: 'Not found' },
        404,
        false
      ))

      await expect(apiClient.get('/not-found')).rejects.toThrow('HTTP 404')
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.get('/test')).rejects.toThrow('Network error')
    })
  })

  describe('caching', () => {
    it('caches GET requests when enabled', async () => {
      const responseData = { cached: true }
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse(responseData))

      // First request
      const result1 = await apiClient.get('/cached', undefined, { cache: true })
      expect(result1.data).toEqual(responseData)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Second request should use cache
      const result2 = await apiClient.get('/cached', undefined, { cache: true })
      expect(result2.data).toEqual(responseData)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Still only called once
    })

    it('does not cache non-GET requests', async () => {
      mockFetch.mockResolvedValue(testUtils.mockFetchResponse({ success: true }))

      await apiClient.post('/test', {}, { cache: true })
      await apiClient.post('/test', {}, { cache: true })

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('clears cache correctly', async () => {
      mockFetch.mockResolvedValue(testUtils.mockFetchResponse({ cached: true }))

      await apiClient.get('/cached', undefined, { cache: true })
      expect(mockFetch).toHaveBeenCalledTimes(1)

      apiClient.clearCache()

      await apiClient.get('/cached', undefined, { cache: true })
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('retry mechanism', () => {
    it('retries failed requests', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(testUtils.mockFetchResponse({ success: true }))

      const result = await apiClient.get('/retry', undefined, { retry: 2 })

      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(result.success).toBe(true)
    })

    it('fails after max retries', async () => {
      mockFetch.mockRejectedValue(new Error('Persistent error'))

      await expect(
        apiClient.get('/fail', undefined, { retry: 2 })
      ).rejects.toThrow('Persistent error')

      expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('file upload', () => {
    it('uploads files correctly', async () => {
      const file = testUtils.createMockFile('test.txt', 1024, 'text/plain')
      const responseData = { url: 'https://example.com/file.txt' }
      mockFetch.mockResolvedValueOnce(testUtils.mockFetchResponse(responseData))

      const result = await apiClient.upload('/upload', file)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )
      expect(result.data).toEqual(responseData)
    })
  })

  describe('cache statistics', () => {
    it('returns cache statistics', async () => {
      mockFetch.mockResolvedValue(testUtils.mockFetchResponse({ test: true }))

      // Add some cached items
      await apiClient.get('/test1', undefined, { cache: true })
      await apiClient.get('/test2', undefined, { cache: true })

      const stats = apiClient.getCacheStats()
      expect(stats.size).toBe(2)
      expect(stats.keys).toHaveLength(2)
    })
  })
})
