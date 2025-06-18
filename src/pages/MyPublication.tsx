import { Card, Col, Row, Button, message, Popconfirm, Spin, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";
import { getCurrentUser } from "../utils/auth";

const { Title, Paragraph } = Typography;

export const MyPublications = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const fetchPublications = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      // Получаем список ID публикаций пользователя
      const userPubsRes = await instance.get("/api/user/me/publications", {
        withCredentials: true,
      });
      const publicationIds = userPubsRes.data.publications.map((pub: any) => pub.id);

      // Запрашиваем каждую публикацию по ID
      const publicationsPromises = publicationIds.map(async (id: number) => {
        const res = await instance.get(`/api/publications/${id}`, {
          withCredentials: true,
        });
        const pub = res.data.publication;
        if (pub.location && typeof pub.location === "string") {
          try {
            pub.location = JSON.parse(pub.location);
          } catch {
            pub.location = null;
          }
        }
        return pub;
      });

      const publications = await Promise.all(publicationsPromises);
      setPublications(publications);
    } catch (err) {
      message.error("Ошибка при загрузке публикаций");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/api/publications/${id}`, {
        withCredentials: true,
      });
      message.success("Публикация удалена");
      setPublications((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      message.error("Ошибка при удалении публикации");
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Мои публикации
      </Title>
      <Row gutter={[24, 24]}>
        {publications.map((pub) => (
          <Col xs={24} sm={12} md={8} key={pub.id}>
            <Card
              hoverable
              cover={
                pub.images?.length > 0 ? (
                  <img
                    alt={pub.title}
                    src={pub.images[0]}
                    style={{
                      height: 250,
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 250,
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      color: "#999",
                    }}
                  >
                    Нет изображения
                  </div>
                )
              }
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    navigate(`/publication/${pub.id}/edit`);
                  }}
                />,
                <Popconfirm
                  title="Удалить публикацию?"
                  description="Вы уверены, что хотите удалить эту публикацию?"
                  onConfirm={() => handleDelete(pub.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <DeleteOutlined
                    key="delete"
                    onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие события
                  />
                </Popconfirm>,
              ]}
              onClick={() => navigate(`/publications/${pub.id}`)}
            >
              <Card.Meta
                title={pub.title}
                description={
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {pub.description || "Без описания"}
                  </Paragraph>
                }
              />
              <Paragraph style={{ marginTop: 8, fontWeight: 500 }}>
                {pub.category === "lost" ? "Утеряно" : "Найдено"} — {pub.type}
              </Paragraph>
              <Paragraph style={{ marginTop: 4, color: pub.is_resolved ? 'red' : 'green' }}>
                Статус: {pub.is_resolved ? "Завершена" : "Активна"}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MyPublications;