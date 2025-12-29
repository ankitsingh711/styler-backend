import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Row,
    Col,
    Card,
    Avatar,
    Button,
    Upload,
    Skeleton,
    Badge,
    Space,
    Divider,
    Empty,
} from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    UploadOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const { Title, Text } = Typography;
const MotionDiv = motion.div;

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const { user, logout, updateProfile } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [userData, appointmentsData] = await Promise.all([
                userService.getProfile(),
                bookingService.getUserAppointments(),
            ]);

            if (userData?.profilePicture) {
                setImagePreview(userData.profilePicture);
            }

            setAppointments(appointmentsData?.data || appointmentsData || []);
        } catch (err) {
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        const file = info.file.originFileObj || info.file;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadImage = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const result = await userService.uploadProfilePicture(selectedFile);
            success('Profile picture updated successfully!');
            setImagePreview(result.profilePicture);
            updateProfile(result);
            setSelectedFile(null);
        } catch (err) {
            error('Failed to upload profile picture');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircleOutlined />;
            case 'pending':
                return <ClockCircleOutlined />;
            case 'cancelled':
                return <CloseCircleOutlined />;
            default:
                return null;
        }
    };

    return (
        <div className="profile-page">
            {/* Hero Section */}
            <div className="profile-hero">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="profile-hero-content"
                    >
                        <Avatar
                            size={120}
                            src={imagePreview}
                            icon={<UserOutlined />}
                            className="profile-avatar"
                        />
                        <Title level={2} style={{ color: 'white', marginTop: 16 }}>
                            {user?.userName || user?.email}
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {user?.email}
                        </Text>
                    </MotionDiv>
                </div>
            </div>

            {/* Content Section */}
            <div className="profile-content-section">
                <div className="container">
                    <Row gutter={[32, 32]}>
                        {/* User Info Card */}
                        <Col xs={24} md={8}>
                            <Card className="profile-card" title="Profile Information">
                                {loading ? (
                                    <Skeleton active />
                                ) : (
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <div className="profile-upload">
                                            <Upload
                                                showUploadList={false}
                                                beforeUpload={() => false}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            >
                                                <Button icon={<UploadOutlined />} block>
                                                    Change Photo
                                                </Button>
                                            </Upload>
                                            {selectedFile && (
                                                <Button
                                                    type="primary"
                                                    onClick={handleUploadImage}
                                                    loading={uploading}
                                                    block
                                                    style={{ marginTop: 8 }}
                                                >
                                                    Upload Photo
                                                </Button>
                                            )}
                                        </div>

                                        <Divider />

                                        <div>
                                            <Text type="secondary">Email</Text>
                                            <br />
                                            <Text strong>{user?.email}</Text>
                                        </div>

                                        <div>
                                            <Text type="secondary">Member Since</Text>
                                            <br />
                                            <Text strong>
                                                {new Date().getFullYear()}
                                            </Text>
                                        </div>

                                        <Button
                                            danger
                                            icon={<LogoutOutlined />}
                                            onClick={handleLogout}
                                            block
                                        >
                                            Logout
                                        </Button>
                                    </Space>
                                )}
                            </Card>
                        </Col>

                        {/* Appointments Card */}
                        <Col xs={24} md={16}>
                            <Card className="profile-card" title="My Appointments">
                                {loading ? (
                                    <Skeleton active />
                                ) : appointments.length === 0 ? (
                                    <Empty
                                        description="No appointments yet"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    >
                                        <Button type="primary" onClick={() => navigate('/services')}>
                                            Book an Appointment
                                        </Button>
                                    </Empty>
                                ) : (
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        {appointments.map((apt) => (
                                            <Card key={apt._id} className="appointment-card">
                                                <Row gutter={[16, 16]} align="middle">
                                                    <Col flex="auto">
                                                        <Space direction="vertical" size="small">
                                                            <Text strong>{apt.service?.name || 'Service'}</Text>
                                                            <Text type="secondary">
                                                                with {apt.styler?.name || 'Styler'}
                                                            </Text>
                                                            <Space>
                                                                <CalendarOutlined />
                                                                <Text>{apt.date} at {apt.time}</Text>
                                                            </Space>
                                                        </Space>
                                                    </Col>
                                                    <Col>
                                                        <Badge
                                                            status={getStatusColor(apt.status)}
                                                            text={apt.status}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </Space>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Profile;
