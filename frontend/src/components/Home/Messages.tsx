// import './Home.css'
import "./MainStyle.css";
import "./PlayCards.css";
const Messages = (props: any) => {
  return (
    <div className="right-side-container messages-container">
      <h1>Messages</h1>
      <div className="message-box">
        {props.messages.map((message: any) => (
          <div className="message-content-container">{message}</div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
