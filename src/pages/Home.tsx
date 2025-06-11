import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Typography, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "antd";
const { Title } = Typography;

const Home = () => {
  const [publications, setPublications] = useState<any[]>([]);
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

  useEffect(() => {
    fetchPublications();
  }, [search, categoryFilter, typeFilter]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "20px" }}>
      <Header
        onSearch={(value: string) => setSearch(value)}
        onCategoryChange={(value: string) => setCategoryFilter(value)}
        onTypeChange={(value: string) => setTypeFilter(value)}
        searchValue={search}
        categoryValue={categoryFilter}
        typeValue={typeFilter}
      />

      <Title level={2}>Публикации</Title>

      <Row gutter={[16, 16]}>
        {" "}
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

