export default function ConversationHistory({ conversations, loadConversation, startNewConversation }) {
  return (

    <div className="history">
      <div className='head-histo'>
        <h3>Historique des conversations</h3>
        <button onClick={startNewConversation}>Nouvelle conversation</button>
      </div>
      {conversations.map((conv) => (
        <button key={conv.id} onClick={() => loadConversation(conv.id)}>
          Conversation {conv.id}
        </button>
      ))}
    </div>

  );
}
