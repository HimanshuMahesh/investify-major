import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Shield, Users, Edit, PlusCircle, X } from "lucide-react";

export interface Term {
  id: string;
  key: string;
  value: string;
  lastEditedBy?: string;
}

export interface HistoryEvent {
  id: string;
  event: string;
  user: string;
  date: string;
}

export interface Proposal {
  status: "no_proposal" | "pending" | "accepted" | "rejected" | "withdrawn";
  terms: Term[];
  history: HistoryEvent[];
  lastUpdatedBy?: string;
}

interface DealRoomProps {
  proposal: Proposal | null;
  onUpdateProposal: (proposal: Proposal) => void;
  conversationId: string;
}

const DealRoom: React.FC<DealRoomProps> = ({ proposal, onUpdateProposal, conversationId }) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTerms, setEditedTerms] = useState<Term[]>([]);

  useEffect(() => {
    if (proposal) {
      setEditedTerms(proposal.terms);
    }
  }, [proposal]);


  const userRole = userProfile?.userType === "investor" ? "investor" : "business";
  const canProposeChanges = (userRole === "business" && proposal?.status === "pending") || (userRole === "investor" && proposal?.status === "pending");
  const canTakeAction = proposal?.status === 'pending' && proposal.lastUpdatedBy !== user?.uid;

  // Handlers for creating a new proposal
  const handleCreateProposal = () => {
    const newProposal: Proposal = {
      status: "pending",
      terms: [
        { id: "t1", key: "Investment Amount", value: "", lastEditedBy: user?.displayName || 'Investor' },
        { id: "t2", key: "Equity Stake (%)", value: "", lastEditedBy: user?.displayName || 'Investor' },
        { id: "t3", key: "Valuation Cap", value: "", lastEditedBy: user?.displayName || 'Investor' },
      ],
      history: [
        {
          id: "h1",
          event: "Initial Proposal Created",
          user: user?.displayName || "Investor",
          date: new Date().toISOString(),
        },
      ],
      lastUpdatedBy: user?.uid
    };
    onUpdateProposal(newProposal);
    setEditedTerms(newProposal.terms);
    setIsEditing(true);
  };

  const handleTermChange = (id: string, value: string) => {
    setEditedTerms((prev) =>
      prev.map((term) =>
        term.id === id ? { ...term, value, lastEditedBy: user?.displayName } : term
      )
    );
  };

  const handleAddNewTerm = () => {
    setEditedTerms(prev => [...prev, { id: `t${prev.length + 1}`, key: "", value: "", lastEditedBy: user?.displayName }]);
  };

  const handleTermKeyChange = (id: string, key: string) => {
    setEditedTerms(prev => prev.map(term => term.id === id ? { ...term, key } : term));
  };

  const handleRemoveTerm = (id: string) => {
    setEditedTerms(prev => prev.filter(term => term.id !== id));
  }

  const handleSendProposal = () => {
    if (!proposal) return;
    const eventText = proposal.terms.length > 0 ? "Counter-Proposal Sent" : "Initial Proposal Sent";
    const updatedProposal: Proposal = {
      ...proposal,
      terms: editedTerms,
      status: "pending",
      history: [
        ...proposal.history,
        {
          id: `h${proposal.history.length + 1}`,
          event: eventText,
          user: user?.displayName || "User",
          date: new Date().toISOString(),
        },
      ],
      lastUpdatedBy: user?.uid
    };
    onUpdateProposal(updatedProposal);
    setIsEditing(false);
    toast({ title: "Success", description: "Your proposal has been sent." });
  };

  const handleCancelEdit = () => {
    if (proposal?.terms.length === 0) {
      // If it was a new proposal being created, reset everything
      onUpdateProposal({ status: "no_proposal", terms: [], history: [] });
    } else if (proposal) {
      setEditedTerms(proposal.terms);
    }
    setIsEditing(false);
  };

  const handleAccept = () => {
    if (!proposal) return;
    const updatedProposal: Proposal = { ...proposal, status: "accepted", lastUpdatedBy: user?.uid };
    onUpdateProposal(updatedProposal);
    toast({ title: "Congratulations!", description: "The proposal has been accepted." });
  }

  const handleReject = () => {
    if (!proposal) return;
    const updatedProposal: Proposal = { ...proposal, status: "rejected", lastUpdatedBy: user?.uid };
    onUpdateProposal(updatedProposal);
    toast({ title: "Proposal Rejected", description: "You have rejected the proposal.", variant: "destructive" });
  }

  const getStatusBadge = (status: Proposal["status"]) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "withdrawn":
        return <Badge variant="secondary">Withdrawn</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">No Proposal</Badge>;
    }
  };

  // Render this if no proposal has been started
  if (!proposal || proposal.status === "no_proposal") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <FileText className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Start the Negotiation</h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Create and send a formal investment proposal to begin the deal-making process.
        </p>
        {userRole === 'investor' ? (
          <Button onClick={handleCreateProposal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Proposal
          </Button>
        ) : (
          <p className="text-sm text-gray-600">Waiting for the investor to create a proposal.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Negotiation & Deal Room</CardTitle>
              <CardDescription>
                Manage investment proposals and due diligence securely.
              </CardDescription>
            </div>
            {getStatusBadge(proposal.status)}
          </div>
        </CardHeader>
        <CardContent>
          {/* Proposal Terms */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-investify-primary" />
                Proposal Terms
              </h3>
              {!isEditing && canProposeChanges && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Propose Changes
                </Button>
              )}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Term</TableHead>
                    <TableHead>Value</TableHead>
                    {isEditing && <TableHead className="w-[50px]"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedTerms.map((term) => (
                    <TableRow key={term.id}>
                      <TableCell className="font-medium">
                        {isEditing ? (
                          <Input value={term.key} onChange={(e) => handleTermKeyChange(term.id, e.target.value)} placeholder="Term name" />
                        ) : (
                          term.key
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={term.value}
                            onChange={(e) =>
                              handleTermChange(term.id, e.target.value)
                            }
                            placeholder="Term value"
                          />
                        ) : (
                          <span>
                            {term.value}
                            {term.lastEditedBy && <p className="text-xs text-gray-400 mt-1">Last edited by {term.lastEditedBy}</p>}
                          </span>
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveTerm(term.id)}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {isEditing && (
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={handleAddNewTerm}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Term
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendProposal}>Send Proposal</Button>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons for non-editing mode */}
          {canTakeAction && (
            <CardFooter className="flex justify-end gap-2 pt-6 px-0">
              <Button variant="destructive" onClick={handleReject}>Reject</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleAccept}>
                Accept Proposal
              </Button>
            </CardFooter>
          )}

          {/* Negotiation History */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-investify-primary" />
              Negotiation History
            </h3>
            <div className="space-y-4">
              {proposal.history.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-investify-mint/30 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-investify-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.event}</p>
                    <p className="text-xs text-gray-500">
                      by {item.user} on{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealRoom;