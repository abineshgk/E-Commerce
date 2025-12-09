import React, { useEffect, useState } from "react";
import "./UsersList.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        alert("Please login as admin to view users.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          "auth-token": token,
        },
      });

      const data = await res.json();
      console.log("Users response:", data);

      if (data.success) {
        setUsers(data.users);
      } else {
        alert(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="userslist">Loading users...</div>;
  }

  return (
    <div className="userslist">
      <h2>Users List</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="userslist-table-wrapper">
          <table className="userslist-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersList;
