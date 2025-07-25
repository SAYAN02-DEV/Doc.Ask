import { useRef, useState } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState(["Hello!", "How can I help you?"]);
  const inputRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSend = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;
    setMessages([...messages, text]);
    inputRef.current.value = "";
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
    {/* Example documents - Replace these with dynamic rendering */}
    <p className="truncate">document_1.pdf</p>
    <p className="truncate">notes_about_project.txt</p>
    <p className="truncate">summary_final_version.docx</p>
    {/* Add more items here dynamically */}
  </div>

  {/* Upload button at the bottom */}
  <div className="mt-4">
    <button
      className="bg-yellow-400 text-black px-6 py-3 w-full border border-white font-mono text-xl hover:scale-95 transition duration-200"
    >
      + Upload
    </button>
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
              className="bg-white text-black px-4 py-2 rounded shadow w-fit max-w-[75%]"
            >
              {msg}
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-blue-500 hover:bg-white px-4 py-2  text-black font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
