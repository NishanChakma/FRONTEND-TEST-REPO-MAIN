"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIModelType } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { handlePDF } from "@/lib/handlePDF";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type DocumentOption = {
  label: string;
  value: string;
};

const dropdownOptions = Object.keys(AIModelType).map((key) => ({
  label: key,
  value: AIModelType[key as keyof typeof AIModelType],
}));

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typeFilter, setTypeFilter] = useState("openai/gpt-oss-20b:free");
  const [selectedDoc, setSelectedDoc] = useState("");
  const [docText, setDocText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load Chat History
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  //  Documents Query
  const { data: documents, isLoading } = useQuery<DocumentOption[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/documents`);
        return data.map((item: any) => ({
          label: item.title,
          value: item.id,
        }));
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load documents");
        throw err;
      }
    },
    retry: 1,
  });

  // Chat Mutation
  const mutation = useMutation<
    string,
    Error,
    { message: string; docText: string }
  >({
    mutationFn: async ({ message, docText }) => {
      const body = {
        model: typeFilter,
        messages: [
          ...messages,
          {
            role: "user",
            content: docText
              ? `PDF Content:\n${docText}\n\nQuestion:\n${message}`
              : message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      const response = data?.choices?.[0]?.message;
      return response?.content?.trim()
        ? response.content
        : response?.reasoning ?? "No response";
    },

    onSuccess: (assistantMessage, variables) => {
      const updatedMessages: Message[] = [
        ...messages,
        { role: "user", content: variables.message },
        { role: "assistant", content: assistantMessage },
      ];

      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    },
  });

  // Load PDF Text
  useEffect(() => {
    if (!selectedDoc) return;

    setDocText("");
    handlePDF(selectedDoc)
      .then((res) => setDocText(res))
      .catch(() => toast.error("Failed to load document"));
  }, [selectedDoc]);

  // Handlers/submit button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    mutation.mutate({
      message: input,
      docText,
    });

    setInput("");
    setSelectedDoc("");
    setDocText("");
  };

  const clearData = useCallback(() => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    setSelectedDoc("");
    setDocText("");
  }, []);

  return (
    <Card
      className="dark:bg-gray-900 dark:border-gray-800 flex flex-col relative"
      style={{ height: "calc(97vh - 100px)" }}
    >
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Chat with AI</CardTitle>
        <CardDescription className="text-sm mb-1">
          Chat with an AI assistant.
        </CardDescription>

        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-center">
            <p className="text-sm">AI Model</p>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isLoading && (
            <div className="flex gap-2 items-center">
              <p className="text-sm">Document</p>
              <Select value={selectedDoc} onValueChange={setSelectedDoc}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Document" />
                </SelectTrigger>
                <SelectContent style={{ height: 300 }}>
                  {(documents ?? []).map((doc) => (
                    <SelectItem key={doc.value} value={doc.value}>
                      {doc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <div
        className="absolute top-8 right-8 cursor-pointer rounded border border-gray-400 px-2 py-1 text-xs"
        onClick={clearData}
      >
        Clear Chat
      </div>

      <CardContent className="flex-1 flex flex-col overflow-hidden pb-1">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-6 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-xl ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <hr />

        <form onSubmit={handleSubmit} className="flex gap-3 pt-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {mutation.isPending ? "Sending..." : "Send"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
