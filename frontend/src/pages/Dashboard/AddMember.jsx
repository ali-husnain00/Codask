import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import { apiRequest } from '../../lib/apiClient';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { PageHeader } from '../../components/ui/page-header';

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
            const data = await apiRequest(BASE_URL, "/getAllUsers");
            setUsers(data.data || data);
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
            return;
        }
        try {
            const data = await apiRequest(BASE_URL, "/send-invite", {
                method: "POST",
                body: JSON.stringify({
                    projectId,
                    receiverEmail: selectedUser.email
                })
            });
            toast.success(data.message || data.msg || "Invite sent");
            setShowModal(false);
            setProjectId('');
        } catch (error) {
            toast.error(error.message || "Error sending invite");
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader title="Add Members" className="mb-4" />
            <div className="max-w-md">
                <Input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-6">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <Card key={user._id} className="bg-[var(--surface-soft)]">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div>
                            {user.avatar ? (
                                <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt="avatar" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-lg font-bold text-[var(--text)]">{user.username[0]}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                        </div>
                        <Button className="h-8 px-3 py-1.5 text-xs" onClick={() => handleInvite(user)}>Invite</Button>
                      </CardContent>
                    </Card>
                )) : (
                    <p className="text-[var(--text-muted)]">No user found</p>
                )}
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Invite</DialogTitle>
                  <DialogDescription>Inviting <strong>{selectedUser?.username}</strong></DialogDescription>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder="Enter Project ID"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                />
                <div className="mt-1 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={sendInvite}>Send</Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddMember;
