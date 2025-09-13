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
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
}

export default function Learn() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
              <li>
                <a
                  href="/dashboard"
                  className="aurora-nav-link aurora-nav-link-inactive"
                >
                  <HomeIcon className="aurora-nav-icon" />
                  <span className="aurora-nav-text">Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/daily_challenges"
                  className="aurora-nav-link aurora-nav-link-inactive"
                >
                  <PlusIcon className="aurora-nav-icon" />
                  <span className="aurora-nav-text">Daily Challenges</span>
                </a>
              </li>
              <li>
                <a
                  href="/learn"
                  className="aurora-nav-link aurora-nav-link-active"
                >
                  <AcademicCapIcon className="aurora-nav-icon" />
                  <span className="aurora-nav-text">Learn</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="aurora-nav-link aurora-nav-link-inactive"
                >
                  <UserGroupIcon className="aurora-nav-icon" />
                  <span className="aurora-nav-text">Friends</span>
                </a>
              </li>
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
        <div className="learn-container">
          <div className="learn-header">
            <h1 className="learn-title">
              Ready to Learn {user?.email?.split('@')[0]}?
            </h1>
            
            <div className="progress-section">
              <div className="level-info">
                <span className="level-text">Level 1</span>
                <span className="points-text">100/200 XP to Level 2</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search topics or categories..."
                className="search-input"
              />
            </div>
          </div>

          <div className="categories-section">
            <div className="category-card">
              <h2 className="category-title">Risk Management</h2>
              <div className="courses-grid">
                <div className="course-card" onClick={() => alert('Introduction to Risk (+20 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Introduction to Risk</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#22C55E' }}>Easy</div>
                  </div>
                  <p className="course-description">Basic concepts of financial risk</p>
                  <div className="course-footer">
                    <span className="course-points">+20 XP</span>
                  </div>
                </div>
                
                <div className="course-card" onClick={() => alert('Portfolio Diversification (+30 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Portfolio Diversification</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#F59E0B' }}>Medium</div>
                  </div>
                  <p className="course-description">Learn to spread investment risk</p>
                  <div className="course-footer">
                    <span className="course-points">+30 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Options Hedging (+50 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Options Hedging Strategies</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#EF4444' }}>Hard</div>
                  </div>
                  <p className="course-description">Advanced hedging techniques</p>
                  <div className="course-footer">
                    <span className="course-points">+50 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Black Swan Events (+100 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Black Swan Events</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#7F1D1D' }}>Impossible</div>
                  </div>
                  <p className="course-description">Preparing for the unpredictable</p>
                  <div className="course-footer">
                    <span className="course-points">+100 XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="category-card">
              <h2 className="category-title">Stocks</h2>
              <div className="courses-grid">
                <div className="course-card" onClick={() => alert('Stock Market Basics (+20 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Stock Market Basics</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#22C55E' }}>Easy</div>
                  </div>
                  <p className="course-description">Understanding how stocks work</p>
                  <div className="course-footer">
                    <span className="course-points">+20 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Technical Analysis (+30 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Technical Analysis</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#F59E0B' }}>Medium</div>
                  </div>
                  <p className="course-description">Reading charts and patterns</p>
                  <div className="course-footer">
                    <span className="course-points">+30 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Fundamental Analysis (+40 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Fundamental Analysis</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#FF8C00' }}>Intermediate</div>
                  </div>
                  <p className="course-description">Evaluating company financials</p>
                  <div className="course-footer">
                    <span className="course-points">+40 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Algorithmic Trading (+50 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Algorithmic Trading</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#EF4444' }}>Hard</div>
                  </div>
                  <p className="course-description">Programming trading strategies</p>
                  <div className="course-footer">
                    <span className="course-points">+50 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Market Microstructure (+100 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Market Microstructure</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#7F1D1D' }}>Impossible</div>
                  </div>
                  <p className="course-description">How markets really work</p>
                  <div className="course-footer">
                    <span className="course-points">+100 XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="category-card">
              <h2 className="category-title">Hedge Funds</h2>
              <div className="courses-grid">
                <div className="course-card" onClick={() => alert('What are Hedge Funds? (+20 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">What are Hedge Funds?</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#22C55E' }}>Easy</div>
                  </div>
                  <p className="course-description">Introduction to alternative investments</p>
                  <div className="course-footer">
                    <span className="course-points">+20 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Long/Short Strategies (+30 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Long/Short Strategies</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#F59E0B' }}>Medium</div>
                  </div>
                  <p className="course-description">Market neutral approaches</p>
                  <div className="course-footer">
                    <span className="course-points">+30 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Quantitative Strategies (+50 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Quantitative Strategies</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#EF4444' }}>Hard</div>
                  </div>
                  <p className="course-description">Math-driven investment approaches</p>
                  <div className="course-footer">
                    <span className="course-points">+50 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Prime Brokerage (+100 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Prime Brokerage</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#7F1D1D' }}>Impossible</div>
                  </div>
                  <p className="course-description">Institutional trading infrastructure</p>
                  <div className="course-footer">
                    <span className="course-points">+100 XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="category-card">
              <h2 className="category-title">Landscape Research</h2>
              <div className="courses-grid">
                <div className="course-card" onClick={() => alert('Industry Analysis (+20 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Industry Analysis</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#22C55E' }}>Easy</div>
                  </div>
                  <p className="course-description">Researching market sectors</p>
                  <div className="course-footer">
                    <span className="course-points">+20 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Competitive Intelligence (+30 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Competitive Intelligence</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#F59E0B' }}>Medium</div>
                  </div>
                  <p className="course-description">Understanding market players</p>
                  <div className="course-footer">
                    <span className="course-points">+30 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Regulatory Impact Analysis (+40 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Regulatory Impact Analysis</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#FF8C00' }}>Intermediate</div>
                  </div>
                  <p className="course-description">How laws affect markets</p>
                  <div className="course-footer">
                    <span className="course-points">+40 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Macroeconomic Modeling (+50 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Macroeconomic Modeling</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#EF4444' }}>Hard</div>
                  </div>
                  <p className="course-description">Building economic forecasts</p>
                  <div className="course-footer">
                    <span className="course-points">+50 XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="category-card">
              <h2 className="category-title">Variable Analysis</h2>
              <div className="courses-grid">
                <div className="course-card" onClick={() => alert('Statistical Basics (+20 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Statistical Basics</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#22C55E' }}>Easy</div>
                  </div>
                  <p className="course-description">Understanding data fundamentals</p>
                  <div className="course-footer">
                    <span className="course-points">+20 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Correlation vs Causation (+30 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Correlation vs Causation</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#F59E0B' }}>Medium</div>
                  </div>
                  <p className="course-description">Interpreting relationships</p>
                  <div className="course-footer">
                    <span className="course-points">+30 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Regression Analysis (+40 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Regression Analysis</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#FF8C00' }}>Intermediate</div>
                  </div>
                  <p className="course-description">Predicting outcomes</p>
                  <div className="course-footer">
                    <span className="course-points">+40 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Machine Learning Models (+50 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Machine Learning Models</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#EF4444' }}>Hard</div>
                  </div>
                  <p className="course-description">AI in financial analysis</p>
                  <div className="course-footer">
                    <span className="course-points">+50 XP</span>
                  </div>
                </div>

                <div className="course-card" onClick={() => alert('Stochastic Calculus (+100 XP)')}>
                  <div className="course-header">
                    <h3 className="course-title">Stochastic Calculus</h3>
                    <div className="difficulty-badge" style={{ backgroundColor: '#7F1D1D' }}>Impossible</div>
                  </div>
                  <p className="course-description">Advanced mathematical modeling</p>
                  <div className="course-footer">
                    <span className="course-points">+100 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}