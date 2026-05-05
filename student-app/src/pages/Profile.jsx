import { useEffect, useState } from 'react';
import { getProfile } from '../api/profileApi';
import { useAuthStore } from '../store/authStore';
import RoleBadge from '../components/RoleBadge';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(user.id);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Your student account details are shown below.</p>
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D9E75]"></div>
            </div>
          ) : profile ? (
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <RoleBadge role={profile.role} />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">Profile not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;