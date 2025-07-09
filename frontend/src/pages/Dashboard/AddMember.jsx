import React, { useState, useEffect, useContext } from 'react';
import './AddMember.css';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';

const AddMember = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [projectId, setProjectId] = useState('');
    const { BASE_URL } = useContext(Context);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAllUsers = async () => {
        try {
            const res = await fetch(`${BASE_URL}/getAllUsers`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleInvite = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const sendInvite = async () => {
        if (!projectId) {
            toast.warning("ProjectId is required!");
        }
        try {
            const res = await fetch(`${BASE_URL}/send-invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    projectId,
                    receiverEmail: selectedUser.email
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.msg);
                setShowModal(false);
                setProjectId('');
            } 
            else{
                toast.error(data.msg)
            }
        } catch (error) {
            console.log("Error sending invite" + error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="add-member-panel">
            <h2>Add Members</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="user-list">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <div className="user-card" key={user._id}>
                        <div className="avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt="avatar" />
                            ) : (
                                <div className="avatar-placeholder">{user.username[0]}</div>
                            )}
                        </div>
                        <div className="user-info">
                            <p className="name">{user.username}</p>
                            <p className="email">{user.email}</p>
                        </div>
                        <button className="invite-btn" onClick={() => handleInvite(user)}>Invite</button>
                    </div>
                )) : (
                    <p className="no-results">No user found</p>
                )}
            </div>

            {showModal && (
                <div className="invite-modal-overlay">
                    <div className="invite-modal">
                        <h3>Send Invite</h3>
                        <p>Inviting <strong>{selectedUser.username}</strong></p>
                        <input
                            type="text"
                            placeholder="Enter Project ID"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            required
                        />
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="send-btn" onClick={sendInvite}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMember;
