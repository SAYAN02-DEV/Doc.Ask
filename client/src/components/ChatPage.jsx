import { useRef, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([{message:"Hello!", sender: 1}, {message: "How can I help you?", sender: 0}]);
  const inputRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingBot, setLoadingBot] = useState(false);

  const handleSend = async () => {
    const text = inputRef.current.value.trim();
    if (!text) return;
    setMessages([...messages, { message: text, sender: 1 }, { message: "Wait, I am searching..", sender: 0, temp: true }]);
    inputRef.current.value = "";
    setLoadingBot(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/chat`,
        { query: text },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setMessages((prev) => {
        // Remove the last message if it's the temp 'Reading...'
        const newPrev = prev[prev.length - 1]?.temp ? prev.slice(0, -1) : prev;
        return [
          ...newPrev,
          { message: res.data?.data?.result || "No response.", sender: 0 },
        ];
      });
    } catch (err) {
      setMessages((prev) => {
        const newPrev = prev[prev.length - 1]?.temp ? prev.slice(0, -1) : prev;
        return [
          ...newPrev,
          { message: "Error: Could not get response from server.", sender: 0 },
        ];
      });
    } finally {
      setLoadingBot(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      const token = localStorage.getItem("auth_token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("File uploaded successfully!");
      // Add uploaded file name to the list
      if (res.data && res.data.filename) {
        setUploadedFiles((prev) => [...prev, res.data.filename]);
      } else {
        setUploadedFiles((prev) => [...prev, file.name]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <div
  className={`transition-all duration-500 bg-black border-r border-white overflow-hidden flex flex-col ${
    showSidebar ? "w-64 p-4" : "w-0 p-0"
  }`}
>
  {/* Title */}
  <p className="mb-4 text-lg font-bold text-white">Uploaded Document</p>

  {/* Uploaded documents area */}
  <div className="flex-1 overflow-y-auto text-white space-y-2 pr-1">
    {uploadedFiles.length === 0 ? (
      <p className="text-gray-400">No files uploaded yet.</p>
    ) : (
      uploadedFiles.map((filename, idx) => (
        <p key={idx} className="truncate">{filename}</p>
      ))
    )}
  </div>
  {/* Upload button at the bottom */}
  <div className="mt-4">
    <button
      className="bg-yellow-400 text-black px-6 py-3 w-full border border-white font-mono text-xl hover:scale-95 transition duration-200 disabled:opacity-60"
      onClick={handleUploadClick}
      disabled={uploading}
    >
      {uploading ? "Uploading..." : "+ Upload"}
    </button>
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleFileChange}
      disabled={uploading}
    />
  </div>
</div>


      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header with toggle button */}
        <div className="flex justify-between items-center p-4 border-b border-white  bg-black">
          <h2 className="text-xl font-bold">ChatBot ⚡</h2>
          <button
            onClick={() => setShowSidebar((prev) => !prev)}
            className="bg-white hover:bg-white text-black px-4 py-1  font-semibold"
          >
            {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 1 ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded shadow max-w-[75%] ${
                  msg.sender === 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="border-t border-white p-4 flex bg-black">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 border border-white rounded px-3 py-2 focus:outline-none focus:ring focus:border-white bg-black text-white placeholder-white"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && !loadingBot && handleSend()}
            disabled={loadingBot}
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-blue-500 hover:bg-white px-4 py-2  text-black font-semibold"
            disabled={loadingBot}
          >
            {loadingBot ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
