import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm here to help you with any questions about the Rwanda MVP program. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse: Message = {
        text: "Thank you for your question. Based on your query, I'd recommend checking the SkillCraft test section or reviewing your pathways. Is there anything specific you'd like to know more about?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/beneficiary">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="bg-gradient-to-r from-[#00A1DE] to-[#00A651] text-white">
            <CardTitle>AI Support Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-[#00A1DE] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
              />
              <Button onClick={handleSend} className="bg-[#00A1DE] hover:bg-[#0081B8]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
