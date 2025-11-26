import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    useEffect(() => {
        // Initialize AOS or any animations here if needed
    }, []);

    return (
        <div className="home-page">
            {/* Hero Carousel Section */}
            <div className="hero-carousel">
                <div className="carousel-item active">
                    <img
                        src="https://www.lookssalon.in/public/images/innerBanner/service-men-1.jpg"
                        alt="Men's Service"
                    />
                </div>
            </div>

            {/* Trending Section */}
            <section className="trend-section">
                <div className="trend-grid">
                    <div className="trend-card">
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/1.jpg" alt="Trend 1" />
                    </div>
                    <div className="trend-card">
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/2.jpg" alt="Trend 2" />
                    </div>
                    <div className="trend-card">
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/6.jpg" alt="Trend 3" />
                    </div>
                    <div className="trend-card">
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/4.jpg" alt="Trend 4" />
                    </div>
                    <div className="trend-card">
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/3.jpg" alt="Trend 5" />
                    </div>
                    <div className="trend-card">
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/5.jpg" alt="Trend 6" />
                    </div>
                </div>
            </section>

            {/* Services Category Section */}
            <section className="category-section">
                <h1>Our Services</h1>
                <div className="category-grid">
                    <Link to="/services" className="category-card">
                        <h2>GENTS</h2>
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/services/gents.jpg" alt="Gents Services" />
                    </Link>
                    <Link to="/services" className="category-card">
                        <h2>LADIES</h2>
                        <img src="https://d3r0z4awu7ba6n.cloudfront.net/images/looks/services/ladies.jpg" alt="Ladies Services" />
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="about-content">
                    <h1>Explore the Realm of Beauty with Styler Salon</h1>
                    <p>
                        With over 162 branches nationally and internationally, Styler salon is a premium beauty salon
                        for men and women who desire to look the best every day. Getting a makeover not only changes
                        the appearance of a person but also brings back the lost confidence and Styler Salon would take
                        pride in being a part of it. From beauty to grooming services, we provide a tremendous range of
                        facilities that touches every dimension of beauty and hair treatments. Our repertoire of professional
                        experts makes sure that all your beauty and hair questions are answered, and you leave the salon
                        with a big smile on your face.
                    </p>
                    <p>
                        With over 6000 employees engaged in transforming your look, we make sure that all the services
                        provided at our salons meet the international standards. Through our advice and solutions from
                        the expertise in this array, we aim at giving the best services through our state-of-art facilities.
                        Our professional stylists and beauty experts are constantly updated with the latest trends and
                        fashion advices that help them to work efficiently and deliver outstanding results!
                    </p>
                    <p>
                        Give us an opportunity to serve you once, we are sure you'll love to come back to us again and
                        be our esteemed customer forever. Fill the form or call us to book an appointment now!
                    </p>
                </div>
            </section>

            {/* Partner Brands Section */}
            <section className="partner-section">
                <h1>Our Partner Brands</h1>
                <div className="partner-grid">
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/Loreal_edited.webp" alt="L'Oreal" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/Kerastase-Logo.webp" alt="Kerastase" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/olaplex-vector-logo_edited.webp" alt="Olaplex" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/Moroccanoil-Logo.webp" alt="Moroccanoil" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/biotop.webp" alt="Biotop" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/wahl-logo.webp" alt="Wahl" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/dyson.webp" alt="Dyson" />
                    </div>
                    <div className="partner-card">
                        <img src="https://www.lookssalon.in/public/images//brands/american-crew.webp" alt="American Crew" />
                    </div>
                </div>
            </section>

            {/* Admin Login Link */}
            <div className="admin-login-link">
                <Link to="/admin/login">Login As Admin</Link>
            </div>
        </div>
    );
};

export default Home;
