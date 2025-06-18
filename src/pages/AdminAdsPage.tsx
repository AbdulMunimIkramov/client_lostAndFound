import { useEffect, useState } from "react";
import { Card, Table, Button, Form, Input, message, Typography, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import axios from "axios";
import instance from '../api/axios';

const { Title } = Typography;

const AdminAdsPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user?.is_admin) {
      message.error("Доступ только для администратора");
      navigate("/");
      return;
    }
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/admin/ads", {
        withCredentials: true,
      });
      setAds(res.data || []);
    } catch (err) {
      message.error("Ошибка при загрузке рекламы");
      console.error("Fetch ads error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (values: any) => {
    try {
      await instance.post("api/admin/ads", values, {
        withCredentials: true,
      });
      message.success("Реклама добавлена");
      form.resetFields();
      fetchAds();
    } catch (err) {
      message.error("Ошибка при добавлении рекламы");
      console.error("Create ad error:", err);
    }
  };

  const deleteAd = async (id: number) => {
    try {
      await instance.delete(`/api/admin/ads/${id}`, {
        withCredentials: true,
      });
      message.success("Реклама удалена");
      fetchAds();
    } catch (err) {
      message.error("Ошибка при удалении рекламы");
      console.error("Delete ad error:", err);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Название", dataIndex: "title", key: "title" },
    {
      title: "Изображение",
      dataIndex: "image_url",
      key: "image_url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt="Ad" style={{ width: 100, height: "auto" }} />
        </a>
      ),
    },
    {
      title: "Ссылка",
      dataIndex: "link",
      key: "link",
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link || "Нет ссылки"}
        </a>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <Popconfirm
          title="Удалить рекламу?"
          onConfirm={() => deleteAd(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button danger>Удалить</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card style={{ maxWidth: 1000, margin: "20px auto" }}>
      <Title level={2}>Управление рекламой</Title>

      <Form form={form} onFinish={createAd} layout="vertical">
        <Form.Item
          name="title"
          label="Название рекламы"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image_url"
          label="URL изображения"
          rules={[{ required: true, message: "Введите URL изображения" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="link" label="Ссылка (опционально)">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Добавить рекламу
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={ads}
        columns={columns}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
      />
    </Card>
  );
};

export default AdminAdsPage;