import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Badge, Space } from 'antd';
import {
    TrophyOutlined,
    HeartOutlined,
    ThunderboltOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    StarOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import './About.css';

const { Title, Text } = Typography;
const MotionDiv = motion.div;

const About = () => {
    const stats = [
        { value: 150, suffix: '+', label: 'Expert Stylists', icon: <TeamOutlined /> },
        { value: 20, suffix: '+', label: 'Locations Nationwide', icon: <EnvironmentOutlined /> },
        { value: 15, suffix: '+', label: 'Years of Excellence', icon: <CalendarOutlined /> },
        { value: 5000, suffix: '+', label: 'Happy Clients', icon: <HeartOutlined /> },
    ];

    const values = [
        {
            icon: <TrophyOutlined />,
            title: 'Excellence',
            description: 'We strive for perfection in every service, using only the finest products and latest techniques.',
            color: '#f59e0b',
        },
        {
            icon: <HeartOutlined />,
            title: 'Trust',
            description: 'Building lasting relationships with our clients through honesty, integrity, and reliability.',
            color: '#ec4899',
        },
        {
            icon: <ThunderboltOutlined />,
            title: 'Innovation',
            description: 'Staying ahead with cutting-edge trends and technologies in beauty and wellness.',
            color: '#8b5cf6',
        },
        {
            icon: <TeamOutlined />,
            title: 'Care',
            description: 'Treating every client with personalized attention, respect, and genuine care.',
            color: '#14b8a6',
        },
    ];

    const features = [
        { icon: <TrophyOutlined />, title: 'Award-Winning Service', description: 'Recognized excellence in beauty and grooming services.' },
        { icon: <SafetyCertificateOutlined />, title: 'Certified Professionals', description: 'Our stylists are trained and certified in the latest techniques.' },
        { icon: <StarOutlined />, title: 'Personalized Experience', description: 'Customized services tailored to your unique style.' },
        { icon: <CheckCircleOutlined />, title: 'Satisfaction Guaranteed', description: 'Your happiness is our priority.' },
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="about-hero-pattern" />
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="about-hero-content"
                    >
                        <Badge.Ribbon text="About Styler Salon" color="#f59e0b" />
                        <Title level={1} className="about-hero-title">
                            Where Beauty Meets
                            <br />
                            <span className="gradient-text">Excellence</span>
                        </Title>
                        <Text className="about-hero-subtitle">
                            Transforming lives through exceptional beauty and grooming services since 2009
                        </Text>
                    </MotionDiv>
                </div>
            </div>

            {/* Stats Section */}
            <div className="about-stats-section">
                <div className="container">
                    <Row gutter={[32, 32]}>
                        {stats.map((stat, index) => (
                            <Col key={index} xs={24} sm={12} md={6}>
                                <Card className="stat-card-about">
                                    <div className="stat-icon">{stat.icon}</div>
                                    <Title level={2} className="stat-value">
                                        <CountUp end={stat.value} duration={2.5} />
                                        {stat.suffix}
                                    </Title>
                                    <Text className="stat-label">{stat.label}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Values Section */}
            <div className="about-values-section">
                <div className="container">
                    <Title level={2} className="section-title">Our Core Values</Title>
                    <Text className="section-subtitle">
                        The principles that guide everything we do
                    </Text>

                    <Row gutter={[32, 32]} style={{ marginTop: '3rem' }}>
                        {values.map((value, index) => (
                            <Col key={index} xs={24} sm={12} md={6}>
                                <Card className="value-card" bordered={false}>
                                    <div className="value-icon" style={{ color: value.color }}>
                                        {value.icon}
                                    </div>
                                    <Title level={4} style={{ color: 'white', marginTop: 16 }}>
                                        {value.title}
                                    </Title>
                                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        {value.description}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Features Section */}
            <div className="about-features-section">
                <div className="container">
                    <Title level={2} className="section-title">Why Choose Us</Title>
                    <Row gutter={[24, 24]} style={{ marginTop: '3rem' }}>
                        {features.map((feature, index) => (
                            <Col key={index} xs={24} sm={12} md={8}>
                                <Card className="feature-card">
                                    <Space direction="vertical" size="middle">
                                        <div className="feature-icon">{feature.icon}</div>
                                        <Title level={5} style={{ color: 'white', margin: 0 }}>
                                            {feature.title}
                                        </Title>
                                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {feature.description}
                                        </Text>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* CTA Section */}
            <div className="about-cta-section">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="about-cta-content"
                    >
                        <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
                            Experience the Styler Difference
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 18, display: 'block', marginBottom: 32 }}>
                            Book your appointment today and discover why we're the preferred choice
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => window.location.href = '/services'}
                            style={{ height: 52, padding: '0 40px', fontSize: 18, fontWeight: 700 }}
                        >
                            Book Appointment
                        </Button>
                    </MotionDiv>
                </div>
            </div>
        </div>
    );
};

export default About;
