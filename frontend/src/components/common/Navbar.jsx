import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    AppShell,
    Box,
    Burger,
    Button,
    Container,
    Group,
    Menu,
    Avatar,
    Text,
    Drawer,
    Stack,
    NavLink,
    Divider,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconMenu2,
    IconUserCircle,
    IconDashboard,
    IconUser,
    IconLogout,
    IconHome,
    IconInfoCircle,
    IconScissors,
    IconLogin,
} from '@tabler/icons-react';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
        closeMobile();
    };

    // Navigation items - always visible
    const getNavItems = () => {
        const baseItems = [
            { label: 'Home', path: '/', icon: <IconHome size={20} /> },
            { label: 'About', path: '/about', icon: <IconInfoCircle size={20} /> },
            { label: 'Services', path: '/services', icon: <IconScissors size={20} /> },
        ];

        // Add authenticated-only items
        if (isAuthenticated()) {
            if (isAdmin()) {
                baseItems.push({ label: 'Dashboard', path: '/admin/dashboard', icon: <IconDashboard size={20} /> });
            } else {
                baseItems.push({ label: 'My Profile', path: '/profile', icon: <IconUser size={20} /> });
            }
        }

        return baseItems;
    };

    const navItems = getNavItems();

    return (
        <>
            <Box
                component="header"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Container size="xl">
                    <Group h={70} justify="space-between">
                        {/* Logo - Desktop */}
                        <Box
                            visibleFrom="md"
                            onClick={() => navigate('/')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                style={{ height: 45, width: 'auto' }}
                            />
                        </Box>

                        {/* Mobile Menu Button */}
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom="md"
                            size="sm"
                            color="white"
                        />

                        {/* Logo - Mobile */}
                        <Box
                            hiddenFrom="md"
                            style={{ flex: 1, textAlign: 'center' }}
                        >
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                style={{ height: 40, width: 'auto' }}
                            />
                        </Box>

                        {/* Desktop Navigation */}
                        <Group gap="xs" visibleFrom="md" style={{ flex: 1, marginLeft: rem(32) }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    to={item.path}
                                    variant={location.pathname === item.path ? 'light' : 'subtle'}
                                    color={location.pathname === item.path ? 'amber' : 'gray'}
                                    leftSection={item.icon}
                                    styles={{
                                        root: {
                                            fontWeight: location.pathname === item.path ? 700 : 600,
                                            color: location.pathname === item.path ? '#f59e0b' : 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                color: '#f59e0b',
                                            },
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Group>

                        {/* Get Started Button - Non-authenticated */}
                        {!isAuthenticated() && (
                            <Button
                                component={Link}
                                to="/login"
                                color="amber"
                                variant="filled"
                                visibleFrom="md"
                                leftSection={<IconLogin size={18} />}
                                styles={{
                                    root: {
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                        },
                                    },
                                }}
                            >
                                Get Started
                            </Button>
                        )}

                        {/* User Menu - Authenticated */}
                        {isAuthenticated() && (
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Avatar
                                        src={user?.profilePicture}
                                        color="amber"
                                        size="md"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {user?.userName?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Box px="sm" py="xs">
                                        <Text size="xs" c="dimmed">
                                            Signed in as
                                        </Text>
                                        <Text size="sm" fw={600}>
                                            {user?.userName || user?.email}
                                        </Text>
                                    </Box>
                                    <Menu.Divider />
                                    {isAdmin() ? (
                                        <Menu.Item
                                            leftSection={<IconDashboard size={16} />}
                                            onClick={() => handleNavigation('/admin/dashboard')}
                                        >
                                            Dashboard
                                        </Menu.Item>
                                    ) : (
                                        <Menu.Item
                                            leftSection={<IconUser size={16} />}
                                            onClick={() => handleNavigation('/profile')}
                                        >
                                            My Profile
                                        </Menu.Item>
                                    )}
                                    <Menu.Item
                                        leftSection={<IconLogout size={16} />}
                                        color="red"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )}
                    </Group>
                </Container>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                opened={mobileOpened}
                onClose={closeMobile}
                size="280px"
                padding="md"
                title={
                    <img
                        src="/images/styler-logo.png"
                        alt="Styler"
                        style={{ height: 40, width: 'auto' }}
                    />
                }
                hiddenFrom="md"
                zIndex={1000000}
            >
                <Stack>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            component={Link}
                            to={item.path}
                            label={item.label}
                            leftSection={item.icon}
                            active={location.pathname === item.path}
                            onClick={closeMobile}
                            styles={{
                                root: {
                                    borderRadius: rem(8),
                                },
                            }}
                        />
                    ))}

                    <Divider my="sm" />

                    {/* Mobile Login/Logout */}
                    {!isAuthenticated() ? (
                        <Button
                            component={Link}
                            to="/login"
                            color="amber"
                            fullWidth
                            leftSection={<IconLogin size={18} />}
                            onClick={closeMobile}
                            styles={{
                                root: {
                                    fontWeight: 700,
                                },
                            }}
                        >
                            Get Started
                        </Button>
                    ) : (
                        <Button
                            color="red"
                            variant="light"
                            fullWidth
                            leftSection={<IconLogout size={18} />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}
                </Stack>
            </Drawer>
        </>
    );
};

export default Navbar;

