'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase' // Garde bien ce chemin si ton fichier est dans `src/app`

export default function Header() {
  const [user, setUser] = useState<any>(null) // ← solution simple : utiliser `any`

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data && data.user) {
        setUser(data.user)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="flex justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-bold">Hairmony</h1>
      {!user ? (
        <div className="space-x-4">
          <Link href="/login" className="text-blue-600 hover:underline">Connexion</Link>
          <Link href="/signup" className="text-green-600 hover:underline">S’abonner</Link>
        </div>
      ) : (
        <span className="text-sm text-gray-600">Connecté</span>
      )}
    </header>
  )
}
