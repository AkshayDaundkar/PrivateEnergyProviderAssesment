import { useState, useEffect } from "react";
import axios from "axios";
import { FiSend, FiMessageCircle, FiX, FiTrash } from "react-icons/fi";

import ScrollToBottom from "react-scroll-to-bottom";
type Message = { sender: "user" | "ai"; text: string };

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("aichat");
    if (stored) {
      setMessages(JSON.parse(stored));
      setInitialized(true);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("aichat", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages: Message[] = [
      ...messages,
      { sender: "user", text: trimmed },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.get(`${baseURL}/generate-predictions`);
      const response = await axios.post(
        `${baseURL}/ai-insight`,
        new URLSearchParams({ query: trimmed }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.answer },
      ]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I couldn't process your request." },
      ]);
    }
    setLoading(false);
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!initialized) {
      const welcome: Message[] = [
        {
          sender: "ai",
          text: `Hi there! I am your Data Representor from PEP 👋
            You can ask me any energy-related questions such as:
            • What is the energy consumption of India in 2025?
            • Show analysis for USA from 2020 to 2024
            
            I will provide insightful answers using advanced AI/ML models.`,
        },
      ];
      setMessages(welcome);
      setInitialized(true);
    }
  };

  return (
    <div>
      {/* Toggle Chatbot Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={handleToggle}
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 max-w-full h-108 bg-white rounded-2xl shadow-xl border border-gray-300 flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white p-4 font-semibold flex justify-between items-center">
            <span>⚡ Energy Insight Assistant</span>
            <button
              className="text-sm underline text-white hover:text-red-300 ml-2"
              onClick={() => {
                localStorage.removeItem("aichat");
                setMessages([]);
                setInitialized(false);
              }}
            >
              <FiTrash size={18} />
            </button>
          </div>

          <ScrollToBottom className="flex-1 p-4 overflow-y-auto max-h-[400px] bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 text-sm ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-200 ml-auto"
                      : "bg-green-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 italic">
                AI is thinking...
              </div>
            )}
          </ScrollToBottom>
          <div className="flex border-t">
            <input
              className="flex-1 px-4 py-2 border-none focus:outline-none"
              placeholder="Ask your energy question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="p-3 text-blue-600 hover:text-blue-800"
              onClick={handleSend}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
