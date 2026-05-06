import { useEffect, useState } from 'react';
import { getProfile } from '../api/profileApi';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(user.id);
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Profile</h1>
          <p className="page-subheader">Your student account details.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-student-600"></div>
          </div>
        ) : profile ? (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-1">Account Information</h2>
            <p className="text-sm text-gray-500 mb-6">Your personal details and role.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-student-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-student-700">{profile.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg font-medium text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <span className="badge bg-student-100 text-student-700">{profile.role}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-lg font-medium text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center text-gray-500">No profile data available.</div>
        )}
      </main>
    </div>
  );
};

export default Profile;