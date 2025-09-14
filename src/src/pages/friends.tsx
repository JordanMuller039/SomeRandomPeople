import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { 
  AcademicCapIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  HomeIcon,
  UserGroupIcon,
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

// ===== Friends leaderboard data =====
const friendsData = [
  {
    name: 'Alice',
    skills: [
      { name: 'Trading Skills', value: 80, color: '#22C55E' },
      { name: 'Market Analysis', value: 65, color: '#EF4444' },
      { name: 'Risk Management', value: 50, color: '#F97316' },
      { name: 'Portfolio Management', value: 70, color: '#EAB308' },
    ],
  },
  {
    name: 'Bob',
    skills: [
      { name: 'Trading Skills', value: 60, color: '#22C55E' },
      { name: 'Market Analysis', value: 85, color: '#EF4444' },
      { name: 'Risk Management', value: 40, color: '#F97316' },
      { name: 'Portfolio Management', value: 75, color: '#EAB308' },
    ],
  },
  {
    name: 'Charlie',
    skills: [
      { name: 'Trading Skills', value: 95, color: '#22C55E' },
      { name: 'Market Analysis', value: 40, color: '#EF4444' },
      { name: 'Risk Management', value: 70, color: '#F97316' },
      { name: 'Portfolio Management', value: 55, color: '#EAB308' },
    ],
  },
]

// ===== Donut chart component =====
const DonutChart = ({ data }: { data: any[] }) => {
  return (
    <div className="donut-charts-container">
      {data.map((item, index) => {
        const percentage = item.value
        const circumference = 2 * Math.PI * 15.9155
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
              <div className="donut-chart-percentage">{percentage}%</div>
            </div>
            <div className="donut-chart-label">{item.name}</div>
          </div>
        )
      })}
    </div>
  )
}

// ===== Leaderboard card =====
const LeaderboardCard = ({ friend }: { friend: any }) => {
  const totalScore = friend.skills.reduce((acc: number, s: any) => acc + s.value, 0)
  return (
    <div className="aurora-profile-card flex-col items-start">
      <h3 className="font-semibold mb-2">{friend.name} – {totalScore} pts</h3>
      <DonutChart data={friend.skills} />
    </div>
  )
}

export default function Friends() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const navItems: NavItem[] = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Daily Challenges', icon: PlusIcon },
    { name: 'Learn', icon: AcademicCapIcon },
    { name: 'Friends', icon: UserGroupIcon, active: true },
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/'
        return
      }
      setUser(user as User)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // Sort friends by score
  const leaderboard = friendsData
    .map(friend => ({
      ...friend,
      totalScore: friend.skills.reduce((acc, s) => acc + s.value, 0),
    }))
    .sort((a, b) => b.totalScore - a.totalScore)

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="aurora-dashboard">
      {/* Sidebar */}
      <div className="aurora-sidebar">
        <div className="aurora-sidebar-inner">
          <div className="aurora-logo">
            <h1>aurora</h1>
          </div>
          <div className="aurora-user-avatar">
            <UserCircleIcon className="aurora-avatar-icon" />
          </div>
          <nav className="aurora-nav">
            <ul className="aurora-nav-list">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={
                      item.name === 'Home' ? '/dashboard' :
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
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="aurora-signout-section">
            <button onClick={handleSignOut} className="aurora-signout-button">
              <ArrowRightOnRectangleIcon className="aurora-signout-icon" />
              <span className="aurora-signout-text">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="aurora-main-content">
        <div className="aurora-content-inner">
          <h2 className="text-2xl font-bold mb-4">Friends Leaderboard</h2>
          <div className="space-y-4">
            {leaderboard.map((friend, index) => (
              <div key={friend.name} className="flex gap-4 items-start">
                <span className="text-2xl font-bold w-10 text-gray-500">
                  #{index + 1}
                </span>
                <LeaderboardCard friend={friend} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
