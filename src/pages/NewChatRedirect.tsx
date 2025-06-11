import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { useAuth } from "../hooks/useAuth";

const NewChatRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    const createOrGetChat = async () => {
      const receiverId = searchParams.get("receiverId");
      const publicationId = searchParams.get("publicationId");

      if (!receiverId || !publicationId) {
        message.error("Недостаточно данных для создания чата");
        return navigate("/");
      }

      if (!token) {
        message.error("Не авторизован");
        return navigate("/");
      }

      try {
        const res = await axios.post(
          "http://localhost:8000/api/chats/create",
          {
            receiverId: Number(receiverId),
            publicationId: Number(publicationId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const chatId = res.data.chatId;
        navigate(`/chats/${chatId}`);
      } catch (err) {
        message.error("Ошибка при создании чата");
        console.error(err);
        navigate("/");
      }
    };

    createOrGetChat();
  }, [searchParams, token, navigate]);

  return null;
};

export default NewChatRedirect;