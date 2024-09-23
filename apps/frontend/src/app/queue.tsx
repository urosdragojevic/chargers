export const Queue = ({ queue }: { queue: number[] }) => {
  return (
    <div>
      <h2>Queue:</h2>
      <ol>
        {queue.map((userId) => (
          <li key={userId}>{userId}</li>
        ))}
      </ol>
    </div>
  );
};
