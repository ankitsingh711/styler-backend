import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Space, Divider } from 'antd';
import {
    ArrowRightOutlined,
    EnvironmentOutlined,
    StarOutlined,
    ScissorOutlined,
    CalendarOutlined,
    HeartOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../services/statsService';
import CountUp from 'react-countup';
import './Home.css';

const { Title, Text, Paragraph } = Typography;
const MotionDiv = motion.div;

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                const statsArray = Array.isArray(data) ? data : (data?.stats || []);

                if (statsArray.length === 0) {
                    setStats([
                        { count: 20, suffix: '+', title: 'Branches', color: '#f59e0b', icon: <EnvironmentOutlined /> },
                        { count: 5000, suffix: '+', title: 'Happy Clients', color: '#14b8a6', icon: <StarOutlined /> },
                        { count: 150, suffix: '+', title: 'Expert Stylists', color: '#8b5cf6', icon: <ScissorOutlined /> },
                        { count: 10, suffix: 'K+', title: 'Total Appointments', color: '#ec4899', icon: <CalendarOutlined /> },
                        { count: 98, suffix: '%', title: 'Customer Satisfaction', color: '#f43f5e', icon: <HeartOutlined /> },
                        { count: 15, suffix: '+', title: 'Years in Business', color: '#f97316', icon: <TrophyOutlined /> },
                    ]);
                } else {
                    setStats(statsArray);
                }
                setStatsLoading(false);
            } catch (error) {
                console.error('Error loading stats:', error);
                setStats([
                    { count: 20, suffix: '+', title: 'Branches', color: '#f59e0b', icon: <EnvironmentOutlined /> },
                    { count: 5000, suffix: '+', title: 'Happy Clients', color: '#14b8a6', icon: <StarOutlined /> },
                    { count: 150, suffix: '+', title: 'Expert Stylists', color: '#8b5cf6', icon: <ScissorOutlined /> },
                    { count: 10, suffix: 'K+', title: 'Total Appointments', color: '#ec4899', icon: <CalendarOutlined /> },
                    { count: 98, suffix: '%', title: 'Customer Satisfaction', color: '#f43f5e', icon: <HeartOutlined /> },
                    { count: 15, suffix: '+', title: 'Years in Business', color: '#f97316', icon: <TrophyOutlined /> },
                ]);
                setStatsLoading(false);
            }
        };

        loadStats();
    }, []);

    const features = [
        {
            icon: <ScissorOutlined />,
            title: 'Expert Stylists',
            description: 'Our certified professionals bring years of experience and passion to every service.',
            color: '#f59e0b'
        },
        {
            icon: <ThunderboltOutlined />,
            title: 'Quick Booking',
            description: 'Book your appointment in seconds with our easy-to-use platform.',
            color: '#8b5cf6'
        },
        {
            icon: <StarOutlined />,
            title: 'Premium Service',
            description: 'Experience luxury with our premium products and exceptional customer care.',
            color: '#14b8a6'
        },
        {
            icon: <CheckCircleOutlined />,
            title: 'Guaranteed Results',
            description: "Your satisfaction is our priority. We ensure you leave looking your absolute best.",
            color: '#ec4899'
        },
    ];

    return (
        <div className="home-page-redesign">
            {/* Hero Section */}
            <section className="hero-section-redesign">
                <div className="hero-bg-pattern" />
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-content-redesign"
                    >
                        <div className="hero-badge">
                            <ThunderboltOutlined /> Premium Grooming Services
                        </div>

                        <Title level={1} className="hero-title-redesign">
                            Transform Your Look,
                            <br />
                            <span className="hero-title-gradient">Elevate Your Style</span>
                        </Title>

                        <Paragraph className="hero-description">
                            Experience world-class grooming and styling services from our team of expert professionals.
                            Book your appointment today and discover the difference that premium care makes.
                        </Paragraph>

                        <Space size="middle" className="hero-actions">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={() => navigate('/services')}
                                className="hero-btn-primary"
                            >
                                Book Appointment
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate('/about')}
                                className="hero-btn-secondary"
                            >
                                Learn More
                            </Button>
                        </Space>
                    </MotionDiv>
                </div>
            </section>

            {/* Stats Section - Redesigned */}
            <section className="achievements-section-new">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="section-header-center">
                            <Title level={2} className="section-title-redesign">
                                Our Achievements
                            </Title>
                            <Text className="section-subtitle-redesign">
                                Numbers that speak for our excellence
                            </Text>
                        </div>

                        <Row gutter={[24, 24]} className="achievements-grid">
                            {stats.map((stat, index) => (
                                <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="achievement-card-wrapper"
                                    >
                                        <div className="achievement-card-modern">
                                            <div className="achievement-icon-box" style={{ backgroundColor: `${stat.color}15` }}>
                                                <div className="achievement-icon" style={{ color: stat.color }}>
                                                    {stat.icon}
                                                </div>
                                            </div>
                                            <div className="achievement-content">
                                                <div className="achievement-number" style={{ color: stat.color }}>
                                                    <CountUp end={stat.count} duration={2.5} separator="," />
                                                    {stat.suffix}
                                                </div>
                                                <div className="achievement-label">{stat.title}</div>
                                            </div>
                                        </div>
                                    </MotionDiv>
                                </Col>
                            ))}
                        </Row>
                    </MotionDiv>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section-redesign">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="section-header-center">
                            <Title level={2} className="section-title-redesign">
                                Why Choose Styler
                            </Title>
                            <Text className="section-subtitle-redesign">
                                Experience the difference with our premium services
                            </Text>
                        </div>

                        <Row gutter={[32, 32]} className="features-grid">
                            {features.map((feature, index) => (
                                <Col key={index} xs={24} sm={12} lg={6}>
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                    >
                                        <Card className="feature-card-redesign" bordered={false}>
                                            <div className="feature-icon-wrapper" style={{ background: `${feature.color}15` }}>
                                                <div className="feature-icon" style={{ color: feature.color }}>
                                                    {feature.icon}
                                                </div>
                                            </div>
                                            <Title level={4} className="feature-title">
                                                {feature.title}
                                            </Title>
                                            <Text className="feature-description">
                                                {feature.description}
                                            </Text>
                                        </Card>
                                    </MotionDiv>
                                </Col>
                            ))}
                        </Row>
                    </MotionDiv>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section-redesign">
                <div className="cta-bg-pattern" />
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="cta-content-redesign"
                    >
                        <Title level={2} className="cta-title">
                            Ready to Transform Your Look?
                        </Title>
                        <Text className="cta-description">
                            Book your appointment now and experience premium grooming services
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRightOutlined />}
                            onClick={() => navigate('/services')}
                            className="cta-button"
                        >
                            Get Started Today
                        </Button>
                    </MotionDiv>
                </div>
            </section>
        </div>
    );
};

export default Home;
