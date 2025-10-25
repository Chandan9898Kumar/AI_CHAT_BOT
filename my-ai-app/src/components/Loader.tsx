import { memo } from "react";

const Loader = () => {
  return (
    <div className="message-wrapper ai-wrapper">
      <div className="message-content">
        <div className="ai-avatar">🤖</div>
        <div className="message-bubble loading">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Loader);
