import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // User is already logged in, redirect immediately
        setRedirecting(true)
        window.location.href = '/dashboard'
        return
      }
      setUser(user as User | null)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User just signed in, redirect immediately
          setRedirecting(true)
          window.location.href = '/dashboard'
        } else {
          setUser(session?.user as User | null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setMessage('Successfully signed in!')
        // The redirect will happen via the auth state change listener
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error: any) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Successfully signed out!')
    }
  }

  if (loading || redirecting) {
    return (
      <div className="aurora-loading">
        <div className="aurora-loading-text">
          {redirecting ? 'Redirecting...' : 'Loading...'}
        </div>
      </div>
    )
  }

  return (
    <div className={`aurora-container ${isLogin ? 'signin-mode' : 'create-account-mode'}`}>
      {user ? (
        // User is logged in
        <div className="aurora-welcome-container">
          <h1 className="aurora-title">aurora</h1>
          <div className="text-center">
            <h2 className="aurora-welcome-title">Welcome back!</h2>
            <p className="aurora-welcome-email">
              Logged in as: {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="aurora-signout-button"
          >
            Sign Out
          </button>
          {message && (
            <p className="aurora-message aurora-success-message">
              {message}
            </p>
          )}
        </div>
      ) : (
        // User is not logged in - show auth form
        <div className="aurora-form-container">
          <h1 className="aurora-title">aurora</h1>
          
          <form onSubmit={handleAuth} className="aurora-form">
            <input
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="aurora-input"
            />
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="aurora-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="aurora-submit-button"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}
            className="aurora-toggle-button"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>

          {message && (
            <p className={`aurora-message ${
              message.includes('error') || message.includes('Error') 
                ? 'aurora-error-message' 
                : 'aurora-success-message'
            }`}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}