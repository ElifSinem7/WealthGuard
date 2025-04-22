import React, { useState } from "react";
import { Modal, Box, Typography, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { FaTrash } from "react-icons/fa";

const NotificationModal = ({ open, onClose, notifications }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const handleMarkAsRead = (index) => {
    const updated = [...localNotifications];
    updated[index].read = true;
    setLocalNotifications(updated);
  };

  const handleDelete = (index) => {
    const updated = localNotifications.filter((_, i) => i !== index);
    setLocalNotifications(updated);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="notification-modal-title" aria-describedby="notification-modal-description">
      <Box sx={modalStyle}>
        <Typography variant="h6" id="notification-modal-title">
          Bildirimler
        </Typography>

        <List sx={{ maxHeight: 400, overflowY: "auto", marginTop: 2 }}>
          {localNotifications.length > 0 ? (
            localNotifications.map((notification, index) => (
              <ListItem
                key={index}
                onClick={() => handleMarkAsRead(index)}
                sx={{
                  backgroundColor: notification.read ? "#f9f9f9" : "#ede9fe",
                  borderBottom: "1px solid #ddd",
                  padding: "8px 12px",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e) => {
                    e.stopPropagation(); // modal dışı tıklama olarak sayılmasın
                    handleDelete(index);
                  }}>
                    <FaTrash size={12} color="gray" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={notification.read ? "normal" : "bold"}>
                      {notification.message}
                    </Typography>
                  }
                  secondary={`Tarih: ${notification.date}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">Yeni bildirim yok.</Typography>
          )}
        </List>

        <Button onClick={onClose} sx={{ marginTop: 2 }} variant="contained">
          Kapat
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default NotificationModal;
