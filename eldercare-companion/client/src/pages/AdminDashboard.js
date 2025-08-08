import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChange } from './services/auth';
import AdminSidebar from '../components/AdminSidebar';
import BookingsTable from '../components/BookingsTable';
import CaregiversTable from '../components/CaregiversTable';
import StatsOverview from '../components/StatsOverview';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (!user || !user.email.endsWith('@eldercare.com')) {
        navigate('/login');
      } else {
        setUser(user);
        // Fetch data
        fetchBookings();
        fetchCaregivers();
      }
    });

    return unsubscribe;
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const response = await fetch('/api/admin/caregivers');
      const data = await response.json();
      setCaregivers(data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <>
            <h1>Admin Dashboard</h1>
            <StatsOverview bookings={bookings} caregivers={caregivers} />
          </>
        )}
        
        {activeTab === 'bookings' && (
          <>
            <h1>Manage Bookings</h1>
            <BookingsTable bookings={bookings} refreshData={fetchBookings} />
          </>
        )}
        
        {activeTab === 'caregivers' && (
          <>
            <h1>Manage Caregivers</h1>
            <CaregiversTable caregivers={caregivers} refreshData={fetchCaregivers} />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;