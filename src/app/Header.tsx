'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="flex justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-bold">Hairmony</h1>
      {!user ? (
        <div>
          <Link href="/login" className="text-blue-600 hover:underline">Connexion</Link>
        </div>
      ) : (
        <span className="text-sm text-gray-600">Connecté</span>
      )}
    </header>
  )
}
