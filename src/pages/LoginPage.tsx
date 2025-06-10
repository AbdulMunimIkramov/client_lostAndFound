import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
  try {
    const res = await axios.post('http://localhost:8000/api/login', values);

    // Сохраняем токен и пользователя
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    message.success('Успешный вход');
    navigate('/');
  } catch (error: any) {
    const msg = error?.response?.data?.message || 'Ошибка входа';
    message.error(msg);
  }
};


  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Title level={2}>Вход</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Войти</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
