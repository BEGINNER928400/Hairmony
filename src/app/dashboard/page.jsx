"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: "", phone: "", notes: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchClients = async () => {
      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setClients(data || []);
    };
    fetchClients();
  }, [user]);

  const handleAddClient = async () => {
    const { data, error } = await supabase
      .from("clients")
      .insert([{ ...newClient, user_id: user.id }]);
    if (!error && data) {
      setClients([data[0], ...clients]);
      setNewClient({ name: "", phone: "", notes: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">💇 Hairmony</h1>
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Connexion
        </Link>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        <section className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">📋 Clients</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg text-blue-700">{client.name}</h3>
                <p className="text-sm text-gray-600">📞 {client.phone}</p>
                <p className="text-sm text-gray-500">📝 {client.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">➕ Ajouter un client</h2>
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Nom"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Téléphone"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Notes"
            value={newClient.notes}
            onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
          />
          <button
            onClick={handleAddClient}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </section>
      </main>
    </div>
  );
}
