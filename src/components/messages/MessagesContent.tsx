
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Phone, Video, MoreHorizontal, Send, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "vc-1",
    name: "Venture Capital Partners",
    avatar: "VC",
    status: "online",
    lastMessage: "Hi, we're interested in your AI platform.",
    lastMessageTime: "2h ago",
    unread: true,
    messages: [
      {
        id: "m1",
        sender: "Venture Capital Partners",
        content: "Hi, we're interested in your AI platform. Could you share more details?",
        timestamp: "09:42 AM",
        isOutgoing: false
      },
      {
        id: "m2",
        sender: "Me",
        content: "Hi there! Thanks for your interest. Our platform is built on a combination of machine learning models trained on industry-specific datasets.",
        timestamp: "09:45 AM",
        isOutgoing: true
      },
      {
        id: "m3",
        sender: "Venture Capital Partners",
        content: "That sounds impressive. Can you share some information about your current customers and how they've benefited from your solution?",
        timestamp: "09:48 AM",
        isOutgoing: false
      },
      {
        id: "m4",
        sender: "Me",
        content: "Absolutely! We're currently working with 15 enterprise customers across finance, healthcare, and manufacturing sectors. On average, they've reported a 35% reduction in processing times and 40% cost savings on workflows that previously required manual operations.",
        timestamp: "09:52 AM",
        isOutgoing: true
      }
    ]
  },
  {
    id: "ge-1",
    name: "Growth Equity Fund",
    avatar: "GE",
    status: "offline",
    lastMessage: "Hello, we reviewed your proposal and...",
    lastMessageTime: "1d ago",
    unread: true,
    messages: []
  },
  {
    id: "an-1",
    name: "Angel Network",
    avatar: "AN",
    status: "offline",
    lastMessage: "Your solution looks promising...",
    lastMessageTime: "2d ago",
    unread: false,
    messages: []
  },
  {
    id: "iv-1",
    name: "Impact Ventures",
    avatar: "IV",
    status: "offline",
    lastMessage: "Thanks for sharing your pitch deck...",
    lastMessageTime: "1w ago",
    unread: false,
    messages: []
  }
];

const MessagesContent = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;
    
    // In a real app, you would update the conversation in a database
    console.log(`Sending message to ${activeConversation.name}: ${messageInput}`);
    setMessageInput("");
  };

  const filteredConversations = conversations.filter(
    conv => conv.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden flex border border-gray-100">
        {/* Conversation List */}
        <div className="w-full sm:w-80 lg:w-96 border-r border-gray-100 flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations"
                className="pl-9 bg-gray-50"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="px-2">
            <TabsList className="w-full bg-gray-50 mb-2">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer transition-colors rounded-md ${
                      activeConversation?.id === conversation.id
                        ? "bg-investify-mint/20"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-investify-primary text-white rounded-full flex items-center justify-center font-medium">
                        {conversation.avatar}
                      </div>
                      {conversation.status === "online" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread ? "font-medium text-gray-900" : "text-gray-500"}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <span className="w-2 h-2 bg-investify-primary rounded-full"></span>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unread" className="mt-0">
              <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                {filteredConversations
                  .filter(c => c.unread)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer transition-colors rounded-md ${
                        activeConversation?.id === conversation.id
                          ? "bg-investify-mint/20"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-investify-primary text-white rounded-full flex items-center justify-center font-medium">
                          {conversation.avatar}
                        </div>
                        {conversation.status === "online" && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <span className="w-2 h-2 bg-investify-primary rounded-full"></span>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="archived" className="mt-0 p-4 text-center text-gray-500">
              No archived conversations
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat Area */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-investify-primary text-white rounded-full flex items-center justify-center font-medium">
                    {activeConversation.avatar}
                  </div>
                  {activeConversation.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{activeConversation.name}</h3>
                  <span className="text-sm text-gray-500">{activeConversation.status === "online" ? "Online" : "Offline"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeConversation.messages.length > 0 ? (
                <>
                  <div className="text-center mb-6">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Today
                    </span>
                  </div>
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.isOutgoing ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!message.isOutgoing && (
                        <div className="w-8 h-8 bg-investify-primary text-white rounded-full flex items-center justify-center font-medium mr-2">
                          {activeConversation.avatar}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          message.isOutgoing
                            ? "bg-investify-primary text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`text-xs mt-1 text-right ${
                            message.isOutgoing ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                          {message.isOutgoing && " ✓"}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mt-4 font-medium text-gray-700">No messages yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start a conversation with {activeConversation.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-end gap-2">
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} className="bg-investify-primary hover:bg-investify-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 font-medium text-gray-700">No conversation selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a conversation from the list
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesContent;
