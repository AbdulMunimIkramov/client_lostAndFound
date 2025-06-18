// ✅ Расширенный AdminPage.tsx с поддержкой жалоб, фильтрацией и статусом публикаций

import { useEffect, useState } from 'react';
import { Card, Table, Button, Tabs, message, Typography, Popconfirm } from 'antd';
import axios from 'axios';
import { getCurrentUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import instance from '../api/axios';

const { Title } = Typography;

const AdminPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    console.log(user)
    if (!user?.is_admin) {
      message.error('Доступ только для администратора');
      navigate('/');
      return;
    }
    fetchStats();
    fetchUsers();
    fetchPublications();
    fetchReports();
  }, []);

  const fetchStats = async () => {
    const res = await instance.get('/api/admin/stats');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await instance.get('/api/admin/users');
    setUsers(res.data);
  };

  const fetchPublications = async () => {
    const res = await instance.get('/api/admin/publications');
    setPublications(res.data);
  };

  const fetchReports = async () => {
    const res = await instance.get('/api/admin/reports');
    setReports(res.data);
  };

  const blockUser = async (id: number) => {
    try {
      await instance.post(`/api/admin/users/${id}/block`);
      message.success('Пользователь заблокирован');
      fetchUsers();
    } catch {
      message.error('Ошибка при блокировке');
    }
  };

  const deletePublication = async (id: number) => {
    try {
      await instance.delete(`/api/admin/publications/${id}`);
      message.success('Публикация удалена');
      fetchPublications();
    } catch {
      message.error('Ошибка при удалении публикации');
    }
  };

  return (
    <Card style={{ maxWidth: 1000, margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Админ панель</Title>
        <Button type="primary" onClick={() => navigate('/admin/advertisements')}>
          Добавить рекламу
        </Button>
      </div>

      <p>👤 Пользователей: {stats.users_count}</p>
      <p>📄 Публикаций: {stats.publications_count}</p>
      <p>🚩 Жалоб: {stats.reports_count}</p>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Пользователи" key="1">
          <Table
            dataSource={users}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id' },
              { title: 'Имя', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              {
                title: 'Статус',
                dataIndex: 'is_blocked',
                filters: [
                  { text: 'Активен', value: false },
                  { text: 'Заблокирован', value: true },
                ],
                onFilter: (value, record) => record.is_blocked === value,
                render: (val) => (val ? 'Заблокирован' : 'Активен'),
              },
              {
                title: 'Действия',
                render: (record) =>
                  record.is_blocked ? (
                    'Заблокирован'
                  ) : (
                    <Popconfirm
                      title="Заблокировать пользователя?"
                      onConfirm={() => blockUser(record.id)}
                    >
                      <Button danger>Блокировать</Button>
                    </Popconfirm>
                  ),
              },
            ]}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Публикации" key="2">
          <Table
            dataSource={publications}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id' },
              { title: 'Название', dataIndex: 'title' },
              { title: 'Категория', dataIndex: 'category' },
              { title: 'Тип', dataIndex: 'type' },
              {
                title: 'Завершено',
                dataIndex: 'is_resolved',
                render: (val) => (val ? '✅' : '—'),
              },
              {
                title: 'Действия',
                render: (record) => (
                  <Popconfirm
                    title="Удалить публикацию?"
                    onConfirm={() => deletePublication(record.id)}
                  >
                    <Button danger>Удалить</Button>
                  </Popconfirm>
                ),
              },
            ]}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Жалобы" key="3">
          <Table
            dataSource={reports}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id' },
              { title: 'Жалобщик', dataIndex: 'reporter_name' },
              { title: 'На пользователя', dataIndex: 'reported_user_name' },
              { title: 'Публикация', dataIndex: 'publication_title' },
              { title: 'Сообщение', dataIndex: 'message' },
              {
                title: 'Действия',
                render: (record) => (
                  <>
                    {record.reported_user_id && (
                      <Popconfirm
                        title="Заблокировать пользователя?"
                        onConfirm={() => blockUser(record.reported_user_id)}
                      >
                        <Button size="small" danger style={{ marginRight: 8 }}>
                          Блокировать
                        </Button>
                      </Popconfirm>
                    )}
                    {record.publication_id && (
                      <Popconfirm
                        title="Удалить публикацию?"
                        onConfirm={() => deletePublication(record.publication_id)}
                      >
                        <Button size="small" danger>
                          Удалить
                        </Button>
                      </Popconfirm>
                    )}
                  </>
                ),
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default AdminPage;