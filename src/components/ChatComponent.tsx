// src/components/ChatComponent.tsx

import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import {
  Card,
  Button,
  Typography,
  List,
  Input,
  Spin,
  message,
} from "antd";
import { getCurrentUser } from "../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Chat {
  id: number;
  publication_id: number;
  sender_id: number;
  receiver_id: number;
  created_at: string;
  sender_name: string;
  receiver_name: string;
  publication_title: string;
}

const ChatComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const userId = user?.id;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [Message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [publication, setPublication] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Подключение к WebSocket и начальная загрузка
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchChats();

    const state = location.state as { publication?: any };
    if (state?.publication) {
      setPublication(state.publication);
    }

    const socketUrl = `ws://localhost:8000/ws?userId=${userId}`;
    console.log("🔗 WebSocket URL:", socketUrl);
    ws.current = new WebSocket(socketUrl);
    ws.current.onopen = () => console.log("✅ WebSocket подключен");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (
        data.type === "new_message" &&
        selectedChat?.id === data.message.chat_id
      ) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    ws.current.onerror = (err) => console.error("WebSocket ошибка:", err);
    ws.current.onclose = () => console.log("WebSocket отключен");

    // return () => {
    //   ws.current?.close();
    // };
  }, [userId, navigate, location.state, selectedChat?.id]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("api/chats");
      setChats(response.data.chats);
      if (response.data.chats.length > 0 && !selectedChat) {
        setSelectedChat(response.data.chats[0]);
      }
    } catch (err) {
      console.error("Ошибка при загрузке чатов:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/chats/${selectedChat?.id}/messages`);
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Ошибка при загрузке сообщений:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!Message.trim() || !selectedChat?.id || !userId) {
      message.error("Не выбран чат или сообщение пустое");
      return;
    }

    try {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            chatId: selectedChat.id,
            senderId: userId,
            receiverId:
              selectedChat.sender_id === userId
                ? selectedChat.receiver_id
                : selectedChat.sender_id,
            content: Message,
          })
        );
        setMessage("");
      } else {
        throw new Error("WebSocket не подключен");
      }
    } catch (err) {
      console.error("Ошибка при отправке сообщения:", err);
      message.error("Ошибка при отправке сообщения");
    }
  };

  const handleStartChat = async () => {
    if (
      !userId ||
      !publication ||
      !publication.user_id ||
      publication.user_id === userId
    )
      return;

    setLoading(true);
    try {
      const response = await axios.post("api/chats", {
        publicationId: publication.id,
        receiverId: publication.user_id,
        firstMessage: newMessage || "Начало чата",
      });
      const newChat = response.data.chat;
      setChats([...chats, newChat]);
      setSelectedChat(newChat);
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Ошибка при создании чата:", err);
      message.error("Ошибка при создании чата");
    } finally {
      setLoading(false);
    }
  };

  // Прокрутка вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  if (!userId) return null;

  return (
    <Card style={{ maxWidth: 900, margin: "20px auto" }}>
      <Title level={2}>Чаты</Title>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "30%",
            borderRight: "1px solid #ccc",
            paddingRight: "20px",
          }}
        >
          <List
            dataSource={chats}
            renderItem={(chat) => (
              <List.Item
                onClick={() => setSelectedChat(chat)}
                style={{
                  cursor: "pointer",
                  background:
                    selectedChat?.id === chat.id ? "#f0f0f0" : "transparent",
                }}
              >
                <Text strong>{chat.publication_title}</Text> ({chat.sender_name}{" "}
                ↔ {chat.receiver_name})
              </List.Item>
            )}
          />
          {publication && publication.user_id !== userId && (
            <div style={{ marginTop: "10px" }}>
              <TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Первое сообщение..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ marginBottom: "10px" }}
              />
              <Button
                type="primary"
                onClick={handleStartChat}
                disabled={loading}
                block
              >
                Начать чат с автором
              </Button>
            </div>
          )}
        </div>
        <div style={{ width: "70%", paddingLeft: "20px" }}>
          {selectedChat ? (
            <>
              <Title level={3}>Чат: {selectedChat.publication_title}</Title>
              <div
                style={{
                  height: "400px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: "10px",
                      textAlign:
                        msg.sender_id === userId ? "right" : "left",
                    }}
                  >
                    <Text strong>
                      {msg.sender_id === userId ? "Вы" : "Автор"}:
                    </Text>{" "}
                    {msg.content}
                    <br />
                    <Text type="secondary">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </Text>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <TextArea
                value={Message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <Button type="primary" onClick={handleSendMessage} block>
                Отправить
              </Button>
            </>
          ) : (
            <div>Выберите чат или начните новый с публикации</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatComponent;