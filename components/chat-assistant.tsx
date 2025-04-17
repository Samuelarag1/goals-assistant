"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "¡Hola! Soy Vera, tu asistente virtual. ¿En qué puedo ayudarte con tus metas de ventas hoy?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cerrar el chat con la tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simular respuesta del asistente después de un breve retraso
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content:
          "Gracias por tu mensaje. Vera está en desarrollo y pronto podré ayudarte con tus consultas sobre metas de ventas y estrategias de negocio.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50",
          "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800",
          "flex items-center justify-center"
        )}
        aria-label="Abrir chat con asistente virtual"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 shadow-2xl rounded-lg overflow-hidden">
          <Card className="border-t-4 border-t-blue-600">
            <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarImage
                    src="/vera.jpeg"
                    alt="Vera"
                    className="rounded-full object-cover"
                    width={32}
                  />
                  <AvatarFallback className="bg-blue-800 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Vera</h3>
                  <p className="text-xs text-blue-100">Asistente Virtual</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("mb-4 flex", {
                      "justify-end": message.sender === "user",
                    })}
                  >
                    <div
                      className={cn("max-w-[80%] rounded-lg p-3", {
                        "bg-blue-600 text-white": message.sender === "user",
                        "bg-white border border-gray-200 shadow-sm":
                          message.sender === "assistant",
                      })}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn("text-xs mt-1", {
                          "text-blue-200": message.sender === "user",
                          "text-gray-500": message.sender === "assistant",
                        })}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t">
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
