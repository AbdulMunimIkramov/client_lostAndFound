import { Form, Input, Select, Button, Card, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import axios from "axios";
import { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const { TextArea } = Input;

const CreatePostPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const handleMapClick = (e: any) => {
    const coords = e.get("coords");
    setCoordinates(coords);
  };

  const onFinish = async (values: any) => {
    if (!coordinates) {
      message.error("Выберите местоположение на карте");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8000/api/publications",
        {
          ...values,
          location: {
            latitude: coordinates[0],
            longitude: coordinates[1],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const publicationId = res.data.publication.id;

      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append("images", file.originFileObj);
        });

        await axios.post(
          `http://localhost:8000/api/publications/${publicationId}/images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      message.success("Публикация создана");
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Ошибка при создании";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Авторизуйтесь для создания публикации</p>;

  return (
    <Card style={{ maxWidth: 800, margin: "auto", marginTop: 30 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Название"
          name="title"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Описание"
          name="description"
          rules={[{ required: true, message: "Введите описание" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Тип" name="type" rules={[{ required: true }]}>
          <Select placeholder="Выберите тип">
            <Select.Option value="all">Все типы</Select.Option>
            <Select.Option value="phone">Телефон</Select.Option>
            <Select.Option value="keys">Ключи</Select.Option>
            <Select.Option value="document">Документ</Select.Option>
            <Select.Option value="wallet">Кошелек</Select.Option>
            <Select.Option value="other">Другое</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Категория"
          name="category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Найдено или утеряно">
            <Select.Option value="lost">Утеряно</Select.Option>
            <Select.Option value="found">Найдено</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Номер телефона"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Фотографии (до 5)">
          <Upload
            listType="picture"
            beforeUpload={() => false}
            multiple
            maxCount={5}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Местоположение" required>
          <YMaps query={{ apikey: "f14e388e-783a-4586-98ea-ee66b124d032" }}>
            <Map
              defaultState={{ center: [55.751574, 37.573856], zoom: 10 }}
              width="100%"
              height="300px"
              onClick={handleMapClick}
            >
              {coordinates && <Placemark geometry={coordinates} />}
            </Map>
          </YMaps>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Опубликовать
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreatePostPage;

