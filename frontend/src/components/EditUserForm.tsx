import { useState } from "react";
import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export default function EditUserForm({ user }: { user: User }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email] = useState(user.email); // make email uneditable if desired
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/edit-user`, {
        email,
        firstName,
        lastName,
        currentPassword,
        newPassword: showNewPassword ? newPassword : null,
      });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.detail || " Failed to update profile");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Edit Profile
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 w-full bg-gray-100 border rounded px-4 py-2 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {currentPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
