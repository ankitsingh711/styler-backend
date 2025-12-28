import { Box, Container, Grid, Text, Anchor, ActionIcon, Divider, Stack, Group, Title, rem } from '@mantine/core';
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
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
        { icon: IconBrandFacebook, label: 'Facebook', link: '#' },
        { icon: IconBrandTwitter, label: 'Twitter', link: '#' },
        { icon: IconBrandInstagram, label: 'Instagram', link: '#' },
        { icon: IconBrandLinkedin, label: 'LinkedIn', link: '#' },
    ];

    return (
        <Box
            component="footer"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                paddingTop: rem(64),
                paddingBottom: rem(32),
                marginTop: 'auto',
            }}
        >
            <Container size="lg">
                <Grid>
                    {/* Brand Section */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Box mb="md">
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                style={{ height: 50, marginBottom: 16 }}
                            />
                            <Text size="sm" opacity={0.8} style={{ lineHeight: 1.8 }}>
                                Your premier destination for professional grooming and styling.
                                Experience excellence with our expert stylists.
                            </Text>
                        </Box>

                        {/* Contact Info */}
                        <Stack gap="xs">
                            <Group gap="xs">
                                <IconPhone size={20} color="#f59e0b" />
                                <Text size="sm" opacity={0.8}>
                                    +91 1234567890
                                </Text>
                            </Group>
                            <Group gap="xs">
                                <IconMail size={20} color="#f59e0b" />
                                <Text size="sm" opacity={0.8}>
                                    info@stylersalon.com
                                </Text>
                            </Group>
                            <Group gap="xs">
                                <IconMapPin size={20} color="#f59e0b" />
                                <Text size="sm" opacity={0.8}>
                                    162+ locations nationwide
                                </Text>
                            </Group>
                        </Stack>
                    </Grid.Col>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <Grid.Col key={title} span={{ base: 6, md: 2 }}>
                            <Title order={6} fw={700} mb="sm" c="amber">
                                {title}
                            </Title>
                            <Stack gap="xs">
                                {links.map((link) => (
                                    <Anchor
                                        key={link.label}
                                        component={RouterLink}
                                        to={link.path}
                                        c="white"
                                        opacity={0.8}
                                        size="sm"
                                        underline="never"
                                        style={{
                                            transition: 'all 0.3s',
                                        }}
                                        styles={{
                                            root: {
                                                '&:hover': {
                                                    opacity: 1,
                                                    color: '#f59e0b',
                                                },
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Anchor>
                                ))}
                            </Stack>
                        </Grid.Col>
                    ))}

                    {/* Newsletter Section */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Title order={6} fw={700} mb="sm" c="amber">
                            Follow Us
                        </Title>
                        <Text size="sm" opacity={0.8} mb="md">
                            Stay connected with us on social media for latest updates and offers.
                        </Text>
                        <Group gap="xs">
                            {socialMedia.map((social) => (
                                <ActionIcon
                                    key={social.label}
                                    component="a"
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="lg"
                                    variant="light"
                                    color="amber"
                                    styles={{
                                        root: {
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                backgroundColor: '#f59e0b',
                                                color: 'white',
                                            },
                                        },
                                    }}
                                >
                                    <social.icon size={20} />
                                </ActionIcon>
                            ))}
                        </Group>
                    </Grid.Col>
                </Grid>

                <Divider my="xl" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Bottom Section */}
                <Group justify="space-between" style={{ flexDirection: { base: 'column', sm: 'row' } }}>
                    <Text size="sm" opacity={0.7}>
                        © {new Date().getFullYear()} Styler Salon. All rights reserved.
                    </Text>
                    <Group gap="xl">
                        <Anchor
                            href="#"
                            c="white"
                            opacity={0.7}
                            size="sm"
                            underline="never"
                            styles={{
                                root: {
                                    '&:hover': {
                                        opacity: 1,
                                    },
                                },
                            }}
                        >
                            Privacy Policy
                        </Anchor>
                        <Anchor
                            href="#"
                            c="white"
                            opacity={0.7}
                            size="sm"
                            underline="never"
                            styles={{
                                root: {
                                    '&:hover': {
                                        opacity: 1,
                                    },
                                },
                            }}
                        >
                            Terms of Service
                        </Anchor>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
};

export default Footer;
