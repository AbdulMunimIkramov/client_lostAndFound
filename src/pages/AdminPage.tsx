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
      fetchReports();
    } catch {
      message.error('Ошибка при блокировке');
    }
  };

  const unblockUser = async (id: number) => {
    try {
      await instance.post(`/api/admin/users/${id}/unblock`);
      message.success('Пользователь разблокирован');
      fetchUsers();
      fetchReports();
    } catch {
      message.error('Ошибка при разблокировке');
    }
  };

  const deletePublication = async (id: number) => {
    try {
      await instance.delete(`/api/admin/publications/${id}`);
      message.success('Публикация удалена');
      fetchPublications();
      fetchReports();
    } catch {
      message.error('Ошибка при удалении публикации');
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Пользователи',
      children: (
        <Table
          dataSource={users}
          rowKey="id"
          columns={[
            { title: 'ID', dataIndex: 'id', sorter: (a, b) => a.id - b.id },
            { title: 'Имя', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
            { title: 'Email', dataIndex: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
            {
              title: 'Жалобы',
              dataIndex: 'report_count',
              sorter: (a, b) => b.report_count - a.report_count, // Сортировка по убыванию
            },
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
              render: (record) => (
                <Popconfirm
                  title={record.is_blocked ? 'Разблокировать пользователя?' : 'Заблокировать пользователя?'}
                  onConfirm={() => (record.is_blocked ? unblockUser(record.id) : blockUser(record.id))}
                >
                  <Button danger={record.is_blocked} type={record.is_blocked ? 'default' : 'primary'}>
                    {record.is_blocked ? 'Разблокировать' : 'Блокировать'}
                  </Button>
                </Popconfirm>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: '2',
      label: 'Публикации',
      children: (
        <Table
          dataSource={publications}
          rowKey="id"
          columns={[
            { title: 'ID', dataIndex: 'id', sorter: (a, b) => a.id - b.id },
            { title: 'Название', dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
            { title: 'Категория', dataIndex: 'category', sorter: (a, b) => a.category.localeCompare(b.category) },
            { title: 'Тип', dataIndex: 'type', sorter: (a, b) => a.type.localeCompare(b.type) },
            {
              title: 'Жалобы',
              dataIndex: 'report_count',
              sorter: (a, b) => b.report_count - a.report_count, // Сортировка по убыванию
            },
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
      ),
    },
    {
      key: '3',
      label: 'Жалобы',
      children: (
        <Table
          dataSource={reports}
          rowKey="id"
          columns={[
            { title: 'ID', dataIndex: 'id', sorter: (a, b) => a.id - b.id },
            { title: 'Жалобщик', dataIndex: 'reporter_name', sorter: (a, b) => a.reporter_name.localeCompare(b.reporter_name) },
            { title: 'На пользователя', dataIndex: 'reported_user_name' },
            { title: 'Публикация', dataIndex: 'publication_title' },
            { title: 'Сообщение', dataIndex: 'message' },
            {
              title: 'Действия',
              render: (record) => (
                <>
                  {record.reported_user_id && (
                    <Popconfirm
                      title={record.reported_user_blocked ? 'Разблокировать пользователя?' : 'Заблокировать пользователя?'}
                      onConfirm={() => (record.reported_user_blocked ? unblockUser(record.reported_user_id) : blockUser(record.reported_user_id))}
                    >
                      <Button
                        size="small"
                        danger={!record.reported_user_blocked}
                        style={{ marginRight: 8 }}
                      >
                        {record.reported_user_blocked ? 'Разблокировать' : 'Блокировать'}
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
      ),
    },
  ];

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

      <Tabs defaultActiveKey="1" items={tabItems} />
    </Card>
  );
};

export default AdminPage;