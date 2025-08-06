import React from 'react';

const MixtralChat = () => {
  return (
    <div style={{ padding: '1rem', border: '2px solid #333', borderRadius: '12px', background: '#000', color: '#0f0' }}>
      <h2 style={{ marginBottom: '1rem' }}>🧠 Mixtral AI Chat</h2>
      <iframe
        src="https://digital-product-hatw6apsl-jdc-590f50ec.vercel.app/api/mixtral"
        style={{ width: '100%', height: '600px', border: 'none', background: '#111' }}
        title="Mixtral Chat"
      />
    </div>
  );
};

export default MixtralChat;
