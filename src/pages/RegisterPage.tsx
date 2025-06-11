import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom"; // Добавляем Link
import axios from "axios";

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/register",
        values
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      message.success("Регистрация успешна");
      navigate("/");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Ошибка регистрации";
      message.error(msg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <Title level={2}>Регистрация</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="ФИО" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form.Item>
        <Form.Item>
          <p>
            Уже есть аккаунт?{" "}
            <Link to="/login">
              <Button type="link">Войти</Button>
            </Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;