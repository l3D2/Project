import "../app/footer.css";

export default function footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white">
      <div className="w-full">
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            &copy;
            {currentYear} All rights reserved. |
          </span>
          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            contact logo
          </div>
        </div>
      </div>
    </footer>
  );
}
