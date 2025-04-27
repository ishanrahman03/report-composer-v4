import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PaperclipIcon, SendIcon, XIcon, ChevronRightIcon, ChevronLeftIcon, ImageIcon, FileIcon, BarChart2Icon, Trash2Icon } from "lucide-react";

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

export const ChatbotPane: React.FC<ChatbotPaneProps> = ({ isOpen, onClose, embedded = false }) => {
  const [mode, setMode] = useState<"ask" | "write">("ask");
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean; attachments?: Attachment[] }>>([
    { content: "Hello! I'm your Copilot assistant. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(380);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentPanel, setShowAttachmentPanel] = useState(false);
  
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

  const handleSendMessage = () => {
    if (input.trim() || attachments.length > 0) {
      // Create a new message with attachments if present
      const newMessage = {
        content: input.trim(),
        isUser: true,
        attachments: attachments.length > 0 ? [...attachments] : undefined
      };
      
      setMessages([...messages, newMessage]);
      setInput("");
      setAttachments([]);
      setShowAttachmentPanel(false);
      
      // Simulate a response after a short delay
      setTimeout(() => {
        const responses = [
          "I'm analyzing your request...",
          "Let me help you with that. Could you provide more details?",
          "Based on your input, I recommend looking at the environmental disclosures section.",
          "I've found some relevant information in the BRSR framework that might help.",
          "You might want to check the Targets section in your CDP report for this information.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { content: randomResponse, isUser: false }]);
      }, 1000);
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
              mode === "ask" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setMode("ask")}
          >
            Ask
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
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              {message.content}
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
              placeholder={mode === "ask" ? "Ask a question..." : "Write a report..."}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
            />
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={handleTriggerFileUpload}
              >
                <PaperclipIcon className="h-4 w-4 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-purple-100 text-purple-600"
                onClick={handleSendMessage}
              >
                <SendIcon className="h-4 w-4" />
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

  // If embedded, just return the content without the mode selector
  if (embedded) {
    return (
      <div className="flex flex-col h-full overflow-hidden relative">
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
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {message.content}
                
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
                placeholder={mode === "ask" ? "Ask a question..." : "Write a report..."}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
              />
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={handleTriggerFileUpload}
                >
                  <PaperclipIcon className="h-4 w-4 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-purple-100 text-purple-600"
                  onClick={handleSendMessage}
                >
                  <SendIcon className="h-4 w-4" />
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