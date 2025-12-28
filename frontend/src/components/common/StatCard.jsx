import { Paper, Text, Group, Box } from '@mantine/core';
import {
    IconMapPin,
    IconStar,
    IconScissors,
    IconCalendarMonth,
    IconHeart,
    IconTrophy
} from '@tabler/icons-react';

const StatCard = ({ iconName, title, count, trend, color }) => {
    const renderIcon = () => {
        const iconProps = { size: 36, stroke: 1.5 };

        switch (iconName) {
            case 'location':
                return <IconMapPin {...iconProps} />;
            case 'star':
                return <IconStar {...iconProps} />;
            case 'scissors':
                return <IconScissors {...iconProps} />;
            case 'calendar':
                return <IconCalendarMonth {...iconProps} />;
            case 'heart':
                return <IconHeart {...iconProps} />;
            case 'trophy':
                return <IconTrophy {...iconProps} />;
            default:
                return <IconMapPin {...iconProps} />;
        }
    };

    return (
        <Paper
            shadow="md"
            radius="lg"
            p="xl"
            style={{
                background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                border: `2px solid ${color}20`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
            }}
            sx={{
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${color}30`,
                    borderColor: `${color}40`,
                },
            }}
        >
            <Group justify="space-between" mb="md">
                <Box
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 8px 24px ${color}40`,
                    }}
                >
                    {renderIcon()}
                </Box>

                {trend && (
                    <Text
                        size="sm"
                        fw={600}
                        style={{
                            color: trend.startsWith('+') ? '#10b981' : '#ef4444',
                        }}
                    >
                        {trend}
                    </Text>
                )}
            </Group>

            <Text
                size="2.5rem"
                fw={800}
                style={{
                    lineHeight: 1.2,
                    background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem',
                }}
            >
                {count}
            </Text>

            <Text
                size="sm"
                c="dimmed"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: '0.05em' }}
            >
                {title}
            </Text>
        </Paper>
    );
};

export default StatCard;
