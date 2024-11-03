export default function CardStat({ children }) {
  return (
    <div className="h-fit px-3 py-2 bg-white rounded shadow-sm">
      <div className="flex items-center space-x-4">
        <div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 text-white">
            {children[0]}
          </div>
        </div>
        <div>
          <div className="text-gray-400">{children[1]}</div>
          <div className="text-1xl font-bold text-gray-900">{children[2]}</div>
        </div>
      </div>
    </div>
  );
}