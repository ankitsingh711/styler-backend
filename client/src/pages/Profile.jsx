import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const response = await bookingService.getUserAppointments();
            setAppointments(response.data || response || []);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="profile-container">
                <section className="user-info">
                    <h2>Personal Information</h2>
                    <div className="info-card">
                        <div className="info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{user?.userName || 'User'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user?.email}</span>
                        </div>
                    </div>
                </section>

                <section className="appointments-section">
                    <h2>My Appointments</h2>

                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length > 0 ? (
                        <div className="appointments-list">
                            {appointments.map((appointment) => (
                                <div key={appointment._id} className="appointment-card">
                                    <div className="appointment-header">
                                        <h3>Appointment #{appointment._id?.slice(-6)}</h3>
                                        <span className={`status ${appointment.status}`}>
                                            {appointment.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="appointment-details">
                                        <p><strong>Styler:</strong> {appointment.styler?.name || appointment.stylerName || 'N/A'}</p>
                                        <p><strong>Service:</strong> {appointment.service?.name || appointment.serviceName || 'N/A'}</p>
                                        <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                                        <p><strong>Time:</strong> {appointment.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-appointments">
                            <p>No appointments yet</p>
                            <button onClick={() => navigate('/services')} className="book-now-btn">
                                Book an Appointment
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Profile;
