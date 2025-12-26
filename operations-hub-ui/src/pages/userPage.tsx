import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { getUsers, createUser, deleteUser } from "../api/usersApi";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (): Promise<void> => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const handleAddUser = async (): Promise<void> => {
    if (!username || !email) return;

    await createUser({ username, email });
    setUsername("");
    setEmail("");
    loadUsers();
  };

  const handleDeleteUser = async (id: number): Promise<void> => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Users</h2>

      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>
              {user.username} ({user.email})
            </span>
            <button onClick={() => handleDeleteUser(user.id)}>❌</button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Add User</h3>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default UsersPage;
