import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PaperclipIcon, SendIcon, XIcon, ImageIcon, FileIcon, ChevronRightIcon } from "lucide-react";
import { getAIResponse, analyzeCDPData, sampleCDPData, ChatMessage } from "../../lib/openai";
import "./ChatbotPane.css";

interface ChatbotPaneProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface Message {
  content: string;
  isUser: boolean;
  attachments?: Attachment[];
  isLoading?: boolean;
}

interface InsertResponseProps {
  response: string;
}

export const ChatbotPane: React.FC<ChatbotPaneProps & { onInsertResponse?: (response: string) => void }> = ({ 
  isOpen, 
  onClose, 
  embedded = false,
  onInsertResponse 
}) => {
  const [mode, setMode] = useState<"chat" | "write">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! I'm your Copilot assistant for CDP Climate disclosures. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(380);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentPanel, setShowAttachmentPanel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartWidthRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle resize logic
  const handleResizeStart = (e: React.MouseEvent) => {
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = width;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResize = (e: MouseEvent) => {
    if (dragStartXRef.current !== null && dragStartWidthRef.current !== null) {
      const newWidth = dragStartWidthRef.current - (e.clientX - dragStartXRef.current);
      // Limit width between 320px and 600px
      if (newWidth >= 320 && newWidth <= 600) {
        setWidth(newWidth);
      }
    }
  };

  const handleResizeEnd = () => {
    dragStartXRef.current = null;
    dragStartWidthRef.current = null;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => {
      // Format file size
      let size = file.size;
      let sizeStr = size + " B";
      if (size > 1024) {
        size = Math.floor(size / 1024);
        sizeStr = size + " KB";
      }
      if (size > 1024) {
        size = Math.floor(size / 1024);
        sizeStr = size + " MB";
      }

      return {
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        type: file.type.split('/')[0],
        size: sizeStr
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttachmentPanel(true);
    
    // Reset the file input for future uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
    if (attachments.length <= 1) {
      setShowAttachmentPanel(false);
    }
  };

  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async () => {
    if (input.trim() || attachments.length > 0) {
      // Create a new message with attachments if present
      const userMessage = {
        content: input.trim(),
        isUser: true,
        attachments: attachments.length > 0 ? [...attachments] : undefined
      };
      
      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setAttachments([]);
      setShowAttachmentPanel(false);
      
      // Add loading message
      setIsProcessing(true);
      const loadingMessage = { content: "Thinking...", isUser: false, isLoading: true };
      setMessages(prev => [...prev, loadingMessage]);
      
      try {
        // Convert chat history to OpenAI format
        const chatHistory: ChatMessage[] = messages
          .filter(msg => !msg.isLoading)
          .map(msg => ({
            content: msg.content,
            role: msg.isUser ? 'user' : 'assistant'
          }));
        
        // Add system context message
        const contextMessage: ChatMessage = {
          role: 'system',
          content: `You are a helpful climate disclosure assistant specializing in CDP (Carbon Disclosure Project) reporting. 
          Help the user with their CDP Climate Change questionnaire. Be concise, accurate, and helpful.
          Use the CDP data provided to give specific recommendations.`
        };
        
        // Add the current user message
        chatHistory.push({
          content: userMessage.content,
          role: 'user'
        });
        
        // Get AI response based on mode
        let response;
        if (mode === "chat") {
          response = await analyzeCDPData(userMessage.content, sampleCDPData);
        } else {
          // For write mode, adjust the prompt to generate more detailed content
          response = await getAIResponse([
            {
              role: 'system',
              content: `You are an expert climate disclosure writer. Create professional, 
              detailed content for CDP Climate Change disclosures based on the user's request.
              Focus on accuracy, compliance with reporting standards, and concrete examples.`
            },
            ...chatHistory.slice(-4) // Use last few messages for context
          ]);
        }
        
        // Remove loading message and add actual response
        setMessages(prev => {
          const newMessages = prev.filter(msg => !msg.isLoading);
          return [...newMessages, { content: response || "I'm sorry, I couldn't generate a response.", isUser: false }];
        });
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Remove loading message and add error message
        setMessages(prev => {
          const newMessages = prev.filter(msg => !msg.isLoading);
          return [...newMessages, { 
            content: "I'm sorry, there was an error processing your request. Please try again.", 
            isUser: false 
          }];
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  // If embedded is true, don't render the outer container and header
  const renderContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mode selector */}
      <div className="p-3 border-b border-[#eaeaea]">
        <div className="bg-gray-100 rounded-md flex p-1">
          <button
            className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "chat" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setMode("chat")}
          >
            Chat
          </button>
          <button
            className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "write" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setMode("write")}
          >
            Write
          </button>
        </div>
      </div>

      {/* Chat container (leave space for input) */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-28"> {/* pb-28 leaves space for sticky input */}
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                message.isUser 
                  ? "bg-purple-600 text-white rounded-tr-none" 
                  : message.isLoading 
                    ? "bg-gray-50 text-gray-500 rounded-tl-none border border-gray-200"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                  <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                  <span className="ml-1 text-sm">{message.content}</span>
                </div>
              ) : (
                <div>
                  <div className="message-content">{message.content}</div>
                  {mode === "write" && !message.isUser && onInsertResponse && (
                    <div className="mt-2 text-right">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-7"
                        onClick={() => onInsertResponse(message.content)}
                      >
                        Insert
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Display attachments if any */}
              {message.attachments && message.attachments.length > 0 && (
                <div className={`mt-2 pt-2 ${message.isUser ? "border-t border-purple-400" : "border-t border-gray-300"}`}>
                  <div className={`text-xs ${message.isUser ? "text-purple-200" : "text-gray-500"} mb-1`}>
                    Attachments ({message.attachments.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.attachments.map((attachment) => (
                      <div 
                        key={attachment.id}
                        className={`text-xs flex items-center px-2 py-1 rounded ${
                          message.isUser ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {attachment.type === 'image' ? (
                          <ImageIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <FileIcon className="h-3 w-3 mr-1" />
                        )}
                        <span className="truncate max-w-[100px]">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Attachment panel */}
      {showAttachmentPanel && (
        <div className="border-t border-[#eaeaea] p-3 bg-gray-50">
          <div className="text-xs text-gray-600 mb-2 font-semibold">Attachments ({attachments.length})</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="flex items-center bg-white border border-[#eaeaea] rounded px-2 py-1"
              >
                {attachment.type === 'image' ? (
                  <ImageIcon className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                ) : (
                  <FileIcon className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                )}
                <span className="text-xs text-gray-700 truncate max-w-[120px]">{attachment.name}</span>
                <span className="text-xs text-gray-400 ml-1.5">{attachment.size}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1 hover:bg-gray-100 rounded-full"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                >
                  <XIcon className="h-3 w-3 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area - sticky to pane bottom, always visible */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#eaeaea] z-50">
        <div className="bg-white border border-[#eaeaea] rounded-lg m-3 p-1">
          <div className="flex items-center px-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={mode === "chat" ? "Ask a question..." : "Write a report..."}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
              disabled={isProcessing}
            />
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={handleTriggerFileUpload}
                disabled={isProcessing}
              >
                <PaperclipIcon className="h-4 w-4 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded-full ${isProcessing ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-600'}`}
                onClick={handleSendMessage}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin"></div>
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
              </Button>
              {/* Hidden file input */}
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If embedded, return the content WITH the mode selector
  if (embedded) {
    return (
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* Mode selector */}
        <div className="p-3 border-b border-[#eaeaea]">
          <div className="bg-gray-100 rounded-md flex p-1">
            <button
              className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === "chat" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setMode("chat")}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === "write" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setMode("write")}
            >
              Write
            </button>
          </div>
        </div>
        
        {/* Chat container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 pb-24" /* Added padding at bottom for input area */
        >
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.isUser 
                    ? "bg-purple-600 text-white rounded-tr-none" 
                    : message.isLoading 
                      ? "bg-gray-50 text-gray-500 rounded-tl-none border border-gray-200"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                    <span className="ml-1 text-sm">{message.content}</span>
                  </div>
                ) : (
                  <div>
                  <div className="message-content">{message.content}</div>
                  {mode === "write" && !message.isUser && onInsertResponse && (
                    <div className="mt-2 text-right">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-7"
                        onClick={() => onInsertResponse(message.content)}
                      >
                        Insert
                      </Button>
                    </div>
                  )}
                </div>
                )}
                
                {/* Display attachments if any */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className={`mt-2 pt-2 ${message.isUser ? "border-t border-purple-400" : "border-t border-gray-300"}`}>
                    <div className={`text-xs ${message.isUser ? "text-purple-200" : "text-gray-500"} mb-1`}>
                      Attachments ({message.attachments.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <div 
                          key={attachment.id}
                          className={`text-xs flex items-center px-2 py-1 rounded ${
                            message.isUser ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {attachment.type === 'image' ? (
                            <ImageIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <FileIcon className="h-3 w-3 mr-1" />
                          )}
                          <span className="truncate max-w-[100px]">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Attachment panel */}
        {showAttachmentPanel && (
          <div className="border-t border-[#eaeaea] p-3 bg-gray-50">
            <div className="text-xs text-gray-600 mb-2 font-semibold">Attachments ({attachments.length})</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((attachment) => (
                <div 
                  key={attachment.id}
                  className="flex items-center bg-white border border-[#eaeaea] rounded px-2 py-1"
                >
                  {attachment.type === 'image' ? (
                    <ImageIcon className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  ) : (
                    <FileIcon className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  )}
                  <span className="text-xs text-gray-700 truncate max-w-[120px]">{attachment.name}</span>
                  <span className="text-xs text-gray-400 ml-1.5">{attachment.size}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 hover:bg-gray-100 rounded-full"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <XIcon className="h-3 w-3 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Input area - fixed at the bottom of the chatbot pane */}
        <div className="sticky bottom-0 left-0 right-0 border-t border-[#eaeaea] bg-white p-3">
          <div className="bg-white border border-[#eaeaea] rounded-lg p-1">
            <div className="flex items-center px-2">
              <Input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={mode === "chat" ? "Ask a question..." : "Write a report..."}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
                disabled={isProcessing}
              />
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={handleTriggerFileUpload}
                  disabled={isProcessing}
                >
                  <PaperclipIcon className="h-4 w-4 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 rounded-full ${isProcessing ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-600'}`}
                  onClick={handleSendMessage}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin"></div>
                  ) : (
                    <SendIcon className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Hidden file input */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise return the full standalone chatbot pane
  return (
    <div 
      className="fixed right-0 top-0 bottom-0 bg-white shadow-lg flex flex-col z-50 border-l border-[#eaeaea]"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize hover:bg-purple-200 transition-colors"
        onMouseDown={handleResizeStart}
      />
      
      {/* Header */}
      <div className="border-b border-[#eaeaea] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <ChevronRightIcon className="h-4 w-4 text-purple-600" />
          </div>
          <span className="font-semibold text-gray-800">Copilot</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={onClose}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};