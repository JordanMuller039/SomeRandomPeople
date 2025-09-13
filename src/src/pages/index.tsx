import { useState, useEffect } from 'react'
import Image from "next/image"
import { Geist, Geist_Mono } from "next/font/google"
import { supabase } from '../lib/supabase'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

interface User {
  id: string
  email: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user as User | null)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user as User | null)
        setLoading(false)
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
        window.location.href = '/dashboard'
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
    } finally {
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

  if (loading) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} loading-container`}>
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} main-container`}>
      <main className="main-content">
        <Image
          className="logo"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {user ? (
          // User is logged in
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back!</h1>
            <p className="welcome-email">
              Logged in as: {user.email}
            </p>
            <button
              onClick={handleSignOut}
              className="signout-button"
            >
              Sign Out
            </button>
            {message && (
              <p className="success-message">
                {message}
              </p>
            )}
          </div>
        ) : (
          // User is not logged in - show auth form
          <div className="auth-section">
            <h1 className="auth-title">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            
            <form onSubmit={handleAuth} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="auth-submit-button"
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setMessage('')
              }}
              className="auth-toggle-button"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>

            {message && (
              <p className={`auth-message ${
                message.includes('error') || message.includes('Error') 
                  ? 'error-message' 
                  : 'success-message'
              }`}>
                {message}
              </p>
            )}
          </div>
        )}

        <ol className="instructions-list">
          <li className="instruction-item">
            Get started by editing{" "}
            <code className="code-highlight">
              src/pages/index.tsx
            </code>
            .
          </li>
          <li className="instruction-item-last">
            Save and see your changes instantly.
          </li>
        </ol>
      </main>
      
      <footer className="footer">
        <a
          className="footer-link"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="footer-link"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="footer-link"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}