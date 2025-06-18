import { Card, Button, Typography, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import { useState } from 'react';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async (values: any) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put('/api/user/me', values, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Запрашиваем обновлённые данные
    const response = await axios.get('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedUser = response.data.user;

    // Обновляем localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    message.success('Профиль обновлён');
    setEditing(false);
  } catch (error) {
    console.error('Ошибка при обновлении:', error);
    message.error('Не удалось обновить профиль');
  }
};

  if (!user) return <p>Пользователь не найден</p>;

  return (
    <Card style={{ maxWidth: 500, margin: 'auto', marginTop: 40 }}>
      <Title level={3}>Личный кабинет</Title>

      {!editing ? (
        <>
          <Paragraph><strong>Имя:</strong> {user.name}</Paragraph>
          <Paragraph><strong>Email:</strong> {user.email}</Paragraph>
          <Paragraph><strong>Телефон:</strong> {user.phone}</Paragraph>

          <Button type="primary" onClick={() => setEditing(true)} style={{ marginRight: 10 }}>
            Редактировать
          </Button>
          <Button type="primary" danger onClick={handleLogout}>
            Выйти
          </Button>
        </>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user.name,
            email: user.email,
            phone: user.phone,
          }}
          onFinish={handleSave}
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[{ required: true, message: 'Введите номер телефона' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
              Сохранить
            </Button>
            <Button onClick={() => setEditing(false)}>Отмена</Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ProfilePage;
