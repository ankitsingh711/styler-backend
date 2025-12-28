import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Title,
    Text,
    Paper,
    Grid,
    Avatar,
    Divider,
    Card,
    Badge,
    Button,
    Stack,
    Skeleton,
    Group,
    rem,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconCalendar,
    IconClock,
    IconScissors,
    IconLogout,
    IconCalendarEvent,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

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

    const getStatusColor = (status) => {
        const statusMap = {
            'Pending': 'yellow',
            'Complete': 'green',
            'Approved': 'blue',
            'Cancel': 'red',
        };
        return statusMap[status] || 'gray';
    };

    return (
        <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: rem(32), paddingBottom: rem(32) }}>
            {/* Header */}
            <Box
                style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    paddingTop: rem(48),
                    paddingBottom: rem(48),
                    marginBottom: rem(32),
                }}
            >
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Group>
                            <Avatar
                                size="xl"
                                color="amber"
                                styles={{
                                    root: {
                                        fontSize: rem(48),
                                        fontWeight: 800,
                                    },
                                }}
                            >
                                {user?.userName?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                                <Title order={2} fw={800} c="white" mb="xs">
                                    {user?.userName || 'User'}
                                </Title>
                                <Text size="lg" c="white" opacity={0.9}>
                                    {user?.email}
                                </Text>
                            </Box>
                        </Group>
                    </MotionBox>
                </Container>
            </Box>

            <Container>
                <Grid gutter="xl">
                    {/* User Info Card */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Paper shadow="sm" p="xl" radius="lg">
                                <Title order={4} fw={700} mb="md">
                                    Personal Information
                                </Title>
                                <Divider mb="md" />

                                <Stack gap="lg">
                                    <Box>
                                        <Group gap="xs" mb="xs">
                                            <IconUser size={20} color="#f59e0b" />
                                            <Text size="sm" c="dimmed" fw={600}>
                                                FULL NAME
                                            </Text>
                                        </Group>
                                        <Text fw={600}>
                                            {user?.userName || 'User'}
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Group gap="xs" mb="xs">
                                            <IconMail size={20} color="#f59e0b" />
                                            <Text size="sm" c="dimmed" fw={600}>
                                                EMAIL ADDRESS
                                            </Text>
                                        </Group>
                                        <Text fw={600}>
                                            {user?.email}
                                        </Text>
                                    </Box>
                                </Stack>

                                <Button
                                    fullWidth
                                    variant="outline"
                                    color="red"
                                    leftSection={<IconLogout size={16} />}
                                    onClick={handleLogout}
                                    mt="xl"
                                    styles={{
                                        root: {
                                            fontWeight: 600,
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </Paper>
                        </MotionBox>
                    </Grid.Col>

                    {/* Appointments Section */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Group justify="space-between" mb="lg">
                                <Title order={3} fw={700}>
                                    My Appointments
                                </Title>
                                <Button
                                    color="amber"
                                    leftSection={<IconCalendarEvent size={16} />}
                                    onClick={() => navigate('/services')}
                                    styles={{
                                        root: {
                                            fontWeight: 600,
                                        },
                                    }}
                                >
                                    Book New
                                </Button>
                            </Group>

                            {loading ? (
                                <Stack gap="md">
                                    {[1, 2, 3].map((item) => (
                                        <Skeleton key={item} height={200} radius="lg" />
                                    ))}
                                </Stack>
                            ) : appointments.length > 0 ? (
                                <AnimatePresence>
                                    <Stack gap="md">
                                        {appointments.map((appointment, index) => (
                                            <MotionCard
                                                key={appointment._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                shadow="sm"
                                                padding="lg"
                                                radius="lg"
                                                withBorder
                                            >
                                                <Box
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)',
                                                        padding: rem(16),
                                                        marginBottom: rem(16),
                                                        borderRadius: rem(8),
                                                    }}
                                                >
                                                    <Group justify="space-between">
                                                        <Text fw={700} size="lg">
                                                            Appointment #{appointment._id?.slice(-6)}
                                                        </Text>
                                                        <Badge
                                                            color={getStatusColor(appointment.status)}
                                                            variant="filled"
                                                            size="lg"
                                                        >
                                                            {appointment.status || 'Pending'}
                                                        </Badge>
                                                    </Group>
                                                </Box>

                                                <Grid>
                                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                                        <Stack gap="md">
                                                            <Box>
                                                                <Group gap="xs" mb="xs">
                                                                    <IconUser size={20} opacity={0.7} />
                                                                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                        Styler
                                                                    </Text>
                                                                </Group>
                                                                <Text fw={600}>
                                                                    {appointment.styler?.name || appointment.stylerName || 'N/A'}
                                                                </Text>
                                                            </Box>

                                                            <Box>
                                                                <Group gap="xs" mb="xs">
                                                                    <IconScissors size={20} opacity={0.7} />
                                                                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                        Service
                                                                    </Text>
                                                                </Group>
                                                                <Text fw={600}>
                                                                    {appointment.service?.name || appointment.serviceName || 'N/A'}
                                                                </Text>
                                                            </Box>
                                                        </Stack>
                                                    </Grid.Col>

                                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                                        <Stack gap="md">
                                                            <Box>
                                                                <Group gap="xs" mb="xs">
                                                                    <IconCalendar size={20} opacity={0.7} />
                                                                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                        Date
                                                                    </Text>
                                                                </Group>
                                                                <Text fw={600}>
                                                                    {formatDate(appointment.date)}
                                                                </Text>
                                                            </Box>

                                                            <Box>
                                                                <Group gap="xs" mb="xs">
                                                                    <IconClock size={20} opacity={0.7} />
                                                                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                        Time
                                                                    </Text>
                                                                </Group>
                                                                <Text fw={600}>
                                                                    {appointment.time || 'N/A'}
                                                                </Text>
                                                            </Box>
                                                        </Stack>
                                                    </Grid.Col>
                                                </Grid>
                                            </MotionCard>
                                        ))}
                                    </Stack>
                                </AnimatePresence>
                            ) : (
                                <Paper
                                    p="xl"
                                    radius="lg"
                                    style={{
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.03) 0%, rgba(245, 158, 11, 0.03) 100%)',
                                    }}
                                >
                                    <IconCalendarEvent size={80} opacity={0.5} style={{ margin: '0 auto', marginBottom: rem(16) }} />
                                    <Title order={4} fw={700} mb="xs">
                                        No Appointments Yet
                                    </Title>
                                    <Text c="dimmed" mb="xl">
                                        You haven't booked any appointments. Start your grooming journey today!
                                    </Text>
                                    <Button
                                        color="amber"
                                        size="lg"
                                        onClick={() => navigate('/services')}
                                        leftSection={<IconCalendarEvent size={20} />}
                                        styles={{
                                            root: {
                                                fontWeight: 700,
                                            },
                                        }}
                                    >
                                        Book an Appointment
                                    </Button>
                                </Paper>
                            )}
                        </MotionBox>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
