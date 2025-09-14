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
  { month: 'Jan', value: 125 },
  { month: 'Feb', value: 135 },
  { month: 'Feb', value: 130 },
  { month: 'Mar', value: 98 },
  { month: 'Mar', value: 105 },
  { month: 'Apr', value: 145 },
  { month: 'Apr', value: 150 },
  { month: 'May', value: 160 },
  { month: 'May', value: 155 },
  { month: 'Jun', value: 140 },
  { month: 'Jun', value: 145 },
  { month: 'Jul', value: 175 },
  { month: 'Jul', value: 180 },
  { month: 'Aug', value: 190 },
  { month: 'Aug', value: 185 },
  { month: 'Sep', value: 165 },
  { month: 'Sep', value: 170 },
  { month: 'Oct', value: 200 },
  { month: 'Oct', value: 195 },
  { month: 'Nov', value: 185 },
  { month: 'Nov', value: 190 },
  { month: 'Dec', value: 220 },
  { month: 'Dec', value: 215 },
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
      <div className="points-chart-left">
        <h2 className="points-chart-title">Your Points This Year!</h2>
        <div className="points-chart-svg-container">
          <svg className="points-chart-svg" viewBox="0 0 300 200">
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
                x2="300"
                y2={i * 40}
                stroke="#f3f4f6"
                strokeWidth="1"
                className="points-chart-grid"
              />
            ))}
            
            {/* X-axis labels */}
            {pointsData.filter((_, i) => i % 2 === 0).map((d, i) => (
              <text
                key={i}
                x={(i * 2 / (pointsData.length - 1)) * 300}
                y="195"
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
                className="points-chart-x-label"
              >
                {d.month}
              </text>
            ))}
            
            {/* Line path */}
            <path
              d={`M ${pointsData.map((d, i) => 
                `${(i / (pointsData.length - 1)) * 300},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              className="points-chart-line"
            />
            
            {/* Fill area */}
            <path
              d={`M ${pointsData.map((d, i) => 
                `${(i / (pointsData.length - 1)) * 300},${200 - ((d.value - minValue) / range) * 180}`
              ).join(' L ')} L 300,200 L 0,200 Z`}
              fill="url(#pointsGradient)"
              className="points-chart-area"
            />
            
            {/* Data points */}
            {pointsData.map((d, i) => (
              <circle
                key={i}
                cx={(i / (pointsData.length - 1)) * 300}
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

  const ActivityChart = () => {
    // Generate mock activity data for the current month only
    const generateActivityData = () => {
      const data = []
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      
      // Get first day of current month
      const firstDay = new Date(currentYear, currentMonth, 1)
      // Get last day of current month
      const lastDay = new Date(currentYear, currentMonth + 1, 0)
      
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const activityLevel = isWeekend ? Math.random() * 0.3 : Math.random()
        
        data.push({
          date: new Date(d),
          level: activityLevel
        })
      }
      return data
    }

    const activityData = generateActivityData()
    const weeks = Math.ceil(activityData.length / 7)
    
    const getActivityColor = (level: number) => {
      if (level === 0) return '#1f2937'
      if (level < 0.25) return '#ff5630'
      if (level < 0.5) return '#ff7a5c'
      if (level < 0.75) return '#ff9a8b'
      return '#ffb3a6'
    }

    const getMonthName = () => {
      const today = new Date()
      return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    return (
      <div className="activity-chart-right">
        <h2 className="activity-chart-title">Daily Activity - {getMonthName()}</h2>
        <div className="activity-chart-container">
          <div className="activity-chart-grid">
            {/* Day labels */}
            <div className="activity-day-labels">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>
            
            {/* Activity grid */}
            <div className="activity-grid">
              {Array.from({ length: 7 }, (_, dayIndex) => (
                <div key={dayIndex} className="activity-week-column">
                  {Array.from({ length: weeks }, (_, weekIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex
                    const dayData = activityData[dataIndex]
                    const isToday = dayData && dayData.date.toDateString() === new Date().toDateString()
                    
                    return (
                      <div
                        key={weekIndex}
                        className={`activity-day ${isToday ? 'activity-today' : ''}`}
                        style={{
                          backgroundColor: dayData ? getActivityColor(dayData.level) : '#1f2937'
                        }}
                        title={dayData ? `${dayData.date.toLocaleDateString()}: ${Math.round(dayData.level * 100)}% activity` : ''}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="activity-legend">
            <span className="activity-legend-text">Less</span>
            <div className="activity-legend-colors">
              <div className="activity-legend-color" style={{ backgroundColor: '#1f2937' }}></div>
              <div className="activity-legend-color" style={{ backgroundColor: '#ff5630' }}></div>
              <div className="activity-legend-color" style={{ backgroundColor: '#ff7a5c' }}></div>
              <div className="activity-legend-color" style={{ backgroundColor: '#ff9a8b' }}></div>
              <div className="activity-legend-color" style={{ backgroundColor: '#ffb3a6' }}></div>
            </div>
            <span className="activity-legend-text">More</span>
          </div>
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
                      item.name === 'Friends' ? '/friends' :
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
    
    {/* Progress Bar Section */}
    <div className="aurora-progress-section-profile">
      <div className="aurora-level-info">
        <span className="aurora-level-text">Level 1</span>
        <span className="aurora-points-text">100/200 XP to Level 2</span>
      </div>
      <div className="aurora-progress-bar">
        <div 
          className="aurora-progress-fill" 
          style={{ width: '50%' }}
        />
      </div>
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

    {/* Achievement Badges */}
    <div className="aurora-badges-section">
      <h4 className="aurora-badges-title">Achievements:</h4>
      <div className="aurora-badges-grid">
        <div className="aurora-badge aurora-badge-green">
          <UserGroupIcon className="aurora-badge-icon" />
          <span className="aurora-badge-text">Onboarded</span>
        </div>
        
        <div className="aurora-badge aurora-badge-orange">
          <CalendarIcon className="aurora-badge-icon" />
          <span className="aurora-badge-text">7-Day Streak</span>
        </div>
        
        <div className="aurora-badge aurora-badge-gold">
          <StarIcon className="aurora-badge-icon" />
          <span className="aurora-badge-text">Never Wrong!</span>
        </div>
        
        <div className="aurora-badge aurora-badge-blue">
          <AcademicCapIcon className="aurora-badge-icon" />
          <span className="aurora-badge-text">Quick Learner</span>
        </div>
        
        <div className="aurora-badge aurora-badge-purple">
          <ChartBarIcon className="aurora-badge-icon" />
          <span className="aurora-badge-text">Risk Master</span>
        </div>
        
        <div className="aurora-badge aurora-badge-red">
          <BriefcaseIcon className="aurora-badge-icon" />
          <span className="aurora-badge-text">Market Expert</span>
        </div>
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

          {/* Points Chart and Activity Chart */}
          <div className="aurora-charts-section">
            <PointsChart />
            <ActivityChart />
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