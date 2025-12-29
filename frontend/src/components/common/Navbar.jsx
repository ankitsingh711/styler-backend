import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Dropdown, Avatar, Drawer, Menu as AntMenu, Space } from 'antd';
import {
    MenuOutlined,
    UserOutlined,
    DashboardOutlined,
    LogoutOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    ScissorOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeOutlined /> },
        { label: 'About', path: '/about', icon: <InfoCircleOutlined /> },
        { label: 'Services', path: '/services', icon: <ScissorOutlined /> },
    ];

    // User dropdown menu
    const userMenuItems = [
        {
            key: 'user-info',
            label: (
                <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Signed in as</div>
                    <div style={{ color: 'white', fontWeight: 600 }}>{user?.userName || user?.email}</div>
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        isAdmin()
            ? {
                key: 'dashboard',
                label: 'Dashboard',
                icon: <DashboardOutlined />,
                onClick: () => handleNavigation('/admin/dashboard'),
            }
            : {
                key: 'profile',
                label: 'My Profile',
                icon: <UserOutlined />,
                onClick: () => handleNavigation('/profile'),
            },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    // Mobile menu items
    const mobileMenuItems = navItems.map(item => ({
        key: item.path,
        label: item.label,
        icon: item.icon,
        onClick: () => handleNavigation(item.path),
    }));

    return (
        <>
            {/* Desktop & Mobile Navbar */}
            <nav className="styler-navbar">
                <div className="navbar-container">
                    {/* Mobile Menu Button */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileOpen(true)}
                        className="mobile-menu-toggle"
                    />

                    {/* Logo */}
                    <div className="navbar-logo" onClick={() => navigate('/')}>
                        <ScissorOutlined className="logo-icon" />
                        <span className="logo-text">STYLER</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="navbar-links">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="navbar-actions">
                        {!isAuthenticated() ? (
                            <Button
                                type="primary"
                                icon={<LoginOutlined />}
                                onClick={() => navigate('/login')}
                                className="get-started-btn"
                            >
                                Get Started
                            </Button>
                        ) : (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                trigger={['click']}
                                placement="bottomRight"
                                overlayClassName="user-dropdown"
                            >
                                <div className="user-avatar-wrapper">
                                    <Avatar
                                        src={user?.profilePicture}
                                        size={40}
                                        className="user-avatar"
                                    >
                                        {user?.userName?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                </div>
                            </Dropdown>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <div className="mobile-drawer-header">
                        <ScissorOutlined style={{ fontSize: 24, color: '#f59e0b', marginRight: 12 }} />
                        <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>STYLER</span>
                    </div>
                }
                placement="left"
                onClose={() => setMobileOpen(false)}
                open={mobileOpen}
                width={280}
                className="mobile-nav-drawer"
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <AntMenu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={mobileMenuItems}
                        className="mobile-nav-menu"
                    />

                    {!isAuthenticated() ? (
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<LoginOutlined />}
                            onClick={() => {
                                handleNavigation('/login');
                            }}
                        >
                            Get Started
                        </Button>
                    ) : (
                        <>
                            <div className="mobile-user-info">
                                <Avatar
                                    src={user?.profilePicture}
                                    size={50}
                                    style={{ border: '3px solid #f59e0b' }}
                                >
                                    {user?.userName?.[0]?.toUpperCase() || 'U'}
                                </Avatar>
                                <div style={{ marginLeft: 12 }}>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Signed in as</div>
                                    <div style={{ fontSize: 14, color: 'white', fontWeight: 600 }}>
                                        {user?.userName || user?.email}
                                    </div>
                                </div>
                            </div>
                            <Button
                                danger
                                block
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Space>
            </Drawer>
        </>
    );
};

export default Navbar;
