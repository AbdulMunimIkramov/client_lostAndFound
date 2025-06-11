import { useState } from "react";
import { Image, Modal } from "antd";
import "./ImageGallery.css"; // Импорт обычного CSS

interface Props {
  images: string[];
}

const ImageGallery = ({ images }: Props) => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setVisible(true);
  };

  if (!images || images.length === 0) {
    return (
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
    );
  }

  // Для одной картинки с поддержкой увеличения
  if (images.length === 1) {
    return (
      <div style={{ marginTop: 20 }}>
        <img
          alt="Изображение"
          src={images[0]}
          onClick={() => handleImageClick(images[0])}
          style={{
            maxHeight: 400,
            objectFit: "contain",
            objectPosition: "center",
            borderRadius: 8,
            cursor: "pointer",
          }}
        />

        <Modal
          open={visible}
          footer={null}
          onCancel={() => setVisible(false)}
          centered
          width="50%"
        >
          <img
            src={selectedImage!}
            alt="full"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Modal>
      </div>
    );
  }

  // Карусель для нескольких изображений
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Изображения</h3>
      <div className="image-container">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`img-${i}`}
            style={{
              height: 300,
              width: 300,
              objectFit: "cover",
              borderRadius: 8,
              cursor: "pointer",
              marginRight: 10,
              display: "inline-block",
            }}
            preview={false}
            onClick={() => handleImageClick(img)}
          />
        ))}
      </div>

      <Modal
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        centered
        width="50%"
      >
        <img
          src={selectedImage!}
          alt="full"
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Modal>
    </div>
  );
};

export default ImageGallery;