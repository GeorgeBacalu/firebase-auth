import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Card from "./Card";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersData = async () =>
      auth.onAuthStateChanged(async user => {
        if (user) {
          const usersCollectionRef = collection(db, "users");
          const adminsCollectionRef = collection(db, "admins");
          const usersSnap = await getDocs(usersCollectionRef);
          const adminsSnap = await getDocs(adminsCollectionRef);
          const allUsersSnap = [
            ...usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), role: "user" })),
            ...adminsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), role: "admin" }))
          ];
          setUsers(allUsersSnap);
        } else {
          navigate("/login");
        }
      })
      fetchUsersData();
  }, [navigate]);

  const handleChangedRole = async (id, newRole) => {
    const user = users.find(u => u.id === id)
    if (!user) return;
    const oldRoleCollection = user.role === "user" ? "users" : "admins";
    const newRoleCollection = newRole === "user" ? "users" : "admins";
    if (oldRoleCollection === newRoleCollection) {
      console.log("No role change required");
      return;
    }
    const newRoleRef = doc(db, newRoleCollection, id);
    const oldRoleRef = doc(db, oldRoleCollection, id);
    try {
      await setDoc(newRoleRef, { fullName: user.fullName, email: user.email });
      await deleteDoc(oldRoleRef);
      setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
      toast.success("Role updated successfully for user", user.fullName);
    }
    catch (error) {
      console.error("Error updating role", error);
      toast.error("Error updating role: " + error.message);
    }
  };

  return (
    <ul className="p-3">
      <div className="d-flex flex-wrap justify-content-start gap-3">
        {users.map(user => <Card key={user.id} {...user} onChangedRole={handleChangedRole} />)}
      </div>
    </ul>
  )
}