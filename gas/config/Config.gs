var CONFIG = {
  SHEETS: {
    USERS:        'Users',
    SESSIONS:     'Sessions',
    CUSTOMERS:    'Customers',
    LEADS:        'Leads',
    ACTIVITIES:   'Activities',
    PRODUCTS:     'Products',
    INVENTORY:    'Inventory',
    TRANSACTIONS: 'Transactions',
    PROJECTS:     'Projects',
    TASKS:        'Tasks',
    EMPLOYEES:    'Employees',
    ATTENDANCE:   'Attendance',
    LEAVE_REQUESTS: 'LeaveRequests',
    SETTINGS:     'Settings',
    STOCK_MOVEMENTS: 'StockMovements',
  },
  SESSION_DURATION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  GROQ_MODEL: 'llama-3.3-70b-versatile',
}

function getGroqApiKey() {
  return PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY')
}
