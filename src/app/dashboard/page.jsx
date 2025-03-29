'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState([])
  const [rdv, setRdv] = useState([])

  const [newClient, setNewClient] = useState({ name: '', phone: '', notes: '' })
  const [newRdv, setNewRdv] = useState({ date: '', heure: '', client_id: '', notes: '' })

  const [editingRdvId, setEditingRdvId] = useState(null)
  const [editedRdv, setEditedRdv] = useState({ date: '', heure: '', client_id: '', notes: '' })


  // 🔐 Obtenir l'utilisateur connecté
  useEffect(() => {
    
    const startEditRdv = (rdv) => {
    setEditingRdvId(rdv.id)
    setEditedRdv({
      date: rdv.date,
      heure: rdv.heure,
      client_id: rdv.client_id,
      notes: rdv.notes,
    })
  }
  const handleUpdateRdv = async () => {
    const { error } = await supabase
      .from('rdv')
      .update(editedRdv)
      .eq('id', editingRdvId)
  
    if (!error) {
      setRdv(rdv.map((r) => (r.id === editingRdvId ? { ...r, ...editedRdv } : r)))
      setEditingRdvId(null)
      setEditedRdv({ date: '', heure: '', client_id: '', notes: '' })
    }
  }
    
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error) setUser(data.user)
    }
    getUser()
  }, [])

  // 📥 Charger les clients
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

  // 📅 Charger les rendez-vous
  useEffect(() => {
    if (!user) return
    const fetchRdv = async () => {
      const { data } = await supabase
        .from('rdv')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
      setRdv(data)
    }
    fetchRdv()
  }, [user])

  // ➕ Ajouter un client
  const handleAddClient = async () => {
    const { data, error } = await supabase.from('clients').insert([
      { ...newClient, user_id: user.id },
    ])
    if (!error) {
      setClients([data[0], ...clients])
      setNewClient({ name: '', phone: '', notes: '' })
    }
  }

  // ➕ Ajouter un RDV
  const handleAddRdv = async () => {
    const { data, error } = await supabase.from('rdv').insert([
      { ...newRdv, user_id: user.id },
    ])
    if (!error) {
      setRdv([data[0], ...rdv])
      setNewRdv({ date: '', heure: '', client_id: '', notes: '' })
    }
  }

  // 🗑 Supprimer un RDV
  const handleDeleteRdv = async (id) => {
    const { error } = await supabase.from('rdv').delete().eq('id', id)
    if (!error) setRdv(rdv.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-blue-600 text-center">💇‍♂️ Mini CRM Coiffeur</h1>

        {/* Liste des clients */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📋 Clients</h2>
          <ul className="space-y-2">
            {clients.map((client) => (
              <li key={client.id} className="border-b pb-2">
                <strong>{client.name}</strong> – {client.phone}<br />
                <span className="text-sm text-gray-600">{client.notes}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2">
            <input
              className="border rounded px-3 py-1 w-full"
              placeholder="Nom"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
            <input
              className="border rounded px-3 py-1 w-full"
              placeholder="Téléphone"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            <input
              className="border rounded px-3 py-1 w-full"
              placeholder="Notes"
              value={newClient.notes}
              onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
            />
            <button
              onClick={handleAddClient}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter client
            </button>
          </div>
        </section>

        {/* Liste des RDV */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📅 Rendez-vous</h2>
          <ul className="space-y-4">
  {rdv.map((r) => (
    <li key={r.id} className="border-b pb-2 flex justify-between items-center">
      {editingRdvId === r.id ? (
        <div className="flex flex-col gap-2 w-full">
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={editedRdv.date}
            onChange={(e) => setEditedRdv({ ...editedRdv, date: e.target.value })}
          />
          <input
            type="time"
            className="border rounded px-2 py-1"
            value={editedRdv.heure}
            onChange={(e) => setEditedRdv({ ...editedRdv, heure: e.target.value })}
          />
          <select
            className="border rounded px-2 py-1"
            value={editedRdv.client_id}
            onChange={(e) => setEditedRdv({ ...editedRdv, client_id: e.target.value })}
          >
            <option value="">Sélectionner un client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            className="border rounded px-2 py-1"
            placeholder="Notes"
            value={editedRdv.notes}
            onChange={(e) => setEditedRdv({ ...editedRdv, notes: e.target.value })}
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleUpdateRdv}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setEditingRdvId(null)}
              className="text-gray-500 hover:underline text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <div>
            <strong>{r.date}</strong> à {r.heure}<br />
            <span className="text-sm text-gray-600">
              Client ID : {r.client_id} – {r.notes}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => startEditRdv(r)}
              className="text-blue-500 hover:underline text-sm"
            >
              Modifier
            </button>
            <button
              onClick={() => handleDeleteRdv(r.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </li>
  ))}
</ul>


          <div className="mt-6 space-y-2">
            <input
              type="date"
              className="border rounded px-3 py-1 w-full"
              value={newRdv.date}
              onChange={(e) => setNewRdv({ ...newRdv, date: e.target.value })}
            />
            <input
              type="time"
              className="border rounded px-3 py-1 w-full"
              value={newRdv.heure}
              onChange={(e) => setNewRdv({ ...newRdv, heure: e.target.value })}
            />
            <select
              className="border rounded px-3 py-1 w-full"
              value={newRdv.client_id}
              onChange={(e) => setNewRdv({ ...newRdv, client_id: e.target.value })}
            >
              <option value="">Sélectionner un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              className="border rounded px-3 py-1 w-full"
              placeholder="Notes"
              value={newRdv.notes}
              onChange={(e) => setNewRdv({ ...newRdv, notes: e.target.value })}
            />
            <button
              onClick={handleAddRdv}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter RDV
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}


