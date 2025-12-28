import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaCut } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const stats = [
        { icon: <FaUsers />, title: 'Total Users', count: '150+', color: '#667eea' },
        { icon: <FaCut />, title: 'Stylers', count: '12', color: '#764ba2' },
        { icon: <FaCut />, title: 'Services', count: '25', color: '#f093fb' },
        { icon: <FaClipboardList />, title: 'Appointments', count: '350+', color: '#4facfe' },
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your salon operations</p>
            </div>

            <div className="dashboard-content">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
                            <div className="stat-icon" style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{stat.count}</h3>
                                <p>{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/admin/users" className="action-card">
                            <FaUsers />
                            <span>Manage Users</span>
                        </Link>
                        <Link to="/admin/stylers" className="action-card">
                            <FaCut />
                            <span>Manage Stylers</span>
                        </Link>
                        <Link to="/admin/services" className="action-card">
                            <FaCut />
                            <span>Manage Services</span>
                        </Link>
                        <Link to="/admin/appointments" className="action-card">
                            <FaClipboardList />
                            <span>View Appointments</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
