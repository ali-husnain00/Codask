import React, { useEffect, useState, useContext } from 'react';
import './Invites.css';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import { FaUserPlus, FaUserTimes } from 'react-icons/fa';

const Invites = () => {
  const { BASE_URL, getLoggedInUser, getAssignedProjects } = useContext(Context);
  const [invites, setInvites] = useState([]);

  const fetchInvites = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getInvites`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setInvites(data);
      }
    } catch (err) {
      toast.error("Failed to fetch invites");
    }
  };

  const handleAction = async (inviteId, action) => {
    try {
      const res = await fetch(`${BASE_URL}/respondInvite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ inviteId, action }),
      });

      if (res.ok) {
        toast.success(`Invite ${action}ed`);
        fetchInvites();
        getLoggedInUser();
        if(action === 'accept'){
          getAssignedProjects();
        }
      } 
    } catch (err) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchInvites()
  }, []);

  return (
  <div className="invites-container">
    <h2>Pending Invites</h2>
    {invites.length > 0 ? (
      <div className="invites-list">
        {invites.map(invite => (
          <div className="invite-card" key={invite._id}>
            <div className="invite-info">
              <h3>{invite.projectId.title}</h3>
              <p className="description">{invite.projectId.description}</p>
              <p className="from">Invited by: {invite.from.username}</p>
            </div>
            <div className="invite-actions">
              {invite.status === "accepted" ? (
                <span className="status accepted">Accepted</span>
              ) : invite.status === "declined" ? (
                <span className="status declined">Declined</span>
              ) : (
                <>
                  <button className="accept" onClick={() => handleAction(invite._id, 'accept')}>
                    <FaUserPlus /> Accept
                  </button>
                  <button className="decline" onClick={() => handleAction(invite._id, 'decline')}>
                    <FaUserTimes /> Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="no-invites">You have no pending invites.</p>
    )}
  </div>
);
};

export default Invites;
