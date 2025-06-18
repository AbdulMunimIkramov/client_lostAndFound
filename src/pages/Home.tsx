import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Typography, Row, Col, message, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import instance from "../api/axios";

const { Title } = Typography;

const Home = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (typeFilter !== "all") params.type = typeFilter;

      const res = await axios.get("http://localhost:8000/api/publications", {
        withCredentials: true,
        params,
      });
      setPublications(res.data.publications || []);
    } catch (err) {
      message.error("Ошибка при загрузке публикаций");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await instance.get("api/admin/ads", {
        withCredentials: true,
      });
      setAds(res.data || []);
    } catch (err) {
      console.error("Fetch ads error:", err);
    }
  };

  useEffect(() => {
    fetchPublications();
    fetchAds();
  }, [search, categoryFilter, typeFilter]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  return (
    <div style={{ maxWidth: 1250, margin: "auto", padding: "20px" }}>
      {ads.length > 0 && (
        <Carousel
          autoplay
          autoplaySpeed={5000}
          effect="fade" // Плавное затухание между слайдами
          dots={true} // Включение точек навигации
          style={{ marginBottom: 5 }}
        >
          {ads.map((ad) => (
            <div key={ad.id}>
              {ad.link ? (
                <a
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block" }}
                >
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    style={{
                      width: "100%",
                      height: 300,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/1250x200?text=Ad";
                    }}
                  />
                </a>
              ) : (
                <div style={{ display: "block", cursor: "default" }}>
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/1250x200?text=Ad";
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </Carousel>
      )}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          padding: "10px 0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Header
          onSearch={(value: string) => setSearch(value)}
          onCategoryChange={(value: string) => setCategoryFilter(value)}
          onTypeChange={(value: string) => setTypeFilter(value)}
          searchValue={search}
          categoryValue={categoryFilter}
          typeValue={typeFilter}
        />
      </div>
      <Title level={2}>Публикации</Title>
      <Row gutter={[16, 16]}>
        {publications.length === 0 ? (
          <Col span={24}>
            <Card>
              <p style={{ textAlign: "center" }}>
                Ничего не найдено по запросу <strong>{search || "..."}</strong>
              </p>
            </Card>
          </Col>
        ) : (
          publications.map((pub) => (
            <Col xs={24} sm={12} md={8} key={pub.id}>
              <Card
                hoverable
                onClick={() => navigate(`/publications/${pub.id}`)}
                cover={
                  pub.images?.length > 0 ? (
                    <img
                      alt={pub.title}
                      src={pub.images[0]}
                      style={{
                        height: 300,
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span>Нет изображения</span>
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={pub.title}
                  description={
                    pub.description?.length > 60
                      ? pub.description.slice(0, 60) + "..."
                      : pub.description
                  }
                />
                <p style={{ marginTop: 8 }}>
                  <strong>
                    {pub.category === "lost" ? "Утеряно" : "Найдено"}
                  </strong>{" "}
                  — {pub.type}
                </p>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Home;
