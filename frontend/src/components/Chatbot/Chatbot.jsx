import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "Sorry, I couldn't reply." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error contacting server." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {!open && (
        <div className="chat-circle" onClick={() => setOpen(true)}>
          🤖
        </div>
      )}

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            GKA Assistant
            <span className="close-btn" onClick={() => setOpen(false)}>
              ×
            </span>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-msg bot">Thinking...</div>}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
