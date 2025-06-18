import { useState, useEffect, useRef } from "react";
import { Input, Select, Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { getCurrentUser } from "../utils/auth";
const logo = require("../img/logo.png");

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
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const user = getCurrentUser(); // получаем пользователя

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

  const handleLogoClick = () => {
    if (!isLongPress.current) {
      navigate("/");
    }
  };

  const handleLongPressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      navigate("/admin");
    }, 1000); // Долгое нажатие — 1 секунда
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div
      style={{
        marginBottom: 5,
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: 200,
          height: 100,
          objectFit: "cover",
          cursor: "pointer",
          margin: 0,
          padding: 0,
          border: "none",
        }}
        onClick={handleLogoClick}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchCancel={handleLongPressEnd}
      />
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
      {user ? (
        <>
          <Button type="default" size="large" onClick={handleCreateClick}>
            Создать публикацию
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => navigate("/mypublication")}
          >
            Мои публикации
          </Button>
          <Tooltip title="Мой профиль">
            <Button
              type="primary"
              size="large"
              icon={<UserOutlined />}
              onClick={handleProfileClick}
            />
          </Tooltip>
          <Tooltip title="Мои чаты">
            <Button
              type="primary"
              size="large"
              icon={<MessageOutlined />}
              onClick={handleChatClick}
            />
          </Tooltip>
        </>
      ) : (
        <Button type="primary" size="large" onClick={() => navigate("/login")}>
          Войти
        </Button>
      )}
    </div>
  );
};

export default Header;
