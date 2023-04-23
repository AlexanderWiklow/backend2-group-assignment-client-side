export default function Comment({ sender, comment }) {
  return (
    <div className="block">
      <div className="bg-gray-100 m-0.5 inline-block px-2 rounded-2xl max-w-full break-words">
        <p className="font-semibold">{sender}</p>
        <p>{comment}</p>
      </div>
    </div>
  );
}
