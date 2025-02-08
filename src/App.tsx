import React, { useState, useEffect } from "react";
import { Lock, MessageSquare, UserCircle2 } from "lucide-react";
import { AuthClient } from "@dfinity/auth-client";
import { box } from "tweetnacl";
import shield from "./assets/shield_prev_ui.png";

interface Message {
  id: string;
  text: string;
  sender: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyPair, setKeyPair] = useState<{
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  } | null>(null);

  useEffect(() => {
    initAuth();
    // Generate encryption keys on component mount
    const generatedKeyPair = box.keyPair();
    setKeyPair(generatedKeyPair);
  }, []);

  const initAuth = async () => {
    try {
      const authClient = await AuthClient.create();
      const isLoggedIn = await authClient.isAuthenticated();
      setIsAuthenticated(isLoggedIn);
    } catch (error) {
      console.error("Authentication initialization failed:", error);
    }
  };

  const login = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => setIsAuthenticated(true),
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !keyPair) return;

    try {
      // In a real app, we would encrypt the message here before sending
      // const  = new TextEncoder().encode(newMessage);

      // Simulate sending to blockchain (replace with actual IC/Calimero SDK call)
      const message: Message = {
        id: crypto.randomUUID(),
        text: newMessage,
        sender: "current-user",
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="p-6 border-b border-neon-blue">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={shield} alt="" className="h-10 w-10" />
            <h1 className="text-3xl font-bold text-neon-pink">NexusChat</h1>
          </div>
          {!isAuthenticated ? (
            <button
              onClick={login}
              className="flex items-center space-x-2 bg-neon-blue hover:bg-neon-purple px-6 py-3 rounded-full transition-colors"
            >
              <UserCircle2 className="h-6 w-6" />
              <span>Connect Identity</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-neon-green" />
              <span className="text-neon-green">Secured Connection</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto mt-10 px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-8 mb-8 border border-neon-purple">
            <h2 className="text-2xl font-bold text-neon-blue mb-4">
              Futuristic Encrypted Messaging
            </h2>
            <p className="text-gray-400">
              Experience the future of communication with NeonChat. Built on the
              Internet Computer Protocol and enhanced by Calimero Network, this
              platform ensures your messages are end-to-end encrypted and
              securely stored on the blockchain.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-neon-purple">
            <div className="mb-6 h-96 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neon-blue scrollbar-track-gray-800">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "current-user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      message.sender === "current-user"
                        ? "bg-neon-blue"
                        : "bg-gray-800"
                    }`}
                  >
                    <p className="break-words text-white">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your encrypted message..."
                className="flex-1 bg-gray-800 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-neon-pink text-white"
              />
              <button
                type="submit"
                disabled={!isAuthenticated}
                className="bg-neon-pink hover:bg-neon-purple px-8 py-3 rounded-xl flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;