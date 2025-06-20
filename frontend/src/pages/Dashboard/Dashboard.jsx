import React, { useContext } from 'react';
import { Context } from '../../components/context/context';

const Dashboard = () => {
  const { user } = useContext(Context);

  return (
    <div>
      <h1>Hey! {user?.username}</h1>
    </div>
  );
};

export default Dashboard;
