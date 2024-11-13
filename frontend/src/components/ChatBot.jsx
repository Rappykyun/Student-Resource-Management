import { useState, useEffect, useRef } from "react";
import { Bot, X, Maximize2, Minimize2, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const API_BASE_URL = "http://localhost:5000/api";

export function ChatBot() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/dashboard/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      content: inputMessage,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/dashboard/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      if (data.status === "success") {
        const botResponses = data.data.map((msg) => ({
          content: msg.text,
          type: "bot",
          timestamp: new Date(),
        }));
        setMessages((prev) => [...prev, ...botResponses]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Bot className="h-6 w-6" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`w-[380px] shadow-lg transition-all duration-300 ease-in-out ${
                isMinimized ? "h-[60px]" : "h-[500px]"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Study Assistant
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-primary-foreground hover:text-primary-foreground/80"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-foreground hover:text-primary-foreground/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent className="p-4 flex-1 overflow-hidden">
                    <ScrollArea className="h-[340px] pr-4">
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-2 mb-4 ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.type === "bot" && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/bot-avatar.png" alt="Bot" />
                              <AvatarFallback>BOT</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {message.content}
                          </div>
                          {message.type === "user" && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/user-avatar.png" alt="User" />
                              <AvatarFallback>YOU</AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-2 justify-start"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/bot-avatar.png" alt="Bot" />
                            <AvatarFallback>BOT</AvatarFallback>
                          </Avatar>
                          <div className="bg-secondary text-secondary-foreground rounded-lg p-3 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Typing...
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <form onSubmit={sendMessage} className="flex w-full gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
