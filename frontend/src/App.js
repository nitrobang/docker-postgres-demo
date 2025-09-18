import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState(""); // 👈 for form input

  // Fetch users
  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError(err.message);
      });
  }, []);

  // Handle adding a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const newUser = await res.json();
      setUsers([...users, newUser]); // update UI
      setName(""); // clear form
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users from Backend and deploy is workingggg!!!</h1>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
