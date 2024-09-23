export const UserControls = ({
  isActiveSession,
  onEnterQueue,
  onEndSession,
}: {
  isActiveSession: boolean;
  onEnterQueue: () => void;
  onEndSession: () => void;
}) => {
  return (
    <div>
      <h3>User controls</h3>
      <button onClick={onEnterQueue}>Enter queue</button>
      <button onClick={onEndSession} disabled={!isActiveSession}>
        End current session
      </button>
    </div>
  );
};
