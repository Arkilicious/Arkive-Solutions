
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

const ChatRoomsPage: React.FC = () => {
  const { user } = useAuth();
  const { chatRooms, getChatRoomMessages, addChatMessage } = useData();
  
  const [selectedRoom, setSelectedRoom] = useState<string>(chatRooms[0]?.id || '');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = getChatRoomMessages(selectedRoom);
  const selectedChatRoom = chatRooms.find(room => room.id === selectedRoom);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedRoom) {
      addChatMessage(selectedRoom, message.trim());
      setMessage('');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Chat Rooms</h1>
        <p className="text-muted-foreground mt-2">
          Connect with other students in various chat rooms
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
            <CardDescription>
              Join discussion groups based on your faculty, department, or level
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {chatRooms.map(room => (
                <div
                  key={room.id}
                  className={`px-4 py-3 cursor-pointer flex items-start gap-3 ${
                    selectedRoom === room.id ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    selectedRoom === room.id ? 'bg-green-500' : 'bg-muted-foreground'
                  }`}></div>
                  <div>
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {room.type === 'faculty' ? 'Faculty-wide' : 
                       room.type === 'department' ? 'Department' : 'Level'} chat
                    </div>
                  </div>
                </div>
              ))}
              
              {chatRooms.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-muted-foreground">No chat rooms available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>{selectedChatRoom?.name || 'Chat'}</CardTitle>
            <CardDescription>
              {selectedChatRoom?.type === 'faculty' ? 'Faculty-wide' : 
               selectedChatRoom?.type === 'department' ? 'Department' : 'Level'} discussion
            </CardDescription>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto p-4 border-t border-b h-[400px]">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map(msg => {
                  const isCurrentUser = msg.userId === user?.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className={isCurrentUser ? 'bg-uniwise-blue text-white' : ''}>
                            {getInitials(msg.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-uniwise-blue text-white' 
                              : 'bg-muted'
                          }`}>
                            {msg.content}
                          </div>
                          <div className={`flex gap-2 text-xs text-muted-foreground ${isCurrentUser ? 'justify-end' : ''}`}>
                            <span>{msg.userName}</span>
                            <span>•</span>
                            <span>{format(new Date(msg.timestamp), 'h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No messages yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to start a conversation in this room
                </p>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" disabled={!message.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Chat Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>Be respectful to other students and faculty members</li>
            <li>Stay on topic - use relevant chat rooms for specific discussions</li>
            <li>No spamming, inappropriate content, or sharing of exam answers</li>
            <li>Help each other understand concepts rather than just sharing answers</li>
            <li>Report inappropriate behavior to moderators</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatRoomsPage;
