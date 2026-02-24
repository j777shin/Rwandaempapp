import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  Circle,
  Loader2,
  FileText,
  Download,
  FastForward,
  RotateCcw,
  Target,
  Trash2,
} from "lucide-react";
import { api } from "@/app/lib/api";
import { Link } from "react-router";

interface ChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  created_at: string;
}

interface Stage {
  stage_number: number;
  stage_name: string;
  status: string;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<number | null>(null);
  const [currentStageName, setCurrentStageName] = useState<string>("");
  const [completed, setCompleted] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [isTestAccount, setIsTestAccount] = useState(false);
  const [navigatingStage, setNavigatingStage] = useState(false);
  const [businessGoal, setBusinessGoal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatbotStatus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatbotStatus = async () => {
    try {
      const data = await api.getChatbotStatus();
      // Chat history is not persisted — messages stay in local state only
      setStages(data.stages || []);
      setCurrentStage(data.current_stage);
      setCurrentStageName(data.current_stage_name || "");
      setCompleted(data.completed);
      setReportReady(data.report_ready);
      setIsTestAccount(data.is_test_account || false);
      setBusinessGoal(data.business_development_goal || "");

      // If chatbot is active and no local messages, send initial greeting
      if (data.current_stage && !data.completed) {
        await sendInitialMessage();
      }
    } catch (err) {
      console.error("Failed to load chatbot status:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendInitialMessage = async () => {
    const initialMsg = "Hello, I'd like to start the business idea exploration based on my business development goal.";
    try {
      const result = await api.sendChatMessage(initialMsg, []);
      setMessages([
        {
          id: Date.now().toString(),
          message: initialMsg,
          is_user: true,
          created_at: new Date().toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          message: result.response,
          is_user: false,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to send initial message:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending || completed) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      is_user: true,
      created_at: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      // Send full conversation history to the backend
      const historyForApi = updatedMessages.map((m) => ({
        message: m.message,
        is_user: m.is_user,
      }));

      const result = await api.sendChatMessage(userMessage, historyForApi);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          message: result.response,
          is_user: false,
          created_at: new Date().toISOString(),
        },
      ]);

      // Update stage if changed
      if (result.stage_completed) {
        setStages((prev) =>
          prev.map((s) =>
            s.stage_number === result.current_stage
              ? { ...s, status: "completed" }
              : s.stage_number === result.current_stage + 1
              ? { ...s, status: "in_progress" }
              : s
          )
        );
        if (!result.chatbot_completed) {
          setCurrentStage(result.current_stage + 1);
        }
      }

      if (result.chatbot_completed) {
        setCompleted(true);
        setReportReady(true);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          message: "Sorry, something went wrong. Please try again.",
          is_user: false,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFinishStage = async () => {
    if (finishing || sending || completed || !currentStage) return;
    setFinishing(true);

    try {
      const historyForApi = messages.map((m) => ({
        message: m.message,
        is_user: m.is_user,
      }));

      const result = await api.finishChatbotStage(historyForApi);

      if (result.stage_completed) {
        setStages((prev) =>
          prev.map((s) =>
            s.stage_number === result.completed_stage
              ? { ...s, status: "completed" }
              : s.stage_number === result.completed_stage + 1
              ? { ...s, status: "in_progress" }
              : s
          )
        );

        if (result.chatbot_completed) {
          setCompleted(true);
          setReportReady(true);
          setCurrentStage(null);
          setCurrentStageName("");
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message:
                "Assessment complete! Your report has been generated. You can view it in the sidebar.",
              is_user: false,
              created_at: new Date().toISOString(),
            },
          ]);
        } else {
          const nextStageNum = result.completed_stage + 1;
          setCurrentStage(nextStageNum);
          const nextStage = stages.find((s) => s.stage_number === nextStageNum);
          setCurrentStageName(nextStage?.stage_name || "");
          setMessages([]);
          // Small delay to let state settle before sending initial message
          setTimeout(async () => {
            await sendInitialMessage();
          }, 100);
        }
      }
    } catch (err) {
      console.error("Failed to finish stage:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: "Failed to finish the stage. Please try again.",
          is_user: false,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setFinishing(false);
    }
  };

  const handleGoToStage = async (stageNumber: number) => {
    if (navigatingStage || sending || finishing) return;
    setNavigatingStage(true);

    try {
      const result = await api.goToChatbotStage(stageNumber);
      if (result.success) {
        // Load previous conversation history if it exists
        const prevConversation: { message: string; is_user: boolean }[] =
          result.previous_conversation || [];

        const restoredMessages: ChatMessage[] = prevConversation.map(
          (msg: { message: string; is_user: boolean }, idx: number) => ({
            id: `restored-${idx}`,
            message: msg.message,
            is_user: msg.is_user,
            created_at: new Date().toISOString(),
          })
        );

        setMessages(restoredMessages);
        setCurrentStage(stageNumber);
        const targetStage = stages.find((s) => s.stage_number === stageNumber);
        setCurrentStageName(targetStage?.stage_name || "");
        setCompleted(false);
        setReportReady(false);

        // Refresh stages from server
        const status = await api.getChatbotStatus();
        setStages(status.stages || []);

        // If no previous conversation, send initial greeting
        if (restoredMessages.length === 0) {
          await sendInitialMessage();
        }
      }
    } catch (err) {
      console.error("Failed to navigate to stage:", err);
    } finally {
      setNavigatingStage(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.downloadReportPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "entrepreneurship_report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-background flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)] bg-background">
      {/* Stage Sidebar */}
      <div className="w-64 border-r border-border bg-white p-4 flex-shrink-0 overflow-y-auto">
        <h3 className="font-semibold text-foreground mb-4">Assessment Stages</h3>
        <div className="space-y-3">
          {stages.map((stage) => {
            const canGoBack =
              isTestAccount &&
              stage.status === "completed" &&
              !navigatingStage;

            return (
              <div
                key={stage.stage_number}
                onClick={canGoBack ? () => handleGoToStage(stage.stage_number) : undefined}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  stage.status === "in_progress"
                    ? "bg-primary/5 border border-primary/20"
                    : stage.status === "completed"
                    ? "bg-green-50"
                    : "bg-neutral-50"
                } ${canGoBack ? "cursor-pointer hover:bg-green-100" : ""}`}
              >
                {stage.status === "completed" ? (
                  canGoBack ? (
                    <RotateCcw className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )
                ) : stage.status === "in_progress" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      stage.status === "in_progress"
                        ? "text-primary"
                        : stage.status === "completed"
                        ? "text-green-700"
                        : "text-neutral-400"
                    }`}
                  >
                    Stage {stage.stage_number}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.stage_name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report Section */}
        {reportReady && (
          <div className="mt-6 space-y-2">
            <div className="border-t border-border pt-4">
              <Badge className="bg-green-100 text-green-800 border-green-300 mb-3">
                Assessment Complete
              </Badge>
              <Link to="/beneficiary/results">
                <Button variant="outline" size="sm" className="w-full mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  View Report
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadPdf}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Entrepreneurship Mentor</h2>
            {currentStageName && !completed && (
              <Badge variant="outline" className="ml-2 text-primary border-primary">
                {currentStageName}
              </Badge>
            )}
            {completed && (
              <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Business Development Goal */}
        {businessGoal && (
          <div className="border-b border-border bg-primary/5 px-6 py-3">
            <div className="max-w-3xl mx-auto flex items-start gap-3">
              <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Business Development Goal</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{businessGoal}</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_user ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.is_user
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-neutral-100 text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.is_user ? "text-white/60" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {(sending || finishing) && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-white px-6 py-4">
          <div className="max-w-3xl mx-auto flex gap-3 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                completed
                  ? "Assessment completed. View your report!"
                  : "Type your response..."
              }
              disabled={sending || completed || finishing}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending || completed || finishing}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
            {!completed && currentStage && messages.length > 0 && (
              <Button
                onClick={async () => {
                  setMessages([]);
                  await sendInitialMessage();
                }}
                disabled={sending || finishing}
                variant="outline"
                className="whitespace-nowrap border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                title="Clear chat history and start fresh"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
            {!completed && currentStage && (
              <Button
                onClick={handleFinishStage}
                disabled={sending || finishing || messages.length < 2}
                variant="outline"
                className="whitespace-nowrap border-orange-300 text-orange-700 hover:bg-orange-50"
                title="Save conversation and move to next stage"
              >
                {finishing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <FastForward className="w-4 h-4 mr-2" />
                )}
                Finish Stage
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
