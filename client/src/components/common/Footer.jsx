import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src="/images/logo.png" alt="Styler Logo" />
                </div>
                <p className="footer-description">
                    The Exclusive Unisex Salon in your town acquainted with world-class tools
                    and professionals for stunning looks and absolute luxury.
                </p>
                <div className="footer-social">
                    <a href="#" className="social-icon facebook">
                        <FaFacebook />
                    </a>
                    <a href="#" className="social-icon twitter">
                        <FaTwitter />
                    </a>
                    <a href="#" className="social-icon instagram">
                        <FaInstagram />
                    </a>
                </div>
            </div>
            <p className="footer-copyright">© 2023, Styler Salon. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
