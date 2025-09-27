import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Send,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import DealRoom, { Proposal } from "./DealRoom";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // formatted string for display
  isOutgoing: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string; // initials
  status: "online" | "offline";
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  participants: string[];
  messages: Message[];
  proposal?: Proposal;
}

// helper for safe Firestore timestamp formatting
const formatTimestamp = (ts: any): string => {
  if (!ts || typeof ts.toDate !== "function") return "";
  return ts
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessagesContent = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("chat");

  // Load conversations
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const convos: (Conversation | null)[] = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const conversationData = docSnap.data();
          const otherParticipantId = conversationData.participants.find(
            (p: string) => p !== user.uid
          );
          if (!otherParticipantId) return null;

          const userDoc = await getDoc(doc(db, "users", otherParticipantId));
          if (!userDoc.exists()) return null;

          const userData = userDoc.data();
          return {
            id: docSnap.id,
            name: userData.displayName || "Unknown User",
            avatar: userData.displayName
              ? userData.displayName.charAt(0).toUpperCase()
              : "U",
            status: "offline",
            lastMessage: conversationData.lastMessage?.content || "",
            lastMessageTime: formatTimestamp(
              conversationData.lastMessage?.timestamp
            ),
            unread: false,
            participants: conversationData.participants,
            messages: [],
            proposal: conversationData.proposal || null
          } as Conversation;
        })
      );

      const validConvos = convos.filter(Boolean) as Conversation[];
      setConversations(validConvos);

      if (validConvos.length > 0 && !activeConversation) {
        setActiveConversation(validConvos[0]);
      }
    });

    return () => unsubscribe();
  }, [user, activeConversation]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConversation || !user) return;

    const messagesQuery = query(
      collection(db, "conversations", activeConversation.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const messagesUnsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((docSnap) => {
        const messageData = docSnap.data();
        messages.push({
          id: docSnap.id,
          senderId: messageData.senderId,
          content: messageData.content,
          timestamp: formatTimestamp(messageData.timestamp),
          isOutgoing: messageData.senderId === user.uid,
        });
      });
      setActiveConversation((prev) =>
        prev ? { ...prev, messages } : null
      );
    });

    const conversationDoc = doc(db, "conversations", activeConversation.id);
    const conversationUnsubscribe = onSnapshot(conversationDoc, (docSnap) => {
      if (docSnap.exists()) {
        const conversationData = docSnap.data();
        setActiveConversation((prev) =>
          prev ? { ...prev, proposal: conversationData.proposal || null } : null
        );
      }
    });


    return () => {
      messagesUnsubscribe();
      conversationUnsubscribe();
    };
  }, [activeConversation?.id, user?.uid]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation || !user) return;
    try {
      await addDoc(
        collection(db, "conversations", activeConversation.id, "messages"),
        {
          senderId: user.uid,
          content: messageInput,
          timestamp: serverTimestamp(),
        }
      );
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUpdateProposal = async (proposal: Proposal) => {
    if (!activeConversation) return;
    try {
      const conversationDoc = doc(db, "conversations", activeConversation.id);
      await setDoc(conversationDoc, { proposal }, { merge: true });
    } catch (error) {
      console.error("Error updating proposal:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex-shrink-0">
        Messages
      </h1>
      <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden flex border border-gray-100 min-h-0">
        {/* Sidebar */}
        <div className="w-full sm:w-80 lg:w-96 border-r border-gray-100 flex flex-col">
          <div className="p-4 flex-shrink-0">
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
          <div className="flex-1 overflow-y-auto min-h-0">
            <Tabs defaultValue="all" className="px-2">
              <TabsList className="w-full bg-gray-50 mb-2">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">
                  Archived
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-0">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer transition-colors rounded-md ${activeConversation?.id === conversation.id
                      ? "bg-investify-mint/20"
                      : "hover:bg-gray-50"
                      }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-investify-primary text-white">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.status === "online" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate ${conversation.unread
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                          }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <span className="w-2 h-2 bg-investify-primary rounded-full"></span>
                    )}
                  </div>
                ))}
              </TabsContent>
              <TabsContent
                value="unread"
                className="mt-0 p-4 text-center text-gray-500"
              >
                No unread conversations
              </TabsContent>
              <TabsContent
                value="archived"
                className="mt-0 p-4 text-center text-gray-500"
              >
                No archived conversations
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Chat area */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-investify-primary text-white">
                      {activeConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {activeConversation.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {activeConversation.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {activeConversation.status === "online"
                      ? "Online"
                      : "Offline"}
                  </span>
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

            {/* Chat / Deal Room Tabs */}
            <div className="flex-1 flex flex-col min-h-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col min-h-0" /* <--- FIX IS HERE */
              >
                <TabsList className="mx-4 mt-4 flex-shrink-0">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat
                  </TabsTrigger>
                  <TabsTrigger value="deal-room" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" /> Deal Room
                  </TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent
                  value="chat"
                  className="flex-1 flex flex-col mt-0 min-h-0"
                >
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
                            className={`mb-4 flex ${message.isOutgoing
                              ? "justify-end"
                              : "justify-start"
                              }`}
                          >
                            {!message.isOutgoing && (
                              <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                                <AvatarFallback className="bg-investify-primary text-white text-xs">
                                  {activeConversation.avatar}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[75%] px-4 py-2 rounded-lg ${message.isOutgoing
                                ? "bg-investify-primary text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              <p className="text-sm break-words">
                                {message.content}
                              </p>
                              <div
                                className={`text-xs mt-1 text-right ${message.isOutgoing
                                  ? "text-white/70"
                                  : "text-gray-500"
                                  }`}
                              >
                                {message.timestamp}
                                {message.isOutgoing && " ✓"}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <MessageSquare className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="mt-4 font-medium text-gray-700">
                            No messages yet
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Start a conversation with {activeConversation.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 p-4 border-t border-gray-100">
                    <div className="flex items-end gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === "Enter") handleSendMessage();
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-investify-primary hover:bg-investify-primary/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Deal Room Tab */}
                <TabsContent
                  value="deal-room"
                  className="overflow-y-auto p-4"
                >
                  <DealRoom
                    proposal={activeConversation.proposal || null}
                    onUpdateProposal={handleUpdateProposal}
                    conversationId={activeConversation.id}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 font-medium text-gray-700">
                No conversation selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a conversation from the list to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesContent;