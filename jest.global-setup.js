// Jest global setup
module.exports = async () => {
  // Set timezone for consistent date testing
  process.env.TZ = 'UTC'
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000/api'
  
  console.log('🧪 Jest global setup completed')
}
