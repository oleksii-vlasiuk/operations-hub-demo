import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import {
  getUsers,
  createUser,
  disableUser,
  enableUser,
} from "../api";
import type {
  User,
  CreateUserRequest,
  UserStatus,
} from "../User";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async (status?: UserStatus) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(status);
      setUsers(response.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === "ALL") {
      loadUsers();
    } else {
      loadUsers(statusFilter);
    }
  }, [statusFilter]);

  const handleAddUser = async () => {
    if (!firstName || !lastName || !email) {
      setError("Please fill in all fields");
      return;
    }

    const request: CreateUserRequest = { email, firstName, lastName };
    try {
      setLoading(true);
      setError(null);
      await createUser(request);
      setFirstName("");
      setLastName("");
      setEmail("");
      statusFilter === "ALL" ? loadUsers() : loadUsers(statusFilter);
    } catch (e: any) {
      console.error(e);
      const backendMessage: string | undefined = e?.response?.data?.message;
      setError(backendMessage || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };


  const handleToggleStatus = async (user: User) => {
    try {
      setLoading(true);
      setError(null);

      if (user.status === "DISABLED") {
        await enableUser(user.id);
      } else {
        await disableUser(user.id);
      }

      if (statusFilter === "ALL") {
        loadUsers();
      } else {
        loadUsers(statusFilter);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Users</h1>

      <div style={styles.filterRow}>
        <span>Status:&nbsp;</span>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value === "ALL" ? "ALL" : (e.target.value as UserStatus),
            )
          }
          style={styles.select}
        >
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <ul style={styles.list}>
        {users.map((user) => (
          <li key={user.id} style={styles.listItem}>
            <div>
              <div style={styles.userName}>
                {user.firstName} {user.lastName}
              </div>
              <div style={styles.userMeta}>
                {user.email} · Role: {user.role} · Status: {user.status}
              </div>
            </div>

            <button
              onClick={() => handleToggleStatus(user)}
              style={
                user.status === "DISABLED"
                  ? styles.enableButton
                  : styles.disableButton
              }
            >
              {user.status === "DISABLED" ? "Enable" : "Disable"}
            </button>
          </li>
        ))}
      </ul>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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

const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    marginBottom: "20px",
    fontSize: "28px",
  },
  filterRow: {
    marginBottom: "20px",
    fontSize: "14px",
  },
  select: {
    padding: "4px 8px",
    fontSize: "14px",
  },
  info: {
    fontSize: "14px",
    marginBottom: "8px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "8px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: "30px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
  userName: {
    fontWeight: 600,
  },
  userMeta: {
    fontSize: "13px",
    color: "#6b7280",
  },
  disableButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  },
  enableButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  },
  form: {
    display: "flex",
    gap: "10px",
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
