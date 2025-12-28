import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <h1 className="fade-in">About Styler Salon</h1>
                    <p className="fade-in">Where Beauty Meets Excellence</p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="our-story-section">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>
                                Founded with a passion for beauty and excellence, Styler Salon has grown from a 
                                single location to over 162 branches nationally and internationally. Our journey 
                                began with a simple vision: to provide world-class beauty and grooming services 
                                that make everyone feel confident and beautiful.
                            </p>
                            <p>
                                Today, we stand as a premium unisex salon trusted by thousands of clients who 
                                seek not just a service, but an experience. Every visit to Styler Salon is a 
                                journey of transformation, where our expert stylists bring your vision to life.
                            </p>
                        </div>
                        <div className="story-image">
                            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600" alt="Salon Interior" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="mission-vision-section">
                <div className="container">
                    <div className="mission-vision-grid">
                        <div className="mission-card">
                            <div className="icon">🎯</div>
                            <h3>Our Mission</h3>
                            <p>
                                To provide exceptional beauty and grooming services that enhance confidence 
                                and bring out the best in every individual through expert care, premium 
                                products, and personalized attention.
                            </p>
                        </div>
                        <div className="vision-card">
                            <div className="icon">✨</div>
                            <h3>Our Vision</h3>
                            <p>
                                To be the most trusted and sought-after salon chain globally, setting new 
                                standards in beauty and wellness while empowering individuals to express 
                                their unique style with confidence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <h2>Our Core Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">💎</div>
                            <h4>Excellence</h4>
                            <p>We strive for perfection in every service, using only the finest products and latest techniques.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🤝</div>
                            <h4>Trust</h4>
                            <p>Building lasting relationships with our clients through honesty, integrity, and reliability.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🌟</div>
                            <h4>Innovation</h4>
                            <p>Staying ahead with cutting-edge trends and technologies in beauty and wellness.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">❤️</div>
                            <h4>Care</h4>
                            <p>Treating every client with personalized attention, respect, and genuine care.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <h2>Meet Our Expert Team</h2>
                    <p className="team-description">
                        Over 6000 skilled professionals dedicated to making you look and feel your best
                    </p>
                    <div className="team-stats">
                        <div className="stat-item">
                            <h3>6000+</h3>
                            <p>Expert Stylists</p>
                        </div>
                        <div className="stat-item">
                            <h3>162+</h3>
                            <p>Locations Worldwide</p>
                        </div>
                        <div className="stat-item">
                            <h3>15+</h3>
                            <p>Years of Experience</p>
                        </div>
                        <div className="stat-item">
                            <h3>50K+</h3>
                            <p>Happy Clients</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-section">
                <div className="container">
                    <h2>Why Choose Styler Salon?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h4>Award-Winning Service</h4>
                            <p>Recognized excellence in beauty and grooming services with multiple industry awards.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎓</div>
                            <h4>Certified Professionals</h4>
                            <p>Our stylists are trained and certified in the latest techniques and trends.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌿</div>
                            <h4>Premium Products</h4>
                            <p>We use only internationally recognized brands and high-quality products.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⭐</div>
                            <h4>Personalized Experience</h4>
                            <p>Customized services tailored to your unique style and preferences.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🧘</div>
                            <h4>Relaxing Ambiance</h4>
                            <p>Modern, comfortable spaces designed for your relaxation and comfort.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💯</div>
                            <h4>Satisfaction Guaranteed</h4>
                            <p>Your happiness is our priority. We ensure complete satisfaction with every visit.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Transform Your Look?</h2>
                    <p>Book your appointment today and experience the Styler difference</p>
                    <div className="cta-buttons">
                        <a href="/services" className="btn btn-primary">Book Now</a>
                        <a href="/services" className="btn btn-secondary">View Services</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
