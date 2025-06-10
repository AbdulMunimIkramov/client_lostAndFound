import { Card, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <p>Пользователь не найден</p>;

  return (
    <Card style={{ maxWidth: 500, margin: 'auto', marginTop: 40 }}>
      <Title level={3}>Личный кабинет</Title>
      <Paragraph><strong>Имя:</strong> {user.name}</Paragraph>
      <Paragraph><strong>Email:</strong> {user.email}</Paragraph>
      <Paragraph><strong>Телефон:</strong> {user.phone}</Paragraph>

      <Button type="primary" danger onClick={handleLogout}>
        Выйти
      </Button>
    </Card>
  );
};

export default ProfilePage;
