import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Layout,
    Button,
    Dropdown,
    Avatar,
    Drawer,
    Menu as AntMenu,
    Space,
    Typography,
    Divider,
} from 'antd';
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

const { Header } = Layout;
const { Text } = Typography;

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

    const closeMobile = () => setMobileOpen(false);
    const toggleMobile = () => setMobileOpen(!mobileOpen);

    // Navigation items
    const getNavItems = () => {
        const baseItems = [
            { label: 'Home', path: '/', icon: <HomeOutlined /> },
            { label: 'About', path: '/about', icon: <InfoCircleOutlined /> },
            { label: 'Services', path: '/services', icon: <ScissorOutlined /> },
        ];

        if (isAuthenticated()) {
            if (isAdmin()) {
                baseItems.push({ label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlined /> });
            } else {
                baseItems.push({ label: 'My Profile', path: '/profile', icon: <UserOutlined /> });
            }
        }

        return baseItems;
    };

    const navItems = getNavItems();

    // User dropdown menu items
    const userMenuItems = [
        {
            key: 'user-info',
            label: (
                <div className="user-menu-header">
                    <Text type="secondary" style={{ fontSize: 12 }}>Signed in as</Text>
                    <Text strong>{user?.userName || user?.email}</Text>
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
            <Header className="navbar-header">
                <div className="navbar-container">
                    {/* Mobile Menu Button */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={toggleMobile}
                        className="mobile-menu-btn"
                    />

                    {/* Logo - Desktop */}
                    <div
                        className="logo-desktop"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="/images/styler-logo.png"
                            alt="Styler"
                            className="logo-img"
                        />
                    </div>

                    {/* Logo - Mobile */}
                    <div className="logo-mobile">
                        <img
                            src="/images/styler-logo.png"
                            alt="Styler"
                            className="logo-img-mobile"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-links-desktop">
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

                    {/* Get Started Button - Non-authenticated */}
                    {!isAuthenticated() && (
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            onClick={() => navigate('/login')}
                            className="get-started-btn"
                        >
                            Get Started
                        </Button>
                    )}

                    {/* User Menu - Authenticated */}
                    {isAuthenticated() && (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Avatar
                                src={user?.profilePicture}
                                size="default"
                                className="user-avatar"
                            >
                                {user?.userName?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                        </Dropdown>
                    )}
                </div>
            </Header>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <img
                        src="/images/styler-logo.png"
                        alt="Styler"
                        style={{ height: 40, width: 'auto' }}
                    />
                }
                placement="left"
                onClose={closeMobile}
                open={mobileOpen}
                width={280}
                className="mobile-drawer"
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <AntMenu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={mobileMenuItems}
                        className="mobile-menu"
                    />

                    <Divider />

                    {/* Mobile Login/Logout */}
                    {!isAuthenticated() ? (
                        <Button
                            type="primary"
                            block
                            icon={<LoginOutlined />}
                            onClick={() => {
                                handleNavigation('/login');
                            }}
                        >
                            Get Started
                        </Button>
                    ) : (
                        <Button
                            danger
                            block
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}
                </Space>
            </Drawer>
        </>
    );
};

export default Navbar;
