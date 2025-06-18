import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Select, Button, Card, Spin, notification } from "antd";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import instance from "../api/axios";

const { Option } = Select;

const EditPublicationPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.75, 37.62]);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const res = await instance.get(`api/publications/${id}`, {
          withCredentials: true,
        });
        const pub = res.data.publication;

        if (pub.location && typeof pub.location === "string") {
          try {
            pub.location = JSON.parse(pub.location);
            setMapCenter([pub.location.latitude, pub.location.longitude]);
          } catch {
            pub.location = null;
          }
        }

        setPublication(pub);
        form.setFieldsValue({
          ...pub,
          category: pub.category,
          type: pub.type,
        });
      } catch (err) {
        console.error("Ошибка при загрузке публикации:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      const location = publication.location
        ? { latitude: publication.location.latitude, longitude: publication.location.longitude }
        : null;

      await instance.put(
        `api/publications/${id}`,
        { ...values, location },
        { withCredentials: true }
      );

      notification.success({
        message: "Публикация обновлена",
        description: "Изменения успешно сохранены",
      });

      navigate("/"); // Redirect to homepage after saving
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось обновить публикацию",
      });
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
  if (!publication) return <p>Публикация не найдена</p>;

  return (
    <Card style={{ maxWidth: 800, margin: "auto", marginTop: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Заголовок"
          rules={[{ required: true, message: "Введите заголовок" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Категория"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Select>
            <Option value="lost">Утеряно</Option>
            <Option value="found">Найдено</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Тип"
          rules={[{ required: true, message: "Выберите тип" }]}
        >
          <Select>
            <Option value="pet">Животное</Option>
            <Option value="document">Документ</Option>
            <Option value="thing">Вещь</Option>
            <Option value="other">Другое</Option>
          </Select>
        </Form.Item>

        <Form.Item name="phone" label="Телефон">
          <Input />
        </Form.Item>

        {publication.location && (
          <YMaps query={{ apikey: "f14e388e-783a-4586-98ea-ee66b124d032" }}>
            <Map
              defaultState={{ center: mapCenter, zoom: 14 }}
              width="100%"
              height="300px"
              onClick={(e: any) => {
                const coords = e.get("coords");
                setPublication({
                  ...publication,
                  location: { latitude: coords[0], longitude: coords[1] },
                });
                setMapCenter(coords);
              }}
            >
              <Placemark geometry={mapCenter} />
            </Map>
          </YMaps>
        )}

        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            Сохранить изменения
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={() => navigate("/")}>
            Отмена
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditPublicationPage;