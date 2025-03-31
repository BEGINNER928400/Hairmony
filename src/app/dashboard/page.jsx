'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState([])
  const [newClient, setNewClient] = useState({ name: '', phone: '', notes: '' })

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!user) return
    const fetchClients = async () => {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setClients(data)
    }
    fetchClients()
  }, [user])

  const handleAddClient = async () => {
    const { data, error } = await supabase.from('clients').insert([
      { ...newClient, user_id: user.id },
    ])
    if (!error && data) {
      setClients([data[0], ...clients])
      setNewClient({ name: '', phone: '', notes: '' })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b shadow-sm z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">💇‍♂️ Hairmony</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Se déconnecter
        </button>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto p-6 space-y-10">
        {/* Clients */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            📋 Clients
          </h2>
          <ul className="space-y-3">
            {clients.map((client) => (
              <li key={client.id} className="border-b pb-2">
                <p className="font-medium text-gray-800">{client.name}</p>
                <p className="text-sm text-gray-600">{client.phone}</p>
                <p className="text-sm text-gray-500">{client.notes}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Ajouter un client */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            ➕ Ajouter un client
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <input
              className="border rounded px-4 py-2 text-sm"
              placeholder="Nom"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
            <input
              className="border rounded px-4 py-2 text-sm"
              placeholder="Téléphone"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            <input
              className="border rounded px-4 py-2 text-sm"
              placeholder="Notes"
              value={newClient.notes}
              onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
            />
            <button
              onClick={handleAddClient}
              className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Ajouter
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
