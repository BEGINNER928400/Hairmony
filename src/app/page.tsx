"use client";

import { useState } from "react";

export default function Home() {
    const [clients, setClients] = useState([
        { name: "Laura Martin", phone: "06 12 34 56 78", notes: "Coloration blonde" },
    ]);
    const [newClient, setNewClient] = useState({ name: "", phone: "", notes: "" });

    const handleAddClient = () => {
        if (!newClient.name) return;
        setClients([...clients, newClient]);
        setNewClient({ name: "", phone: "", notes: "" });
    };

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>💇 Mini CRM Coiffeur</h1>

            <h2>📋 Clients</h2>
            <ul>
                {clients.map((client, index) => (
                    <li key={index} style={{ marginBottom: "1rem" }}>
                        <strong>{client.name}</strong><br />
                        📞 {client.phone}<br />
                        ✍️ {client.notes}
                    </li>
                ))}
            </ul>

            <h2>➕ Ajouter un client</h2>
            <input
                type="text"
                placeholder="Nom"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
            <br />
            <input
                type="text"
                placeholder="Téléphone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            <br />
            <input
                type="text"
                placeholder="Notes"
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
            />
            <br />
            <button onClick={handleAddClient} style={{ marginTop: "1rem" }}>
                Ajouter
            </button>
        </main>
    );
}


