import { Input, Select } from "antd";
const { Search } = Input;

interface HeaderProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  searchValue: string;
  categoryValue: string;
}

const Header = ({
  onSearch,
  onCategoryChange,
  searchValue,
  categoryValue,
}: HeaderProps) => {
  return (
    <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
      <Search
        placeholder="Поиск по названию или описанию"
        onSearch={onSearch}
        allowClear
        enterButton="Поиск"
        size="large"
        style={{ flex: 1 }}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Select
        value={categoryValue}
        onChange={onCategoryChange}
        size="large"
        style={{ width: 200 }}
      >
        <Select.Option value="all">Все</Select.Option>
        <Select.Option value="lost">Утеряно</Select.Option>
        <Select.Option value="found">Найдено</Select.Option>
      </Select>
    </div>
  );
};

export default Header;
