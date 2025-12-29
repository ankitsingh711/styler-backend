import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LockOutlined, HomeOutlined } from '@ant-design/icons';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '2rem',
        }}>
            <Result
                status="403"
                title={<span style={{ color: 'white', fontSize: 32 }}>Access Denied</span>}
                subTitle={<span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }}>Sorry, you don't have permission to access this page.</span>}
                icon={<LockOutlined style={{ fontSize: 72, color: '#f59e0b' }} />}
                extra={
                    <Button
                        type="primary"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                }
                style={{
                    background: 'rgba(30, 41, 59, 0.9)',
                    borderRadius: 16,
                    padding: '3rem',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                }}
            />
        </div>
    );
};

export default Unauthorized;
