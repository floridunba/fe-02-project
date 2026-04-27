'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { login, register } from '@/lib/api'
import { saveToken } from '@/lib/auth'
import styles from './page.module.css'

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? '/'

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    try {
      const data = await login(email, password)
      saveToken(data.token)
      router.push(returnTo)
    } catch {
      setError('Email หรือ Password ไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const tel = (form.elements.namedItem('tel') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    try {
      const data = await register(name, email, tel, password)
      saveToken(data.token)
      router.push(returnTo)
    } catch {
      setError('สมัครสมาชิกไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.wrapper}>
      {/* <Navbar/> */}
      <div className={styles.authWrap}>
        <div className={styles.logo}>camp<span>.</span>io</div>
        <p className={styles.sub}>Your nature retreat starts here</p>
        <div className={styles.authTabs}>
          <button className={`${styles.authTab} ${tab === 'login' ? styles.active : ''}`} onClick={() => setTab('login')}>Log in</button>
          <button className={`${styles.authTab} ${tab === 'signup' ? styles.active : ''}`} onClick={() => setTab('signup')}>Sign up</button>
        </div>
        {error && <p style={{color:'red', fontSize:'12px', marginBottom:'10px'}}>{error}</p>}
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input name="email" className={styles.input} type="email" placeholder="your@email.com" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input name="password" className={styles.input} type="password" placeholder="••••••••" required />
            </div>
            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Log in'}
            </button>
            <p className={styles.footer}>Don&apos;t have an account? <span onClick={() => setTab('signup')}>Sign up</span></p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full name</label>
              <input name="name" className={styles.input} type="text" placeholder="Your name" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input name="email" className={styles.input} type="email" placeholder="your@email.com" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tel</label>
              <input name="tel" className={styles.input} type="text" placeholder="0812345678" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input name="password" className={styles.input} type="password" placeholder="Min 8 characters" required />
            </div>
            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Create account'}
            </button>
            <p className={styles.footer}>Already have an account? <span onClick={() => setTab('login')}>Log in</span></p>
          </form>
        )}
      </div>
    </main>
  )
}