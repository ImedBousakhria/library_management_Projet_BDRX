import React from 'react';
import { useAuth } from '../utils/AuthContext';
import BorrowedItems from '../components/BorrowedItems';

const Borrows = () => {
  const { isLoggedIn } = useAuth();

  // if (!isLoggedIn) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div>
  //         <p className="text-xl mb-4">You need to log in to view your borrowed items.</p>
  //         <a href="/login" className="text-blue-500">Go to Login</a>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="borrowed-page py-6 px-8 mt-[5rem]">
      <h1 className="text-3xl font-bold mb-4">Your Borrowed Items</h1>
      <BorrowedItems />
    </div>
  );
};

export default Borrows;
