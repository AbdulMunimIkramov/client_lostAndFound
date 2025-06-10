import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Image, Typography } from "antd";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const { Title, Paragraph } = Typography;

const PublicationDetailsPage = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/publications/${id}`
        );

        const pub = res.data.publication;

        // Парсим location из JSON-строки, если оно есть и строка
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

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  if (!publication) return <p>Публикация не найдена</p>;

  console.log(publication);

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

      {publication.images?.length > 0 ? (
        <div style={{ marginTop: 20 }}>
          <img
            alt={publication.title}
            src={publication.images[0]}
            style={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: 8,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 200,
            marginTop: 20,
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <span>Нет изображения</span>
        </div>
      )}

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
    </Card>
  );
};

export default PublicationDetailsPage;
