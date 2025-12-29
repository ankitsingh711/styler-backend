import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Row,
    Col,
    Card,
    Select,
    Button,
    Alert,
    Skeleton,
    Steps,
    DatePicker,
    TimePicker,
    Space,
    Badge,
} from 'antd';
import {
    ScissorOutlined,
    UserOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import dayjs from 'dayjs';
import './Services.css';

const { Title, Text } = Typography;
const MotionDiv = motion.div;

const Services = () => {
    const [stylers, setStylers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedStyler, setSelectedStyler] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const { isAuthenticated } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const steps = [
        { title: 'Select Service', icon: <ScissorOutlined /> },
        { title: 'Choose Styler', icon: <UserOutlined /> },
        { title: 'Pick Date & Time', icon: <CalendarOutlined /> },
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setDataLoading(true);
        try {
            const [stylersData, servicesData] = await Promise.all([
                bookingService.getStylers(),
                bookingService.getServices(),
            ]);

            setStylers(stylersData.data || stylersData || []);
            setServices(servicesData.data || servicesData || []);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setDataLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        if (!selectedService || !selectedStyler || !selectedDate || !selectedTime) {
            error('Please complete all booking steps');
            return;
        }

        setLoading(true);
        try {
            const date = selectedDate.format('YYYY-MM-DD');
            const time = selectedTime.format('HH:mm');

            await bookingService.createAppointment({
                stylerId: selectedStyler,
                serviceId: selectedService,
                date,
                time,
            });

            success('Appointment booked successfully!');
            // Reset form
            setSelectedService(null);
            setSelectedStyler(null);
            setSelectedDate(null);
            setSelectedTime(null);
        } catch (err) {
            error(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const getActiveStep = () => {
        if (!selectedService) return 0;
        if (!selectedStyler) return 1;
        return 2;
    };

    return (
        <div className="services-page">
            {/* Hero */}
            <div className="services-hero">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge.Ribbon text="Book Your Service" color="#f59e0b" />
                        <Title level={1} className="services-title">
                            Our Services
                        </Title>
                        <Text className="services-subtitle">
                            Professional grooming and styling services tailored for you
                        </Text>
                    </MotionDiv>
                </div>
            </div>

            {/* Booking Section */}
            <div className="services-booking-section">
                <div className="container">
                    <Card className="booking-card">
                        <Steps
                            current={getActiveStep()}
                            items={steps}
                            className="booking-steps"
                        />

                        <div style={{ marginTop: '3rem' }}>
                            {dataLoading ? (
                                <Skeleton active paragraph={{ rows: 4 }} />
                            ) : (
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    {/* Step 1: Select Service */}
                                    <div>
                                        <Title level={4}>
                                            <ScissorOutlined /> Select Service
                                        </Title>
                                        <Select
                                            size="large"
                                            placeholder="Choose a service"
                                            style={{ width: '100%' }}
                                            value={selectedService}
                                            onChange={setSelectedService}
                                            options={services.map(s => ({
                                                value: s._id,
                                                label: `${s.name} - ₹${s.price} (${s.duration} min)`,
                                            }))}
                                        />
                                    </div>

                                    {/* Step 2: Choose Styler */}
                                    {selectedService && (
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Title level={4}>
                                                <UserOutlined /> Choose Styler
                                            </Title>
                                            <Select
                                                size="large"
                                                placeholder="Choose a styler"
                                                style={{ width: '100%' }}
                                                value={selectedStyler}
                                                onChange={setSelectedStyler}
                                                options={stylers.map(s => ({
                                                    value: s._id,
                                                    label: `${s.name} - ${s.experience} years exp`,
                                                }))}
                                            />
                                        </MotionDiv>
                                    )}

                                    {/* Step 3: Pick Date & Time */}
                                    {selectedService && selectedStyler && (
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Title level={4}>
                                                <CalendarOutlined /> Pick Date & Time
                                            </Title>
                                            <Space size="large">
                                                <DatePicker
                                                    size="large"
                                                    placeholder="Select date"
                                                    value={selectedDate}
                                                    onChange={setSelectedDate}
                                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                />
                                                <TimePicker
                                                    size="large"
                                                    placeholder="Select time"
                                                    value={selectedTime}
                                                    onChange={setSelectedTime}
                                                    format="HH:mm"
                                                />
                                            </Space>
                                        </MotionDiv>
                                    )}

                                    {/* Book Button */}
                                    {selectedService && selectedStyler && selectedDate && selectedTime && (
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<CheckCircleOutlined />}
                                                loading={loading}
                                                onClick={handleBooking}
                                                block
                                                style={{ height: 52, fontSize: 18, fontWeight: 700 }}
                                            >
                                                Book Appointment
                                            </Button>
                                        </MotionDiv>
                                    )}
                                </Space>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Services;
