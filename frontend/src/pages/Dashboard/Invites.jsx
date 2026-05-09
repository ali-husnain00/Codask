import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import { UserPlus, UserMinus } from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { PageHeader } from '../../components/ui/page-header';

const Invites = () => {
  const { BASE_URL, getLoggedInUser, getAssignedProjects } = useContext(Context);
  const [invites, setInvites] = useState([]);

  const fetchInvites = async () => {
    try {
      const data = await apiRequest(BASE_URL, "/getInvites");
      setInvites(data.data || data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch invites");
    }
  };

  const handleAction = async (inviteId, action) => {
    try {
      await apiRequest(BASE_URL, "/respondInvite", {
        method: "POST",
        body: JSON.stringify({ inviteId, action }),
      });
      toast.success(`Invite ${action}ed`);
      fetchInvites();
      getLoggedInUser();
      if(action === 'accept'){
        getAssignedProjects();
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  useEffect(() => {
    fetchInvites()
  }, []);

  return (
  <div className="space-y-6">
    <PageHeader title="Pending Invites" className="mb-0" />
    {invites.length > 0 ? (
      <div className="grid gap-4 mt-6">
        {invites.map(invite => (
          <Card key={invite._id} className="bg-[var(--surface-soft)]">
            <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
            <div className="space-y-1">
              <h3>{invite.projectId.title}</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-2xl">{invite.projectId.description}</p>
              <p className="text-sm text-[var(--text-muted)] pt-2">Invited by: <span className="font-medium text-[var(--text)]">{invite.from.username}</span></p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 w-full md:w-auto border-t md:border-t-0 border-[var(--border)]">
              {invite.status === "accepted" ? (
                <Badge variant="success">Accepted</Badge>
              ) : invite.status === "declined" ? (
                <Badge variant="danger" className="border-transparent bg-[var(--danger)]/20 text-[var(--danger)]">Declined</Badge>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 md:flex-none inline-flex h-9 items-center justify-center gap-2 text-sm border-[var(--border)] text-[var(--success)] hover:text-[var(--success)]" onClick={() => handleAction(invite._id, 'accept')}>
                    <UserPlus size={14} /> Accept
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none inline-flex h-9 items-center justify-center gap-2 text-sm border-[var(--border)] text-[var(--danger)] hover:text-[var(--danger)]" onClick={() => handleAction(invite._id, 'decline')}>
                    <UserMinus size={14} /> Decline
                  </Button>
                </>
              )}
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--surface-soft)] mt-6">
        <p className="text-[var(--text-muted)]">You have no pending invites.</p>
      </div>
    )}
  </div>
);
};

export default Invites;
