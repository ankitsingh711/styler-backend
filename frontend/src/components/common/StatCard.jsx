import { Card, Typography, Space } from 'antd';
import {
    EnvironmentOutlined,
    StarOutlined,
    ScissorOutlined,
    CalendarOutlined,
    HeartOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import './StatCard.css';

const { Text } = Typography;

const StatCard = ({ iconName, title, count, trend, color }) => {
    const renderIcon = () => {
        const iconProps = { style: { fontSize: 36 } };

        switch (iconName) {
            case 'location':
                return <EnvironmentOutlined {...iconProps} />;
            case 'star':
                return <StarOutlined {...iconProps} />;
            case 'scissors':
                return <ScissorOutlined {...iconProps} />;
            case 'calendar':
                return <CalendarOutlined {...iconProps} />;
            case 'heart':
                return <HeartOutlined {...iconProps} />;
            case 'trophy':
                return <TrophyOutlined {...iconProps} />;
            default:
                return <EnvironmentOutlined {...iconProps} />;
        }
    };

    return (
        <Card
            hoverable
            className="stat-card"
            style={{
                background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                border: `2px solid ${color}20`,
            }}
        >
            <Space direction="horizontal" align="start" className="stat-card-header">
                <div
                    className="stat-card-icon"
                    style={{
                        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                        boxShadow: `0 8px 24px ${color}40`,
                    }}
                >
                    {renderIcon()}
                </div>

                {trend && (
                    <Text
                        strong
                        className="stat-card-trend"
                        style={{
                            color: trend.startsWith('+') ? '#10b981' : '#ef4444',
                        }}
                    >
                        {trend}
                    </Text>
                )}
            </Space>

            <Text
                className="stat-card-count"
                style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {count}
            </Text>

            <Text className="stat-card-title">{title}</Text>
        </Card>
    );
};

export default StatCard;
