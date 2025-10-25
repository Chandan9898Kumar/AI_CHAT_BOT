import { memo } from "react";

const Message = () => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1>What can I help you with?</h1>
        <p>Ask me anything and I'll do my best to help you.</p>
      </div>
    </div>
  );
};

export default memo(Message);
