// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Input, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

interface HeaderProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  searchValue: string;
  categoryValue: string;
  typeValue: string;
}

const Header = ({
  onSearch,
  onCategoryChange,
  onTypeChange,
  searchValue,
  categoryValue,
  typeValue,
}: HeaderProps) => {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCreateClick = () => {
    navigate("/create");
  };

  const handleChatClick = () => {
    navigate("/chat");
  };

  return (
    <div
      style={{
        marginBottom: 20,
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Search
        placeholder="Поиск по названию или описанию"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        onSearch={(value) => onSearch(value)}
        allowClear
        enterButton="Поиск"
        size="large"
        style={{ flex: 1, minWidth: 200 }}
      />
      <Select
        value={categoryValue}
        onChange={onCategoryChange}
        size="large"
        style={{ width: 120 }}
      >
        <Select.Option value="all">Все</Select.Option>
        <Select.Option value="lost">Утеряно</Select.Option>
        <Select.Option value="found">Найдено</Select.Option>
      </Select>
      <Select
        value={typeValue}
        onChange={onTypeChange}
        size="large"
        style={{ width: 120 }}
      >
        <Select.Option value="all">Все типы</Select.Option>
        <Select.Option value="phone">Телефон</Select.Option>
        <Select.Option value="keys">Ключи</Select.Option>
        <Select.Option value="document">Документ</Select.Option>
        <Select.Option value="wallet">Кошелек</Select.Option>
        <Select.Option value="other">Другое</Select.Option>
      </Select>
      <Button type="default" size="large" onClick={handleCreateClick}>
        Создать публикацию
      </Button>
      <Button type="primary" size="large" onClick={handleProfileClick}>
        Мой профиль
      </Button>
      <Button type="primary" size="large" onClick={handleChatClick}>
        Мои чаты
      </Button>
    </div>
  );
};

export default Header;
