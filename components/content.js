import Header from "./header";
export default function Content({ children }) {
  return (
    <div className="p-2 sm:ml-64">
      <Header>Dashboard</Header>
      <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-screen">
        <div className="grid grid-flow-row-dense grid-cols-4 gap-1">
          <div className="col-span-3">{children[0]}</div>
          <div className="flex items-center justify-center h-fit rounded bg-gray-50 dark:bg-gray-800">
            {children[1]}
          </div>
        </div>
      </div>
    </div>
  );
}
