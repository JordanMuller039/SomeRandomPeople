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
      <div className="pie-chart-container">
        <h3 className="pie-chart-title">{title}</h3>
        <div className="pie-chart-content">
          <div className="pie-chart-svg-container">
            <svg className="pie-chart-svg" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="2"
                className="pie-chart-background"
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
                    className="pie-chart-segment"
                  />
                )
              })}
            </svg>
          </div>
          <div className="pie-chart-legend">
            {data.map((item, index) => (
              <div key={index} className="pie-chart-legend-item">
                <div 
                  className="pie-chart-legend-color" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="pie-chart-legend-text">
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
      <div className="line-chart-container">
        <h2 className="line-chart-title">JSE Accumulative Returns</h2>
        <div className="line-chart-svg-container">
          <svg className="line-chart-svg" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF5630" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF5630" stopOpacity="0.1" />
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
                className="line-chart-grid"
              />
            ))}
            
            {/* Line path */}
            <path
              d={`M ${mockIndexData.map((d, i) => 
                `${(i / (mockIndexData.length - 1)) * 400},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')}`}
              fill="none"
              stroke="#FF5630"
              strokeWidth="3"
              className="line-chart-line"
            />
            
            {/* Fill area */}
            <path
              d={`M ${mockIndexData.map((d, i) => 
                `${(i / (mockIndexData.length - 1)) * 400},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')} L 400,200 L 0,200 Z`}
              fill="url(#gradient)"
              className="line-chart-area"
            />
            
            {/* Data points */}
            {mockIndexData.map((d, i) => (
              <circle
                key={i}
                cx={(i / (mockIndexData.length - 1)) * 400}
                cy={200 - ((d.value - minValue) / range) * 180}
                r="4"
                fill="#FF5630"
                className="line-chart-point"
              />
            ))}
          </svg>
        </div>
        
        {/* Time range buttons */}
        <div className="time-range-buttons">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`time-range-button ${
                selectedTimeRange === range
                  ? 'time-range-button-active'
                  : 'time-range-button-inactive'
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
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="sidebar-inner">
          {/* Header with logo and collapse button */}
          <div className="sidebar-header">
            {!sidebarCollapsed && (
              <h1 className="sidebar-logo">Aurora</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="sidebar-collapse-button"
            >
              {sidebarCollapsed ? <Bars3Icon className="sidebar-icon" /> : <XMarkIcon className="sidebar-icon" />}
            </button>
          </div>

          {/* User Profile */}
          <div className="sidebar-profile">
            <div className="sidebar-profile-content">
              <UserCircleIcon className="sidebar-profile-avatar" />
              {!sidebarCollapsed && (
                <div className="sidebar-profile-info">
                  <p className="sidebar-profile-name">
                    Welcome back!
                  </p>
                  <p className="sidebar-profile-email">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <ul className="sidebar-nav-list">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className={`sidebar-nav-link ${
                      item.active
                        ? 'sidebar-nav-link-active'
                        : 'sidebar-nav-link-inactive'
                    }`}
                  >
                    <item.icon className="sidebar-nav-icon" />
                    {!sidebarCollapsed && <span className="sidebar-nav-text">{item.name}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom actions */}
          <div className="sidebar-actions">
            <button
              onClick={toggleDarkMode}
              className="sidebar-action-button"
            >
              {darkMode ? <SunIcon className="sidebar-action-icon" /> : <MoonIcon className="sidebar-action-icon" />}
              {!sidebarCollapsed && (
                <span className="sidebar-action-text">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="sidebar-signout-button"
            >
              <ArrowRightOnRectangleIcon className="sidebar-action-icon" />
              {!sidebarCollapsed && <span className="sidebar-action-text">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : 'main-content-normal'}`}>
        <div className="main-content-inner">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              Good morning, {user?.email?.split('@')[0]}
            </h1>
            <p className="welcome-subtitle">
              Here's your portfolio overview for today
            </p>
          </div>

          {/* Line Chart */}
          <div className="chart-section">
            <LineChart />
          </div>

          {/* Risk Stats Section */}
          <div className="risk-stats-section">
            <h2 className="risk-stats-title">Risk Stats</h2>
            <div className="risk-stats-grid">
              <PieChart data={marketCapData} title="Market Cap Weighting" />
              <PieChart data={sectorData} title="Sector Breakdown" />
              <div className="top-performers-container">
                <h3 className="top-performers-title">Top Performers</h3>
                <div className="top-performers-list">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="top-performer-item">
                      <div className="top-performer-info">
                        <div 
                          className="top-performer-color" 
                          style={{ backgroundColor: performer.color }}
                        />
                        <span className="top-performer-name">
                          {performer.name}
                        </span>
                      </div>
                      <span className="top-performer-return">
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