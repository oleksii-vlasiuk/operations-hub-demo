import { useEffect, useState } from "react";
import type { User } from "../User";
import { getUsers, createUser, deleteUser } from "../usersApi";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const handleAddUser = async () => {
    if (!username || !email) return;

    await createUser({ username, email });
    setUsername("");
    setEmail("");
    loadUsers();
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Users</h1>

      <ul style={styles.list}>
        {users.map((user) => (
          <li key={user.id} style={styles.listItem}>
            <span>
              <strong>{user.username}</strong> — {user.email}
            </span>

            <button
              onClick={() => handleDeleteUser(user.id)}
              style={styles.deleteButton}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAddUser} style={styles.addButton}>
          Add User
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    fontSize: "28px",
    marginBottom: "24px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: "32px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#dc2626",
    fontSize: "16px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    flex: "1 1 200px",
    padding: "8px 10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
  },
  addButton: {
    padding: "8px 16px",
    backgroundColor: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
};

export default UsersPage;
