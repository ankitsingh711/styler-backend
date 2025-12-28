import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useScrollTrigger,
    Slide,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard,
    Person,
    Logout,
    Home,
    Info,
    ContentCut,
    Login as LoginIcon,
    AppRegistration,
} from '@mui/icons-material';

// Hide AppBar on scroll
function HideOnScroll({ children }) {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleCloseUserMenu();
        setMobileOpen(false);
    };

    // Navigation items based on auth state
    const getNavItems = () => {
        if (!isAuthenticated()) {
            return [];  // No navigation items when not logged in
        }

        const baseItems = [
            { label: 'Home', path: '/', icon: <Home /> },
            { label: 'About', path: '/about', icon: <Info /> },
            { label: 'Services', path: '/services', icon: <ContentCut /> },
        ];

        if (isAdmin()) {
            baseItems.push({ label: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard /> });
        } else {
            baseItems.push({ label: 'My Profile', path: '/profile', icon: <Person /> });
        }

        return baseItems;
    };

    const navItems = getNavItems();

    // User menu items
    const userMenuItems = isAdmin()
        ? [
            { label: 'Dashboard', icon: <Dashboard />, action: () => handleNavigation('/admin/dashboard') },
            { label: 'Logout', icon: <Logout />, action: handleLogout },
        ]
        : [
            { label: 'My Profile', icon: <Person />, action: () => handleNavigation('/profile') },
            { label: 'Logout', icon: <Logout />, action: handleLogout },
        ];

    // Mobile drawer content
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ width: 280 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                    src="/images/styler-logo.png"
                    alt="Styler"
                    style={{ height: 40, width: 'auto' }}
                />
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
                                {item.icon}
                                <ListItemText primary={item.label} />
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <HideOnScroll>
                <AppBar
                    position="sticky"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        color: 'text.primary',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            {/* Logo - Desktop */}
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate('/')}
                            >
                                <img
                                    src="/images/styler-logo.png"
                                    alt="Styler"
                                    style={{ height: 45, width: 'auto', marginRight: 16 }}
                                />
                            </Box>

                            {/* Mobile Menu Icon */}
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    onClick={handleDrawerToggle}
                                    color="inherit"
                                    aria-label="menu"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>

                            {/* Logo - Mobile */}
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src="/images/styler-logo.png"
                                    alt="Styler"
                                    style={{ height: 40, width: 'auto' }}
                                />
                            </Box>

                            {/* Desktop Navigation */}
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1, ml: 4 }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        component={Link}
                                        to={item.path}
                                        startIcon={item.icon}
                                        sx={{
                                            color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                                            fontWeight: location.pathname === item.path ? 700 : 600,
                                            px: 2,
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                            },
                                            transition: 'all 0.3s',
                                            borderRadius: 2,
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>

                            {/* Get Started Button for non-authenticated users */}
                            {!isAuthenticated() && (
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        fontWeight: 700,
                                        px: 3,
                                    }}
                                >
                                    Get Started
                                </Button>
                            )}

                            {/* User Menu */}
                            {isAuthenticated() && (
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Account settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'secondary.main',
                                                    width: 40,
                                                    height: 40,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {user?.userName?.[0]?.toUpperCase() || 'U'}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Signed in as
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                                {user?.userName || user?.email}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        {userMenuItems.map((item) => (
                                            <MenuItem
                                                key={item.label}
                                                onClick={item.action}
                                                sx={{ gap: 1.5, py: 1.5 }}
                                            >
                                                {item.icon}
                                                <Typography textAlign="center">{item.label}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            )}
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
