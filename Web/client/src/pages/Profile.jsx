import React, { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    postalCode: "12345",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-[8rem]">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(userData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                />
              ) : (
                <p className="p-2 border rounded-lg bg-gray-50">{value}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-yellow-950 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-950 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
