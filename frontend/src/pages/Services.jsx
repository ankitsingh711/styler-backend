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
} from 'antd';
import {
    ScissorOutlined,
    UserOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import dayjs from 'dayjs';
import './Services.css';

const { Title, Text, Paragraph } = Typography;
const MotionDiv = motion.div;

const Services = () => {
    const [stylers, setStylers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedStyler, setSelectedStyler] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const { isAuthenticated } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const steps = [
        { title: 'Service', icon: <ScissorOutlined /> },
        { title: 'Styler', icon: <UserOutlined /> },
        { title: 'Date & Time', icon: <CalendarOutlined /> },
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
            error('Please complete all steps');
            return;
        }

        setLoading(true);
        try {
            await bookingService.createAppointment({
                service: selectedService,
                styler: selectedStyler,
                date: selectedDate.format('DD-MM-YYYY'),
                time: selectedTime.format('HH:mm'),
            });
            success('Appointment booked successfully!');
            navigate('/profile');
        } catch (err) {
            error(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (current === 0 && selectedService) setCurrent(1);
        else if (current === 1 && selectedStyler) setCurrent(2);
        else if (current === 2 && selectedDate && selectedTime) handleBooking();
    };

    const prevStep = () => setCurrent(current - 1);

    const getButtonText = () => {
        if (current === 2) return loading ? 'Booking...' : 'Confirm Booking';
        return 'Next Step';
    };

    return (
        <div className="services-page-modern">
            {/* Hero Section */}
            <section className="services-hero-modern">
                <div className="services-hero-pattern" />
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="services-hero-content"
                    >
                        <div className="services-badge">
                            <ScissorOutlined /> Book Your Service
                        </div>
                        <Title level={1} className="services-hero-title">
                            Premium Grooming
                            <br />
                            <span className="gradient-text-services">Made Simple</span>
                        </Title>
                        <Paragraph className="services-hero-description">
                            Choose your service, select your preferred styler, and book your appointment—all in minutes
                        </Paragraph>
                    </MotionDiv>
                </div>
            </section>

            {/* Booking Section */}
            <section className="booking-section-modern">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="booking-card-modern" bordered={false}>
                            <Steps current={current} items={steps} className="booking-steps" />

                            <div className="booking-content">
                                {dataLoading ? (
                                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                                        <Skeleton active />
                                    </Space>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {current === 0 && (
                                            <MotionDiv
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="step-content">
                                                    <Title level={3} className="step-title">
                                                        Select Your Service
                                                    </Title>
                                                    <Text className="step-subtitle">
                                                        Choose from our range of professional services
                                                    </Text>
                                                    <Row gutter={[16, 16]} style={{ marginTop: '2rem' }}>
                                                        {services.map((service) => (
                                                            <Col key={service._id} xs={24} sm={12} md={8}>
                                                                <Card
                                                                    hoverable
                                                                    className={`service-selection-card ${selectedService === service._id ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedService(service._id)}
                                                                >
                                                                    <ScissorOutlined className="service-icon" />
                                                                    <Title level={5}>{service.name || service.serviceName}</Title>
                                                                    <Text type="secondary">{service.description}</Text>
                                                                    <div className="service-price">₹{service.price || service.amount}</div>
                                                                </Card>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            </MotionDiv>
                                        )}

                                        {current === 1 && (
                                            <MotionDiv
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="step-content">
                                                    <Title level={3} className="step-title">
                                                        Choose Your Styler
                                                    </Title>
                                                    <Text className="step-subtitle">
                                                        Select from our team of expert professionals
                                                    </Text>
                                                    <Row gutter={[16, 16]} style={{ marginTop: '2rem' }}>
                                                        {stylers.map((styler) => (
                                                            <Col key={styler._id} xs={24} sm={12} md={8}>
                                                                <Card
                                                                    hoverable
                                                                    className={`styler-selection-card ${selectedStyler === styler._id ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedStyler(styler._id)}
                                                                >
                                                                    <UserOutlined className="styler-icon" />
                                                                    <Title level={5}>{styler.name}</Title>
                                                                    <Text type="secondary">{styler.specialty || 'Expert Styler'}</Text>
                                                                </Card>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            </MotionDiv>
                                        )}

                                        {current === 2 && (
                                            <MotionDiv
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="step-content">
                                                    <Title level={3} className="step-title">
                                                        Pick Date & Time
                                                    </Title>
                                                    <Text className="step-subtitle">
                                                        Select your preferred appointment slot
                                                    </Text>
                                                    <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
                                                        <Col xs={24} md={12}>
                                                            <div className="date-time-box">
                                                                <CalendarOutlined className="picker-icon" />
                                                                <label>Select Date</label>
                                                                <DatePicker
                                                                    size="large"
                                                                    style={{ width: '100%' }}
                                                                    onChange={(date) => setSelectedDate(date)}
                                                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col xs={24} md={12}>
                                                            <div className="date-time-box">
                                                                <ClockCircleOutlined className="picker-icon" />
                                                                <label>Select Time</label>
                                                                <TimePicker
                                                                    size="large"
                                                                    style={{ width: '100%' }}
                                                                    format="HH:mm"
                                                                    onChange={(time) => setSelectedTime(time)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </MotionDiv>
                                        )}
                                    </AnimatePresence>
                                )}

                                <div className="booking-actions">
                                    {current > 0 && (
                                        <Button size="large" onClick={prevStep} className="btn-back">
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={nextStep}
                                        loading={loading}
                                        disabled={
                                            dataLoading ||
                                            (current === 0 && !selectedService) ||
                                            (current === 1 && !selectedStyler) ||
                                            (current === 2 && (!selectedDate || !selectedTime))
                                        }
                                        icon={current === 2 ? <CheckCircleOutlined /> : <ArrowRightOutlined />}
                                        className="btn-next"
                                    >
                                        {getButtonText()}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </MotionDiv>
                </div>
            </section>
        </div>
    );
};

export default Services;
