import React, { useEffect, useState } from "react";
import { getUser, deleteAllUsers, deleteUserById } from "../api/axios";

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      const data = await getUser();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteOne = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await deleteUserById(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete contact");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL contacts?")) return;
    try {
      await deleteAllUsers();
      setContacts([]);
    } catch {
      alert("Failed to delete all contacts");
    }
  };

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="admin-contacts">
      <div className="container">
        <h2>Contact Messages</h2>
        {contacts.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <>
            <button
              onClick={handleDeleteAll}
              style={{ marginBottom: "10px", background: "red", color: "white" }}
            >
              Delete All
            </button>
            <table border="1" cellPadding="10" width="100%">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                    <td>{c.message}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteOne(c._id)}
                        style={{ background: "crimson", color: "white" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
}
