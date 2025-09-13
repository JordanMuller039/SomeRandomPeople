import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  HomeIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
}

interface NavItem {
  name: string
  icon: React.ComponentType<any>
  active?: boolean
}

// Mock data for the charts
const mockIndexData = [
  { date: '2024-01', value: 100 },
  { date: '2024-02', value: 105 },
  { date: '2024-03', value: 98 },
  { date: '2024-04', value: 112 },
  { date: '2024-05', value: 108 },
  { date: '2024-06', value: 125 },
  { date: '2024-07', value: 130 },
  { date: '2024-08', value: 118 },
  { date: '2024-09', value: 140 },
]

const timeRanges = ['1M', '1Yr', 'YTD', '3Yr', 'All Time']

const marketCapData = [
  { name: 'Large Cap', value: 65, color: '#0000CD' },
  { name: 'Mid Cap', value: 25, color: '#4169E1' },
  { name: 'Small Cap', value: 10, color: '#87CEEB' },
]

const sectorData = [
  { name: 'Technology', value: 28, color: '#0000CD' },
  { name: 'Healthcare', value: 22, color: '#4169E1' },
  { name: 'Financial', value: 18, color: '#6495ED' },
  { name: 'Energy', value: 15, color: '#87CEEB' },
  { name: 'Others', value: 17, color: '#B0C4DE' },
]

const topPerformers = [
  { name: 'TechCorp', return: 28.5, color: '#0000CD' },
  { name: 'MedLife', return: 22.3, color: '#4169E1' },
  { name: 'GreenEnergy', return: 19.8, color: '#6495ED' },
]

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1Yr')

  const navItems: NavItem[] = [
    { name: 'Home', icon: HomeIcon, active: true },
    { name: 'Experience', icon: ChartBarIcon },
    { name: 'Learn', icon: AcademicCapIcon },
  ]

  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/'
        return
      }
      setUser(user as User)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          window.location.href = '/'
        } else {
          setUser(session.user as User)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const PieChart = ({ data, title }: { data: any[], title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="2"
                className="dark:stroke-gray-600"
              />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = -cumulativePercentage
                cumulativePercentage += percentage
                
                return (
                  <path
                    key={index}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                )
              })}
            </svg>
          </div>
          <div className="ml-6 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const LineChart = () => {
    const maxValue = Math.max(...mockIndexData.map(d => d.value))
    const minValue = Math.min(...mockIndexData.map(d => d.value))
    const range = maxValue - minValue
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">JSE Accumulative Returns</h2>
        <div className="h-64 mb-6">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0000CD" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0000CD" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="#f3f4f6"
                strokeWidth="1"
                className="dark:stroke-gray-600"
              />
            ))}
            
            {/* Line path */}
            <path
              d={`M ${mockIndexData.map((d, i) => 
                `${(i / (mockIndexData.length - 1)) * 400},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')}`}
              fill="none"
              stroke="#0000CD"
              strokeWidth="3"
              className="transition-all duration-500"
            />
            
            {/* Fill area */}
            <path
              d={`M ${mockIndexData.map((d, i) => 
                `${(i / (mockIndexData.length - 1)) * 400},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')} L 400,200 L 0,200 Z`}
              fill="url(#gradient)"
              className="transition-all duration-500"
            />
            
            {/* Data points */}
            {mockIndexData.map((d, i) => (
              <circle
                key={i}
                cx={(i / (mockIndexData.length - 1)) * 400}
                cy={200 - ((d.value - minValue) / range) * 180}
                r="4"
                fill="#0000CD"
                className="transition-all duration-300 hover:r-6"
              />
            ))}
          </svg>
        </div>
        
        {/* Time range buttons */}
        <div className="flex justify-center space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTimeRange === range
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-semibold text-blue-600">Aurora</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Welcome back!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
              Good morning, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your portfolio overview for today
            </p>
          </div>

          {/* Line Chart */}
          <div className="mb-8">
            <LineChart />
          </div>

          {/* Risk Stats Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">Risk Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PieChart data={marketCapData} title="Market Cap Weighting" />
              <PieChart data={sectorData} title="Sector Breakdown" />
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Performers</h3>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: performer.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {performer.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        +{performer.return}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}