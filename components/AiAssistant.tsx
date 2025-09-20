
import React, { useState, useRef, useEffect } from 'react';
import { Cheque } from '../types';
import { askAboutChequesStream } from '../services/geminiService';
import { Icon } from './Icon';

interface AiAssistantProps {
    cheques: Cheque[];
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ cheques }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Hello! Ask me anything about your cheques, like "Who has the highest bounced amount?" or "Show all pending cheques due next week."' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await askAboutChequesStream(cheques, input);
            let aiResponse = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]); // Add empty AI message bubble
            
            for await (const chunk of stream) {
                aiResponse += chunk.text;
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === 'ai') {
                         lastMessage.text = aiResponse;
                         return [...prev.slice(0, -1), lastMessage];
                    }
                    return prev;
                });
            }
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred.";
            setMessages(prev => [...prev, { sender: 'ai', text: `Sorry, I couldn't get a response. ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[80vh] max-h-[800px]">
            <div className="p-4 border-b flex items-center space-x-3">
                <Icon name="ai" className="h-7 w-7 text-brand-primary" />
                <h2 className="text-xl font-semibold text-gray-700">AI Assistant</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="p-2 bg-gray-200 rounded-full"><Icon name="ai" className="h-5 w-5 text-gray-600"/></div>}
                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text || "..."}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 bg-white text-gray-800 border border-gray-300 rounded-l-md focus:ring-brand-primary focus:border-brand-primary"
                    disabled={isLoading}
                />
                <button type="submit" className="bg-brand-primary text-white p-2 rounded-r-md disabled:bg-gray-400" disabled={isLoading}>
                    {isLoading ? <Icon name="loading" className="h-6 w-6 animate-spin"/> : <Icon name="send" className="h-6 w-6"/>}
                </button>
            </form>
        </div>
    );
};

export default AiAssistant;