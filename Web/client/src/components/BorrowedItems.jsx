import React from 'react';

const BorrowedItems = () => {
  const borrowedData = [
    {
      id: 1,
      title: 'The Great Gatsby',
      type: 'Book',
      borrowedDate: '2024-11-01',
      dueDate: '2024-12-01',
      status: 'Not Returned'
    },
    {
      id: 2,
      title: 'Inception',
      type: 'DVD',
      borrowedDate: '2024-11-05',
      dueDate: '2024-12-05',
      status: 'Not Returned'
    },
    {
      id: 3,
      title: '1984',
      type: 'Book',
      borrowedDate: '2024-10-20',
      dueDate: '2024-11-20',
      status: 'Returned'
    },
  ];

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
