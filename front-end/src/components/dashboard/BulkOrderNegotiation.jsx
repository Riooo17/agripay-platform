// src/components/dashboard/BulkOrderNegotiation.jsx - B2B Features
import React, { useState } from 'react';

const BulkOrderNegotiation = () => {
  const [negotiations, setNegotiations] = useState([
    {
      id: 1,
      product: 'Premium Maize',
      supplier: 'Green Valley Farms',
      quantity: 5000,
      initialPrice: 45,
      currentOffer: 42,
      status: 'negotiating',
      messages: [
        { from: 'buyer', text: 'Can you do KSh 42 for 5000kg?', time: '2 hours ago' },
        { from: 'supplier', text: 'I can do KSh 43. Best price for bulk.', time: '1 hour ago' }
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (negotiationId) => {
    if (!newMessage.trim()) return;

    setNegotiations(prev => prev.map(neg => 
      neg.id === negotiationId 
        ? {
            ...neg,
            messages: [
              ...neg.messages,
              { from: 'buyer', text: newMessage, time: 'Just now' }
            ]
          }
        : neg
    ));
    setNewMessage('');
  };

  const acceptOffer = (negotiationId) => {
    setNegotiations(prev => prev.map(neg => 
      neg.id === negotiationId 
        ? { ...neg, status: 'accepted' }
        : neg
    ));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
      <h2 className="text-xl font-bold text-green-800 mb-6">💼 Bulk Order Negotiations</h2>

      <div className="space-y-6">
        {negotiations.map(negotiation => (
          <div key={negotiation.id} className="border border-green-200 rounded-xl overflow-hidden">
            {/* Negotiation Header */}
            <div className="bg-green-50 px-4 py-3 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900">{negotiation.product}</h3>
                  <p className="text-green-600 text-sm">{negotiation.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-800">KSh {negotiation.currentOffer}</p>
                  <p className="text-green-600 text-sm">{negotiation.quantity} kg</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {negotiation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.from === 'buyer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.from === 'buyer'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-green-100 text-green-900 rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.from === 'buyer' ? 'text-green-200' : 'text-green-600'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-green-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your counter-offer or message..."
                  className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => sendMessage(negotiation.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Send
                </button>
                <button
                  onClick={() => acceptOffer(negotiation.id)}
                  className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Start New Negotiation */}
        <button className="w-full py-4 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:border-green-400 hover:text-green-700 transition-colors">
          + Start New Bulk Negotiation
        </button>
      </div>
    </div>
  );
};

export default BulkOrderNegotiation;