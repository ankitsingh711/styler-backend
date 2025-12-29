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
    SimpleGrid,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconCalendar,
    IconClock,
    IconScissors,
    IconLogout,
    IconCalendarEvent,
    IconCheck,
    IconTrendingUp,
    IconStar,
    IconChartBar,
    IconCamera,
    IconUpload,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const Profile = () => {
    const [appointments, setAppointments] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user, logout, updateProfile } = useAuth(); // Assuming updateProfile exists in AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [appointmentsRes, profileRes] = await Promise.all([
                bookingService.getUserAppointments(),
                userService.getProfile()
            ]);

            setAppointments(appointmentsRes.data || appointmentsRes || []);
            setUserProfile(profileRes.data);

            if (profileRes.data?.profilePicture) {
                setImagePreview(profileRes.data.profilePicture);
            }
        } catch (error) {
            console.error('Error loading data:', error);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadImage = async () => {
        if (!profileImage) return;

        setUploading(true);
        try {
            const response = await userService.uploadProfilePicture(profileImage);

            if (response.success) {
                // Update local state
                const newProfilePic = response.data.profilePicture;
                setImagePreview(newProfilePic);
                setProfileImage(null); // Clear selected file

                // Update user profile in context if possible
                if (updateProfile) {
                    updateProfile({ profilePicture: newProfilePic });
                }

                // Refresh profile data
                const profileRes = await userService.getProfile();
                setUserProfile(profileRes.data);

                alert('Profile picture uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Calculate stats
    const stats = {
        total: appointments.length,
        upcoming: appointments.filter(a => a.status === 'Approved' || a.status === 'Pending').length,
        completed: appointments.filter(a => a.status === 'Complete').length,
    };

    const statsData = [
        { icon: <IconCalendarEvent size={28} />, label: 'Total Bookings', value: stats.total, color: '#f59e0b' },
        { icon: <IconTrendingUp size={28} />, label: 'Upcoming', value: stats.upcoming, color: '#3b82f6' },
        { icon: <IconCheck size={28} />, label: 'Completed', value: stats.completed, color: '#10b981' },
        { icon: <IconStar size={28} />, label: 'Rating', value: '4.9', color: '#8b5cf6' },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                style={{
                    minHeight: '40vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    overflow: 'hidden',
                }}
            >
                {/* Background Pattern */}
                <Box
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                    }}
                />

                <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Group>
                            <Box style={{ position: 'relative' }}>
                                <Box
                                    style={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        borderRadius: '50%',
                                        padding: 4,
                                    }}
                                >
                                    <Avatar
                                        size={100}
                                        src={imagePreview}
                                        style={{
                                            backgroundColor: 'white',
                                            color: '#f59e0b',
                                            fontSize: rem(48),
                                            fontWeight: 900,
                                        }}
                                    >
                                        {!imagePreview && (user?.userName?.[0]?.toUpperCase() || 'U')}
                                    </Avatar>
                                </Box>
                                <Box
                                    component="label"
                                    htmlFor="profile-upload"
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        border: '3px solid #1e293b',
                                        transition: 'transform 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <IconCamera size={18} color="white" />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Title
                                    order={1}
                                    style={{
                                        fontSize: rem(42),
                                        fontWeight: 900,
                                        color: 'white',
                                        marginBottom: rem(8),
                                    }}
                                >
                                    {user?.userName || 'User'}
                                </Title>
                                <Text size="lg" c="dimmed" mb="xs">
                                    {user?.email}
                                </Text>
                                <Group gap="xs">
                                    <Badge size="lg" variant="light" color="amber">
                                        Premium Member
                                    </Badge>
                                    {profileImage && (
                                        <Button
                                            size="xs"
                                            color="amber"
                                            leftSection={<IconUpload size={14} />}
                                            onClick={handleUploadImage}
                                            loading={uploading}
                                            styles={{
                                                root: {
                                                    fontWeight: 700,
                                                },
                                            }}
                                        >
                                            Upload
                                        </Button>
                                    )}
                                </Group>
                            </Box>
                        </Group>
                    </MotionBox>
                </Container>
            </Box>

            {/* Stats Cards */}
            <Box style={{ marginTop: rem(-50), position: 'relative', zIndex: 10 }}>
                <Container size="xl">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
                        {statsData.map((stat, index) => (
                            <MotionPaper
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                shadow="lg"
                                p="xl"
                                radius="lg"
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid rgba(0, 0, 0, 0.05)',
                                }}
                            >
                                <Group justify="space-between" mb="md">
                                    <Box
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: rem(12),
                                            backgroundColor: `${stat.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: stat.color,
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Group>
                                <Title order={2} fw={900} mb="xs">
                                    {stat.value}
                                </Title>
                                <Text size="sm" c="dimmed" fw={600}>
                                    {stat.label}
                                </Text>
                            </MotionPaper>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Main Content */}
            <Box style={{ backgroundColor: '#f8f9fa', paddingTop: rem(64), paddingBottom: rem(64) }}>
                <Container size="xl">
                    <Grid gutter="xl">
                        {/* User Info Card */}
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <MotionBox
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Paper shadow="md" p="xl" radius="lg">
                                    <Title order={3} fw={800} mb="md">
                                        Personal Information
                                    </Title>
                                    <Divider mb="lg" />

                                    <Stack gap="xl">
                                        <Box>
                                            <Group gap="xs" mb="xs">
                                                <Box
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: rem(8),
                                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <IconUser size={18} color="#f59e0b" />
                                                </Box>
                                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                                                    Full Name
                                                </Text>
                                            </Group>
                                            <Text fw={600} size="md" ml={40}>
                                                {user?.userName || 'User'}
                                            </Text>
                                        </Box>

                                        <Box>
                                            <Group gap="xs" mb="xs">
                                                <Box
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: rem(8),
                                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <IconMail size={18} color="#f59e0b" />
                                                </Box>
                                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                                                    Email Address
                                                </Text>
                                            </Group>
                                            <Text fw={600} size="md" ml={40}>
                                                {user?.email}
                                            </Text>
                                        </Box>

                                        <Box>
                                            <Group gap="xs" mb="xs">
                                                <Box
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: rem(8),
                                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <IconChartBar size={18} color="#f59e0b" />
                                                </Box>
                                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                                                    Member Since
                                                </Text>
                                            </Group>
                                            <Text fw={600} size="md" ml={40}>
                                                {new Date().getFullYear()}
                                            </Text>
                                        </Box>
                                    </Stack>

                                    <Button
                                        fullWidth
                                        variant="light"
                                        color="red"
                                        leftSection={<IconLogout size={18} />}
                                        onClick={handleLogout}
                                        mt="xl"
                                        size="md"
                                        styles={{
                                            root: {
                                                fontWeight: 700,
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
                                <Group justify="space-between" mb="xl">
                                    <Title order={3} fw={800}>
                                        My Appointments
                                    </Title>
                                    <Button
                                        color="amber"
                                        leftSection={<IconCalendarEvent size={18} />}
                                        onClick={() => navigate('/services')}
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
                                        Book New
                                    </Button>
                                </Group>

                                {loading ? (
                                    <Stack gap="md">
                                        {[1, 2, 3].map((item) => (
                                            <Skeleton key={item} height={220} radius="lg" />
                                        ))}
                                    </Stack>
                                ) : appointments.length > 0 ? (
                                    <AnimatePresence>
                                        <Stack gap="lg">
                                            {appointments.map((appointment, index) => (
                                                <MotionCard
                                                    key={appointment._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                                    whileHover={{ y: -4 }}
                                                    shadow="md"
                                                    padding="xl"
                                                    radius="lg"
                                                    style={{
                                                        border: '1px solid rgba(0, 0, 0, 0.05)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <Group justify="space-between" mb="lg">
                                                        <Group>
                                                            <Box
                                                                style={{
                                                                    width: 48,
                                                                    height: 48,
                                                                    borderRadius: rem(12),
                                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: 'white',
                                                                }}
                                                            >
                                                                <IconScissors size={24} />
                                                            </Box>
                                                            <Box>
                                                                <Text fw={700} size="lg">
                                                                    #{appointment._id?.slice(-6)}
                                                                </Text>
                                                                <Text size="xs" c="dimmed">
                                                                    Appointment ID
                                                                </Text>
                                                            </Box>
                                                        </Group>
                                                        <Badge
                                                            color={getStatusColor(appointment.status)}
                                                            variant="filled"
                                                            size="lg"
                                                            styles={{
                                                                root: {
                                                                    fontWeight: 700,
                                                                },
                                                            }}
                                                        >
                                                            {appointment.status || 'Pending'}
                                                        </Badge>
                                                    </Group>

                                                    <Grid>
                                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                                            <Stack gap="md">
                                                                <Box>
                                                                    <Group gap="xs" mb={4}>
                                                                        <IconUser size={16} opacity={0.6} />
                                                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                            Styler
                                                                        </Text>
                                                                    </Group>
                                                                    <Text fw={600} size="md">
                                                                        {appointment.styler?.name || appointment.stylerName || 'N/A'}
                                                                    </Text>
                                                                </Box>

                                                                <Box>
                                                                    <Group gap="xs" mb={4}>
                                                                        <IconScissors size={16} opacity={0.6} />
                                                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                            Service
                                                                        </Text>
                                                                    </Group>
                                                                    <Text fw={600} size="md">
                                                                        {appointment.service?.name || appointment.serviceName || 'N/A'}
                                                                    </Text>
                                                                </Box>
                                                            </Stack>
                                                        </Grid.Col>

                                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                                            <Stack gap="md">
                                                                <Box>
                                                                    <Group gap="xs" mb={4}>
                                                                        <IconCalendar size={16} opacity={0.6} />
                                                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                            Date
                                                                        </Text>
                                                                    </Group>
                                                                    <Text fw={600} size="md">
                                                                        {formatDate(appointment.date)}
                                                                    </Text>
                                                                </Box>

                                                                <Box>
                                                                    <Group gap="xs" mb={4}>
                                                                        <IconClock size={16} opacity={0.6} />
                                                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                                            Time
                                                                        </Text>
                                                                    </Group>
                                                                    <Text fw={600} size="md">
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
                                        shadow="sm"
                                        style={{
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)',
                                        }}
                                    >
                                        <IconCalendarEvent size={80} color="#cbd5e1" style={{ margin: '0 auto', marginBottom: rem(16) }} />
                                        <Title order={3} fw={800} mb="xs">
                                            No Appointments Yet
                                        </Title>
                                        <Text c="dimmed" mb="xl" maw={400} mx="auto">
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
                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                                    },
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
        </Box>
    );
};

export default Profile;
