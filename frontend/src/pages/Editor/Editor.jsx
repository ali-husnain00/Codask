import React, { useState, useEffect, useContext } from 'react';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Sidebar from './Sidebar';
import Loader from '../../components/Loader/Loader';
import { Context } from '../../components/context/context';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import { io } from "socket.io-client";
import { useRef } from 'react';
import useDeviceType from '../../hooks/useDeviceType';
import { apiRequest } from '../../lib/apiClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';


const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;;

const Editor = () => {
  const { id } = useParams();
  const { editorData, setEditorData, BASE_URL, user } = useContext(Context);

  const [activeFile, setActiveFile] = useState(null);
  const [previewMode, setPreviewMode] = useState("split");
  const [loading, setLoading] = useState(true);
  const [previewHTML, setPreviewHTML] = useState("");
  const [logs, setLogs] = useState([]);
  const [stdin, setStdin] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const { isDesktop, isLaptop, isTablet, isMobile } = useDeviceType();

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
      const data = await apiRequest(BASE_URL, `/project/${id}`);
      setEditorData(data.data || data);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching the project");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const data = await apiRequest(BASE_URL, `/getMessages?projectId=${id}`);
      setChatMessages(data.data || data);
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
    if (isDesktop || isLaptop || isTablet || isMobile) {
      setPreviewMode("split");
    }
  }, [isDesktop, isLaptop, isTablet, isMobile]);



  if (loading) return <Loader />;

  return (
    <div className="flex h-[calc(100dvh-64px)] w-full bg-[var(--background)]">
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

      <div className="flex flex-col lg:flex-row h-full w-full min-w-0 flex-1 overflow-hidden">
        {previewMode !== "preview" && (
          <EditorPanel
            files={editorData.files}
            file={activeFile}
            setActiveFile={setActiveFile}
            setPreviewHTML={setPreviewHTML}
            logs={logs}
            setLogs={setLogs}
            stdin={stdin}
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
            stdin={stdin}
            setStdin={setStdin}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
          />
        )}
      </div>

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-4 right-4 z-[1000] flex h-12 w-12 rounded-full p-0 shadow-lg"
        onClick={handleChatToggle}
        aria-label={chatOpen ? "Close chat" : "Open chat"}
        title={chatOpen ? "Close Chat" : "Open Chat"}
      >
        <MessageCircle size={20} />
      </Button>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="chat-modal">
          <div className="fixed bottom-20 right-4 z-[1001] flex w-[min(360px,calc(100vw-32px))] h-[500px] max-h-[calc(100dvh-120px)] flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">Project Chat</h3>
            <Button variant="ghost" className="h-6 w-6 p-0 text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => setChatOpen(false)} aria-label="Close chat">✕</Button>
          </div>

          <div className="flex min-h-[200px] flex-1 flex-col gap-3 overflow-auto p-3">
            {chatMessages.length === 0 && (
              <p className="mt-[20%] text-center text-sm italic text-[var(--text-muted)]">No messages yet. Start chatting!</p>
            )}
            {chatMessages.map((msg, i) => {
              const isMe = msg.sender._id === user._id;

              return (
                <div
                  key={i}
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${isMe ? "rounded-br-sm bg-[var(--primary)] text-[var(--background)]" : "rounded-bl-sm bg-[var(--background)] text-[var(--text)]"}`}>
                    <div className="chat-sender" style={{ color: isMe ? "#003344" : "#A0A0A0" }}>{isMe ? "You" : msg.sender.username}</div>
                    <div className={`${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className="chat-content">{msg.content}</div>
                      <div className="chat-timestamp" style={{ color: isMe ? "#003344" : "#A0A0A0" }}>{formatTimestamp(msg.createdAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatMessageEndRef} />
          </div>

          <div className="flex flex-shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex w-full items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-1 py-1 focus-within:border-[var(--ring)] focus-within:ring-1 focus-within:ring-[var(--ring)]">
              <Input
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-2"
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} className="h-8 px-3 text-xs" disabled={!chatInput.trim()}>Send</Button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
