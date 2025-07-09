import React, { useState, useEffect, useContext } from 'react';
import './Editor.css';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Sidebar from './Sidebar';
import Loader from '../../components/Loader/Loader';
import { Context } from '../../components/context/context';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FiMessageCircle } from 'react-icons/fi';
import { io } from "socket.io-client";
import { useRef } from 'react';
import useDeviceType from '../../hooks/useDeviceType';


const SOCKET_SERVER_URL = "https://codask.onrender.com";

const Editor = () => {
  const { id } = useParams();
  const { editorData, setEditorData, BASE_URL, user } = useContext(Context);

  const [activeFile, setActiveFile] = useState(null);
  const [previewMode, setPreviewMode] = useState("split");
  const [loading, setLoading] = useState(true);
  const [previewHTML, setPreviewHTML] = useState("");
  const [logs, setLogs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const { isDesktop, isLaptop, isMobile } = useDeviceType();

  const [editorMenu, setEditorMenu] = useState(false)

  // Chat modal state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [socket, setSocket] = useState("");

  const chatMessageEndRef = useRef(null);

  // Fetch project data
  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/project/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setEditorData(data);
      } else {
        toast.error("Failed to fetch project data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the project");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getMessages?projectId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const messages = await res.json();
      setChatMessages(messages);
    } catch (err) {
      toast.error("Could not load previous messages");
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (editorData?.files?.length > 0) {
      setActiveFile(editorData.files[0]);
      setLogs([]);
    }
  }, [editorData]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", { id, user });

    newSocket.on("userJoined", (user) => {
      toast.info(`${user.username} joined!`)
    })

    newSocket.on("receiveMessage", (Message) => {
      setChatMessages((prevMessages) => [...prevMessages, Message])
    })

    newSocket.on("activeUserUpdate", (activeUsers) => {
      setActiveUsers(activeUsers)
    })

    newSocket.on("userTyping", (user) => {
      setTypingUser(user);

      setTimeout(() => {
        setTypingUser(null)
      }, 2500)
    });

    return () => {
      newSocket.disconnect();
    }
  }, [id])

  const handleNewFile = (newFile) => {
    setEditorData(prev => ({
      ...prev,
      files: [...(prev.files || []), newFile]
    }));
    setActiveFile(newFile);
    setLogs([]);
  };

  const handleSendMessage = () => {
    socket.emit("sentMessage", {
      projectId: id,
      sender: user._id,
      content: chatInput.trim()
    })
    setChatInput("");
  };

  const handleChatToggle = () => {
    if (!chatOpen) {
      fetchPreviousMessages();
    }
    setChatOpen(prev => !prev);
  }

  useEffect(() => {
    if (chatMessageEndRef.current) {
      chatMessageEndRef.current.scrollIntoView({ behaviour: "smooth" })
    }
  }, [chatMessages])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${amPm}`
  }

  useEffect(() => {
    if (isDesktop || isLaptop || isMobile) {
      setPreviewMode("split");
    }
  }, [isDesktop, isLaptop, isMobile]);



  if (loading) return <Loader />;

  return (
    <div className="editor-layout">
      <Sidebar
        files={editorData?.files || []}
        members={editorData?.members || []}
        onFileSelect={(file) => {
          setActiveFile(file);
          setLogs([]);
        }}
        onNewFile={handleNewFile}
        projectId={id}
        fetchProject={fetchProject}
        activeUsers={activeUsers}
        typingUser={typingUser}
        editorMenu={editorMenu}
        setEditorMenu={setEditorMenu}
      />

      <div className={`editor-main ${previewMode} ${isMobile ? "mobile-layout" : isLaptop ? "laptop-layout" : "desktop-layout"}`}>
        {previewMode !== "preview" && (
          <EditorPanel
            files={editorData.files}
            file={activeFile}
            setPreviewHTML={setPreviewHTML}
            logs={logs}
            setLogs={setLogs}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            socket={socket}
            editorMenu={editorMenu}
            setEditorMenu={setEditorMenu}
          />
        )}
        {previewMode !== "editor" && (
          <PreviewPanel
            previewHTML={previewHTML}
            file={activeFile}
            logs={logs}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
          />
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        className="chat-toggle-btn"
        onClick={handleChatToggle}
        aria-label={chatOpen ? "Close chat" : "Open chat"}
        title={chatOpen ? "Close Chat" : "Open Chat"}
      >
        <FiMessageCircle />
      </button>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <h3>Project Chat</h3>
            <button
              className="close-chat-btn"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <p className="chat-empty-msg">No messages yet. Start chatting!</p>
            )}
            {chatMessages.map((msg, i) => {
              const isMe = msg.sender._id === user._id;

              return (
                <div
                  key={i}
                  className={`chat-message-wrapper ${isMe ? "me" : "other"}`}
                >
                  <div className="chat-bubble">
                    <div className="chat-sender" style={{ color: isMe ? "#003344" : "#A0A0A0" }}>{isMe ? "You" : msg.sender.username}</div>
                    <div className="msg-content">
                      <div className="chat-content">{msg.content}</div>
                      <div className="chat-timestamp" style={{ color: isMe ? "#003344" : "#A0A0A0" }}>{formatTimestamp(msg.createdAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatMessageEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage} className="send-btn">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
