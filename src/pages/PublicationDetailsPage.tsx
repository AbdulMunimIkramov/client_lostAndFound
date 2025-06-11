import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Typography, Button } from "antd";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import ImageGallery from "../components/ImageGallery";
import { getCurrentUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const PublicationDetailsPage = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/publications/${id}`,
          { withCredentials: true }
        );

        const pub = res.data.publication;

        if (pub.location && typeof pub.location === "string") {
          try {
            pub.location = JSON.parse(pub.location);
          } catch {
            pub.location = null;
          }
        }

        setPublication(pub);
      } catch (err) {
        console.error("Ошибка при загрузке публикации:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  const handleChatClick = () => {
    if (currentUser && publication.user_id !== currentUser.id) {
      navigate('/chat', { state: { publication } });
    }
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  if (!publication) return <p>Публикация не найдена</p>;

  return (
    <Card style={{ maxWidth: 800, margin: "auto", marginTop: 30 }}>
      <Title level={3}>{publication.title}</Title>
      <Paragraph>{publication.description}</Paragraph>

      <p>
        <strong>Категория:</strong>{" "}
        {publication.category === "lost" ? "Утеряно" : "Найдено"}
      </p>
      <p>
        <strong>Тип:</strong> {publication.type}
      </p>
      <p>
        <strong>Телефон:</strong> {publication.phone}
      </p>
      
      <ImageGallery images={publication.images} />

      {publication.location && (
        <div style={{ marginTop: 20 }}>
          <h3>Местоположение</h3>
          <YMaps query={{ apikey: "f14e388e-783a-4586-98ea-ee66b124d032" }}>
            <Map
              defaultState={{
                center: [
                  publication.location.latitude,
                  publication.location.longitude,
                ],
                zoom: 14,
              }}
              width="100%"
              height="300px"
            >
              <Placemark
                geometry={[
                  publication.location.latitude,
                  publication.location.longitude,
                ]}
              />
            </Map>
          </YMaps>
        </div>
      )}
      {currentUser && publication.user_id !== currentUser.id && (
        <Button type="primary" onClick={handleChatClick} style={{ marginTop: 20 }}>
          Написать автору
        </Button>
      )}
    </Card>
  );
};

export default PublicationDetailsPage;
