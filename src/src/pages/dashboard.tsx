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
  XMarkIcon,
  PlusIcon,
  UserGroupIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon
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

// Mock data for the Aurora dashboard
const pointsData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 135 },
  { month: 'Mar', value: 98 },
  { month: 'Apr', value: 145 },
  { month: 'May', value: 160 },
  { month: 'Jun', value: 140 },
  { month: 'Jul', value: 175 },
  { month: 'Aug', value: 190 },
  { month: 'Sep', value: 165 },
  { month: 'Oct', value: 200 },
  { month: 'Nov', value: 185 },
  { month: 'Dec', value: 220 },
]

const progressData = [
  { name: 'Trading Skills', value: 90, color: '#22C55E' },
  { name: 'Market Analysis', value: 25, color: '#EF4444' },
  { name: 'Risk Management', value: 55, color: '#F97316' },
  { name: 'Portfolio Management', value: 75, color: '#EAB308' },
]

// User profile data
const userProfile = {
  name: 'Investment Analyst',
  bio: 'I am really passionate about the South Africa Stock Market.',
  job: 'Investment Analyst',
  location: 'Cape Town, SA',
  since: 'Since Jan 2014',
  level: 'Grandmaster',
  linkedin: 'Linkedin Account',
  github: 'Github Account'
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1Yr')

  const navItems: NavItem[] = [
    { name: 'Daily Challenges', icon: PlusIcon, active: true },
    { name: 'Learn', icon: AcademicCapIcon },
    { name: 'Friends', icon: UserGroupIcon },
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

  const DonutChart = ({ data }: { data: any[] }) => {
    return (
      <div className="donut-charts-container">
        {data.map((item, index) => {
          const percentage = item.value
          const circumference = 2 * Math.PI * 15.9155 // radius = 15.9155
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
          
          return (
            <div key={index} className="donut-chart-item">
              <div className="donut-chart-svg-container">
                <svg className="donut-chart-svg" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="2"
                    className="donut-chart-background"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset="0"
                    className="donut-chart-segment"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="donut-chart-percentage">
                  {percentage}%
                </div>
              </div>
              <div className="donut-chart-label">
                {item.name}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const PointsChart = () => {
    const maxValue = Math.max(...pointsData.map(d => d.value))
    const minValue = Math.min(...pointsData.map(d => d.value))
    const range = maxValue - minValue
    
    return (
      <div className="points-chart-container">
        <h2 className="points-chart-title">Your Points This Year!</h2>
        <div className="points-chart-svg-container">
          <svg className="points-chart-svg" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="pointsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
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
                className="points-chart-grid"
              />
            ))}
            
            {/* Baseline */}
            <line
              x1="0"
              y1="180"
              x2="400"
              y2="180"
              stroke="#000000"
              strokeWidth="2"
              className="points-chart-baseline"
            />
            
            {/* Line path */}
            <path
              d={`M ${pointsData.map((d, i) => 
                `${(i / (pointsData.length - 1)) * 400},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              className="points-chart-line"
            />
            
            {/* Fill area */}
            <path
              d={`M ${pointsData.map((d, i) => 
                `${(i / (pointsData.length - 1)) * 400},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')} L 400,200 L 0,200 Z`}
              fill="url(#pointsGradient)"
              className="points-chart-area"
            />
            
            {/* Data points */}
            {pointsData.map((d, i) => (
              <circle
                key={i}
                cx={(i / (pointsData.length - 1)) * 400}
                cy={200 - ((d.value - minValue) / range) * 180}
                r="4"
                fill="#EF4444"
                className="points-chart-point"
              />
            ))}
          </svg>
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
    <div className={`aurora-dashboard ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="aurora-sidebar">
        <div className="aurora-sidebar-inner">
          {/* Logo */}
          <div className="aurora-logo">
            <h1>aurora</h1>
          </div>

          {/* User Avatar */}
          <div className="aurora-user-avatar">
            <UserCircleIcon className="aurora-avatar-icon" />
          </div>

          {/* Navigation */}
          <nav className="aurora-nav">
            <ul className="aurora-nav-list">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={
                      item.name === 'Daily Challenges' ? '/daily_challenges' :
                      item.name === 'Learn' ? '/learn' :
                      '#'
                    }
                    className={`aurora-nav-link ${
                      item.active
                        ? 'aurora-nav-link-active'
                        : 'aurora-nav-link-inactive'
                    }`}
                  >
                    <item.icon className="aurora-nav-icon" />
                    <span className="aurora-nav-text">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="aurora-signout-section">
            <button
              onClick={handleSignOut}
              className="aurora-signout-button"
            >
              <ArrowRightOnRectangleIcon className="aurora-signout-icon" />
              <span className="aurora-signout-text">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="aurora-main-content">
        <div className="aurora-content-inner">
          {/* User Profile Card */}
          <div className="aurora-profile-card">
            <div className="aurora-profile-left">
              <div className="aurora-profile-avatar-large">
                <UserCircleIcon className="aurora-avatar-large-icon" />
              </div>
              <div className="aurora-level-badge">
                <StarIcon className="aurora-star-icon" />
                <span>{userProfile.level}</span>
              </div>
            </div>
            
            <div className="aurora-profile-center">
              <h3 className="aurora-bio-title">Bio:</h3>
              <p className="aurora-bio-text">{userProfile.bio}</p>
              <div className="aurora-profile-details">
                <div className="aurora-detail-item">
                  <BriefcaseIcon className="aurora-detail-icon" />
                  <span>{userProfile.job}</span>
                </div>
                <div className="aurora-detail-item">
                  <MapPinIcon className="aurora-detail-icon" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="aurora-detail-item">
                  <CalendarIcon className="aurora-detail-icon" />
                  <span>{userProfile.since}</span>
                </div>
              </div>
            </div>
            
            <div className="aurora-profile-right">
              <h3 className="aurora-follow-title">Follow Me!</h3>
              <div className="aurora-social-links">
                <div className="aurora-social-item">
                  <span className="aurora-linkedin-icon">in</span>
                  <span>{userProfile.linkedin}</span>
                </div>
                <div className="aurora-social-item">
                  <span className="aurora-github-icon">GitHub</span>
                  <span>{userProfile.github}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Points Chart */}
          <div className="aurora-points-section">
            <PointsChart />
          </div>

          {/* Progress Donut Charts */}
          <div className="aurora-progress-section">
            <DonutChart data={progressData} />
          </div>
        </div>
      </div>
    </div>
  )
}