// src/components/dashboard/LoyaltyRewards.jsx - Gamification
import React, { useState, useEffect } from 'react';

const LoyaltyRewards = () => {
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState('Silver');
  const [rewards, setRewards] = useState([]);
  const [progress, setProgress] = useState(50);

  useEffect(() => {
    // Simulate fetching rewards
    const availableRewards = [
      { id: 1, name: 'Free Shipping', points: 500, claimed: false },
      { id: 2, name: '10% Off Next Order', points: 750, claimed: false },
      { id: 3, name: 'Premium Support', points: 1000, claimed: true },
      { id: 4, name: 'Exclusive Products', points: 1500, claimed: false }
    ];
    setRewards(availableRewards);
  }, []);

  const claimReward = (rewardId) => {
    setRewards(prev => prev.map(reward =>
      reward.id === rewardId ? { ...reward, claimed: true } : reward
    ));
    setPoints(prev => prev - rewards.find(r => r.id === rewardId).points);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">🏆 Loyalty Rewards</h2>
          <p className="opacity-90">Earn points with every purchase</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{points}</div>
          <div className="text-yellow-200 text-sm">Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Silver</span>
          <span>Gold (2000 pts)</span>
        </div>
        <div className="w-full bg-yellow-200 bg-opacity-50 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {rewards.map(reward => (
          <div
            key={reward.id}
            className={`bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm ${
              reward.claimed ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{reward.name}</h3>
              <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs">
                {reward.points} pts
              </span>
            </div>
            <button
              onClick={() => claimReward(reward.id)}
              disabled={reward.claimed || points < reward.points}
              className={`w-full py-2 rounded-lg text-sm font-semibold ${
                reward.claimed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : points >= reward.points
                  ? 'bg-white text-yellow-600 hover:bg-yellow-50'
                  : 'bg-white bg-opacity-30 text-white cursor-not-allowed'
              }`}
            >
              {reward.claimed ? 'Claimed' : points >= reward.points ? 'Claim' : 'Need More Points'}
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <button className="bg-white bg-opacity-20 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
          Refer Friend
        </button>
        <button className="bg-white bg-opacity-20 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
          View History
        </button>
      </div>
    </div>
  );
};

export default LoyaltyRewards;