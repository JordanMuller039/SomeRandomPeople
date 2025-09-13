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

export default function DailyChallenges() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [points, setPoints] = useState(100)
  const [successAudio, setSuccessAudio] = useState<HTMLAudioElement | null>(null)

  const navItems: NavItem[] = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Experience', icon: ChartBarIcon, active: true },
    { name: 'Learn', icon: AcademicCapIcon },
  ]

  useEffect(() => {
    const audio = new Audio('/sounds/success.mp3') 
    audio.preload = 'auto'
    audio.volume = 0.6
    setSuccessAudio(audio)
  }, [])

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

  const handleAnswerClick = (answer: string) => {
  setSelectedAnswer(answer)
  setIsFlipped(true)
  
  if (answer === 'Drop') {
    // Correct answer - add points and show confetti
    setShowConfetti(true)
    if (successAudio) {
      successAudio.currentTime = 0 // Reset to start
      successAudio.play().catch(error => {
        console.log('Audio play failed:', error)
      })
    }
    setTimeout(() => {
      setPoints(150) 
    }, 1000)
  } else {
    // Wrong answer - deduct 5 points
    setTimeout(() => {
      setPoints(95) 
    }, 1000)
  }
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const generateConfetti = () => {
  const colors = ['#FF5630', '#FFB3A6', '#FFCCC7', '#FFD700', '#FFA500']
  const confettiPieces = []
  
  for (let i = 0; i < 50; i++) {
    confettiPieces.push(
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    )
  }
  return confettiPieces
}

return (
  <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
    {showConfetti && (
      <div className="confetti-container">
        {generateConfetti()}
      </div>
    )}

    <div className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <div className="sidebar-inner">
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

        <div className="sidebar-profile">
          <div className="sidebar-profile-content">
            <UserCircleIcon className="sidebar-profile-avatar" />
            {!sidebarCollapsed && (
              <div className="sidebar-profile-info">
                <p className="sidebar-profile-name">Welcome back!</p>
                <p className="sidebar-profile-email">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-nav-list">
            <div>
              <HomeIcon className="sidebar-nav-icon" />
              {!sidebarCollapsed && <span>Home</span>}
            </div>
            <div>
              <ChartBarIcon className="sidebar-nav-icon" />
              {!sidebarCollapsed && <span>Experience</span>}
            </div>
            <div>
              <AcademicCapIcon className="sidebar-nav-icon" />
              {!sidebarCollapsed && <span>Learn</span>}
            </div>
          </div>
        </div>

        <div className="sidebar-actions">
          <button onClick={toggleDarkMode} className="sidebar-action-button">
            {darkMode ? <SunIcon className="sidebar-action-icon" /> : <MoonIcon className="sidebar-action-icon" />}
            {!sidebarCollapsed && (
              <span className="sidebar-action-text">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
          <button onClick={handleSignOut} className="sidebar-signout-button">
            <ArrowRightOnRectangleIcon className="sidebar-action-icon" />
            {!sidebarCollapsed && <span className="sidebar-action-text">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
    
    <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : 'main-content-normal'}`}>
      <div className="challenges-container">
        <div className="progress-section">
          <div className="level-info">
            <span className="level-text">Level 1</span>
            <span className="points-text">{points}/200 XP</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(points / 200) * 100}%` }}
            />
          </div>
        </div>

        <div className="challenge-card-container">
          <div className={`challenge-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="card-face card-front">
              <div className="difficulty-badge">
                <span className="difficulty-text">BEGINNER</span>
              </div>
              
              <h1 className="challenge-title">
                Daily Challenge: {getCurrentDate()}
              </h1>
              
              <div className="avatar-container">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=challenge&backgroundColor=transparent"
                  alt="Challenge Avatar"
                  className="challenge-avatar"
                />
              </div>
              
              <div className="scenario-text">
                "The president just got assassinated, what do you think the stock market will do?"
              </div>
              
              <div className="answer-buttons">
                <button 
                  className="answer-button answer-drop"
                  onClick={() => handleAnswerClick('Drop')}
                  disabled={isFlipped}
                >
                  Drop
                </button>
                <button 
                  className="answer-button answer-nothing"
                  onClick={() => handleAnswerClick('Nothing')}
                  disabled={isFlipped}
                >
                  Nothing
                </button>
                <button 
                  className="answer-button answer-rise"
                  onClick={() => handleAnswerClick('Rise')}
                  disabled={isFlipped}
                >
                  Rise
                </button>
              </div>
            </div>

            <div className="card-face card-back">
              {selectedAnswer === 'Drop' ? (
                <>
                  <h2 className="result-title success">Congratulations!</h2>
                  <p className="result-description">
                    You picked the right choice! Historical data shows that major political disruptions, 
                    especially sudden leadership changes, typically cause immediate market uncertainty and drops 
                    as investors seek safer assets.
                  </p>
                  <div className="points-earned">
                    <span className="points-text">+50 Points Earned!</span>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="result-title failure">Better Luck Next Time!</h2>
                  <p className="result-description">
                    {selectedAnswer === 'Rise' 
                      ? "Markets rarely rise immediately after such dramatic political events. Uncertainty typically drives investors to sell first and ask questions later."
                      : "While markets can sometimes show initial resilience, assassination of a president typically creates immediate uncertainty, causing markets to drop as a knee-jerk reaction."
                    }
                  </p>
                </>
              )}
              
              <div className="card-actions">
                <button 
                  className="action-button learn-button"
                  onClick={() => window.location.href = '/learn'}
                >
                  Learn More
                </button>
                <button 
                  className="action-button return-button"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}