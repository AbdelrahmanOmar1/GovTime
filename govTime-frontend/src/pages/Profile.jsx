// import React from "react";
import { useState, useEffect } from "react";
import Sidenav from "../components/Sidenav";
import api from "../axiosConfig";
export default function ProfilePage() {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${localStorage.getItem("user")}`, 
          { withCredentials: true } 
        );
        
        
        setUser(res.data.data.user);
      } catch (err) {
        console.error(err);
        // redirect if not logged in
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found</p>;
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidenav />

      <div className="ml-64 p-10">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          {user.full_name} Profile
        </h1>

        <div className="bg-white p-6 mb-10 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{user.full_name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold 
                ${user.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {user.verified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileItem label="Full Name" value={user.full_name} />
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="Phone" value={user.phone} />
          <ProfileItem label="National ID" value={user.national_id} />
          <ProfileItem label="Place of Birth" value={user.place_birth} />
          <ProfileItem label="Address" value={user.address} />
          <ProfileItem
            label="Date of Birth"
            value={user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "—"}
          />
          <ProfileItem
            label="National ID Expiry Date"
            value={user.nationalID_expiry_date ? new Date(user.nationalID_expiry_date).toLocaleDateString() : "—"}
          />
          <ProfileItem
            label="Verified"
            value={
              <span className={user.verified ? "text-green-600" : "text-red-600"}>
                {user.verified ? "Yes" : "Not Verified"}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <p className="text-gray-500 text-xs uppercase font-medium tracking-wider">{label}</p>
      <p className="text-lg font-semibold mt-1 text-gray-800">{value}</p>
    </div>
  );
}
