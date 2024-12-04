import React from 'react';

const BorrowedItems = ({borrowedData}) => {

  return (
    <div className="borrowed-items-table">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border border-gray-300">#</th>
            <th className="px-4 py-2 border border-gray-300">Title</th>
            <th className="px-4 py-2 border border-gray-300">Type</th>
            <th className="px-4 py-2 border border-gray-300">Borrowed Date</th>
            <th className="px-4 py-2 border border-gray-300">Due Date</th>
            <th className="px-4 py-2 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {borrowedData.map((item) => (
            <tr key={item.id} className="text-gray-700">
              <td className="px-4 py-2 border border-gray-300">{item.id}</td>
              <td className="px-4 py-2 border border-gray-300">{item.title}</td>
              <td className="px-4 py-2 border border-gray-300">{item.type}</td>
              <td className="px-4 py-2 border border-gray-300">{item.borrowedDate}</td>
              <td className="px-4 py-2 border border-gray-300">{item.dueDate}</td>
              <td className={`px-4 py-2 border border-gray-300 ${item.status === 'Returned' ? 'text-green-500' : 'text-red-500'}`}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedItems;
