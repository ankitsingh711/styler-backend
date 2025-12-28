import { Box, Container, Grid, Typography, Link, IconButton, Divider, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Phone, Email, LocationOn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const footerLinks = {
        'Quick Links': [
            { label: 'Home', path: '/' },
            { label: 'Services', path: '/services' },
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
        ],
        'Services': [
            { label: 'Hair Styling', path: '/services' },
            { label: 'Beard Grooming', path: '/services' },
            { label: 'Hair Coloring', path: '/services' },
            { label: 'Spa Treatments', path: '/services' },
        ],
    };

    const socialMedia = [
        { icon: Facebook, label: 'Facebook', link: '#' },
        { icon: Twitter, label: 'Twitter', link: '#' },
        { icon: Instagram, label: 'Instagram', link: '#' },
        { icon: LinkedIn, label: 'LinkedIn', link: '#' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                pt: 8,
                pb: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                style={{ height: 50, marginBottom: 16 }}
                            />
                            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                                Your premier destination for professional grooming and styling.
                                Experience excellence with our expert stylists.
                            </Typography>
                        </Box>

                        {/* Contact Info */}
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 20, color: 'secondary.main' }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    +91 1234567890
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 20, color: 'secondary.main' }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    info@stylersalon.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 20, color: 'secondary.main' }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    162+ locations nationwide
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <Grid item xs={6} md={2} key={title}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'secondary.main' }}>
                                {title}
                            </Typography>
                            <Stack spacing={1}>
                                {links.map((link) => (
                                    <Link
                                        key={link.label}
                                        component={RouterLink}
                                        to={link.path}
                                        sx={{
                                            color: 'white',
                                            opacity: 0.8,
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            '&:hover': {
                                                opacity: 1,
                                                color: 'secondary.main',
                                            },
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Stack>
                        </Grid>
                    ))}

                    {/* Newsletter Section */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'secondary.main' }}>
                            Follow Us
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                            Stay connected with us on social media for latest updates and offers.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {socialMedia.map((social) => (
                                <IconButton
                                    key={social.label}
                                    component="a"
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        bgcolor: 'rgba(245, 158, 11, 0.1)',
                                        color: 'secondary.main',
                                        '&:hover': {
                                            bgcolor: 'secondary.main',
                                            color: 'white',
                                        },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <social.icon />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Bottom Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        © {new Date().getFullYear()} Styler Salon. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Link
                            href="#"
                            sx={{
                                color: 'white',
                                opacity: 0.7,
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    opacity: 1,
                                },
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            sx={{
                                color: 'white',
                                opacity: 0.7,
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    opacity: 1,
                                },
                            }}
                        >
                            Terms of Service
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
