import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link: AntLink } = Typography;

const Footer = () => {
    const footerLinks = {
        'Quick Links': [
            { label: 'Home', path: '/' },
            { label: 'Services', path: '/services' },
            { label: 'About Us', path: '/about' },
        ],
        'Services': [
            { label: 'Hair Styling', path: '/services' },
            { label: 'Beard Grooming', path: '/services' },
            { label: 'Hair Coloring', path: '/services' },
            { label: 'Spa Treatments', path: '/services' },
        ],
    };

    const socialMedia = [
        { icon: <FacebookOutlined />, label: 'Facebook', link: '#' },
        { icon: <TwitterOutlined />, label: 'Twitter', link: '#' },
        { icon: <InstagramOutlined />, label: 'Instagram', link: '#' },
        { icon: <LinkedinOutlined />, label: 'LinkedIn', link: '#' },
    ];

    return (
        <AntFooter className="footer">
            <div className="footer-container">
                <Row gutter={[32, 32]}>
                    {/* Brand Section */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                className="footer-logo"
                            />
                            <Text className="footer-description">
                                Your premier destination for professional grooming and styling.
                                Experience excellence with our expert stylists.
                            </Text>

                            {/* Contact Info */}
                            <Space direction="vertical" size="small">
                                <Space>
                                    <PhoneOutlined className="footer-icon" />
                                    <Text className="footer-text">+91 1234567890</Text>
                                </Space>
                                <Space>
                                    <MailOutlined className="footer-icon" />
                                    <Text className="footer-text">info@stylersalon.com</Text>
                                </Space>
                                <Space>
                                    <EnvironmentOutlined className="footer-icon" />
                                    <Text className="footer-text">162+ locations nationwide</Text>
                                </Space>
                            </Space>
                        </Space>
                    </Col>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <Col key={title} xs={12} md={4}>
                            <Title level={5} className="footer-title">{title}</Title>
                            <Space direction="vertical" size="small">
                                {links.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.path}
                                        className="footer-link"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Space>
                        </Col>
                    ))}

                    {/* Social Section */}
                    <Col xs={24} md={8}>
                        <Title level={5} className="footer-title">Follow Us</Title>
                        <Text className="footer-text footer-social-text">
                            Stay connected with us on social media for latest updates and offers.
                        </Text>
                        <Space size="middle" className="social-icons">
                            {socialMedia.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </Space>
                    </Col>
                </Row>

                <Divider className="footer-divider" />

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <Text className="footer-copyright">
                        © {new Date().getFullYear()} Styler Salon. All rights reserved.
                    </Text>
                    <Space size="large" className="footer-legal">
                        <AntLink href="#" className="footer-legal-link">Privacy Policy</AntLink>
                        <AntLink href="#" className="footer-legal-link">Terms of Service</AntLink>
                    </Space>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;
