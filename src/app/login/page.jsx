'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSubscribe = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
    })
    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">🔐 Connexion</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition-colors"
          >
            Se connecter
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="my-6 border-t border-zinc-700" />

        <button
          onClick={handleSubscribe}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold transition-colors"
        >
          💳 S’abonner – 9€/mois
        </button>

        <div className="text-center mt-6">
          <a
            href="/signup"
            className="text-sm text-gray-300 hover:text-white transition-colors underline"
          >
            ✨ Créer un compte
          </a>
        </div>
      </div>
    </div>
  )
}

