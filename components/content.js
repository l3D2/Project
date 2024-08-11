import Header from "./header";
import Divider from "@mui/material/Divider";
export default function Content({ children }) {
  return (
    <div className="p-2 xl:ml-64 lg:ml-60">
      <Header>{children[0]}</Header>
      <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 h-fit">
        {children.length > 2 ? (
          <div className="grid grid-flow-row-dense grid-cols-4 gap-3 max-sm:grid-cols-2">
            <div className="col-span-3 max-md:col-span-2">{children[1]}</div>
            <div className="flex items-center justify-center h-fit rounded bg-gray-50 dark:bg-gray-800 max-md:col-span-2">
              {children[2]}
            </div>
          </div>
        ) : (
          children[1]
        )}
      </div>
    </div>
  );
}
