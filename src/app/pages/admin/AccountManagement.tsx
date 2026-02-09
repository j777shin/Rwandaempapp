import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, Download, X, Search, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Checkbox } from "@/app/components/ui/checkbox";

const accounts = [
  { 
    id: "BEN001", 
    name: "Jean Baptiste", 
    email: "jean@example.com", 
    age: 28,
    gender: "M",
    phone: "+250 788 123 456",
    address: "Kigali, Gasabo District",
    education: "Secondary",
    status: "Emp Track",
    createdAt: "2026-01-15", 
    enrollmentDate: "2025-11-15",
    skillcraftScore: 85,
    pathwaysScore: 72,
    eligibilityScore: 78,
    lastEdited: "2026-02-01 10:30 AM",
  },
  { 
    id: "BEN002", 
    name: "Marie Claire", 
    email: "marie@example.com", 
    age: 32,
    gender: "F",
    phone: "+250 788 234 567",
    address: "Kigali, Kicukiro District",
    education: "Tertiary",
    status: "Ent Track",
    createdAt: "2026-01-16", 
    enrollmentDate: "2025-11-10",
    skillcraftScore: 92,
    pathwaysScore: 88,
    eligibilityScore: 90,
    lastEdited: "2026-02-02 02:15 PM",
  },
  { 
    id: "BEN003", 
    name: "Patrick Nkusi", 
    email: "patrick@example.com", 
    age: 25,
    gender: "M",
    phone: "+250 788 345 678",
    address: "Kigali, Nyarugenge District",
    education: "Primary",
    status: "Phase1",
    createdAt: "2026-01-18", 
    enrollmentDate: "2025-11-20",
    skillcraftScore: 75,
    pathwaysScore: 68,
    eligibilityScore: 71,
    lastEdited: "2026-01-25 09:45 AM",
  },
  { 
    id: "BEN004", 
    name: "Ange Uwase", 
    email: "ange@example.com", 
    age: 29,
    gender: "F",
    phone: "+250 788 456 789",
    address: "Kigali, Gasabo District",
    education: "Secondary",
    status: "Ent Track",
    createdAt: "2026-01-20", 
    enrollmentDate: "2025-11-12",
    skillcraftScore: 88,
    pathwaysScore: 82,
    eligibilityScore: 85,
    lastEdited: "2026-02-03 11:20 AM",
  },
  { 
    id: "BEN005", 
    name: "Samuel Mugisha", 
    email: "samuel@example.com", 
    age: 22,
    gender: "M",
    phone: "+250 788 567 890",
    address: "Kigali, Kicukiro District",
    education: "Below Primary",
    status: "Inactive",
    createdAt: "2026-01-22", 
    enrollmentDate: "2025-12-01",
    skillcraftScore: 0,
    pathwaysScore: 0,
    eligibilityScore: 0,
    lastEdited: "2026-01-30 03:00 PM",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Emp Track":
      return "bg-primary text-white";
    case "Ent Track":
      return "bg-primary text-white";
    case "Phase1":
      return "bg-primary text-white";
    case "Inactive":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export function AccountManagement() {
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
  const [editedAccount, setEditedAccount] = useState<typeof accounts[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilters, setGenderFilters] = useState<string[]>(["M", "F"]);
  const [statusFilters, setStatusFilters] = useState<string[]>(["Emp Track", "Ent Track", "Phase1", "Inactive"]);

  // Toggle gender filter
  const toggleGenderFilter = (gender: string) => {
    setGenderFilters((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Filter accounts based on search, gender, and status
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilters.includes(account.gender);
    const matchesStatus = statusFilters.includes(account.status);
    return matchesSearch && matchesGender && matchesStatus;
  });

  const handleRowClick = (account: typeof accounts[0]) => {
    setSelectedAccount(account);
    setEditedAccount({ ...account });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAccount(null);
    setEditedAccount(null);
  };

  const handleSave = () => {
    if (editedAccount) {
      // Update the lastEdited timestamp
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }) + ' ' + now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      editedAccount.lastEdited = formattedDate;
      
      // In a real app, you would update the backend here
      console.log("Saving account:", editedAccount);
      
      // Update the local accounts array (for demo purposes)
      const index = accounts.findIndex(acc => acc.id === editedAccount.id);
      if (index !== -1) {
        accounts[index] = editedAccount;
      }
      
      handleCloseDialog();
    }
  };

  const updateField = (field: string, value: any) => {
    if (editedAccount) {
      setEditedAccount({ ...editedAccount, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/admin">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Accounts
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-1/2"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Gender
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                          <div className="space-y-2">
                            <Label className="font-semibold">Filter by Gender</Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="male"
                                checked={genderFilters.includes("M")}
                                onCheckedChange={() => toggleGenderFilter("M")}
                              />
                              <label htmlFor="male" className="text-sm cursor-pointer">
                                Male
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="female"
                                checked={genderFilters.includes("F")}
                                onCheckedChange={() => toggleGenderFilter("F")}
                              />
                              <label htmlFor="female" className="text-sm cursor-pointer">
                                Female
                              </label>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Status
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                          <div className="space-y-2">
                            <Label className="font-semibold">Filter by Status</Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="emp-track"
                                checked={statusFilters.includes("Emp Track")}
                                onCheckedChange={() => toggleStatusFilter("Emp Track")}
                              />
                              <label htmlFor="emp-track" className="text-sm cursor-pointer">
                                Emp Track
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="ent-track"
                                checked={statusFilters.includes("Ent Track")}
                                onCheckedChange={() => toggleStatusFilter("Ent Track")}
                              />
                              <label htmlFor="ent-track" className="text-sm cursor-pointer">
                                Ent Track
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="phase1"
                                checked={statusFilters.includes("Phase1")}
                                onCheckedChange={() => toggleStatusFilter("Phase1")}
                              />
                              <label htmlFor="phase1" className="text-sm cursor-pointer">
                                Phase1
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="inactive"
                                checked={statusFilters.includes("Inactive")}
                                onCheckedChange={() => toggleStatusFilter("Inactive")}
                              />
                              <label htmlFor="inactive" className="text-sm cursor-pointer">
                                Inactive
                              </label>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id} 
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{account.id}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.age}</TableCell>
                    <TableCell>{account.gender}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(account.status)} text-xs`}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{account.lastEdited}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRowClick(account)}
                      >
                        More
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Account Details</DialogTitle>
              <DialogDescription>
                View and edit beneficiary account information.
              </DialogDescription>
            </DialogHeader>
            {selectedAccount && editedAccount && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ID</p>
                      <p className="font-semibold">{selectedAccount.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <Input
                        type="text"
                        value={editedAccount.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="font-semibold"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <Input
                        type="number"
                        value={editedAccount.age}
                        onChange={(e) => updateField("age", parseInt(e.target.value))}
                        className="font-semibold"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <Select
                        value={editedAccount.gender}
                        onValueChange={(value) => updateField("gender", value)}
                      >
                        <SelectTrigger className="font-semibold">
                          {editedAccount.gender === "M" ? "Male" : "Female"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <Input
                        type="email"
                        value={editedAccount.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="font-semibold"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <Input
                        type="text"
                        value={editedAccount.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="font-semibold"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <Input
                        type="text"
                        value={editedAccount.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Education & Status */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Education & Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Education Level</p>
                      <Select
                        value={editedAccount.education}
                        onValueChange={(value) => updateField("education", value)}
                      >
                        <SelectTrigger className="font-semibold">
                          {editedAccount.education}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Primary">Primary</SelectItem>
                          <SelectItem value="Secondary">Secondary</SelectItem>
                          <SelectItem value="Tertiary">Tertiary</SelectItem>
                          <SelectItem value="Below Primary">Below Primary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <Select
                        value={editedAccount.status}
                        onValueChange={(value) => updateField("status", value)}
                      >
                        <SelectTrigger className="font-semibold">
                          {editedAccount.status}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Emp Track">Emp Track</SelectItem>
                          <SelectItem value="Ent Track">Ent Track</SelectItem>
                          <SelectItem value="Phase1">Phase1</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dates */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Important Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Account Created</p>
                      <p className="font-semibold">{selectedAccount.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Enrollment Date</p>
                      <p className="font-semibold">{selectedAccount.enrollmentDate}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Performance Scores */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Performance Scores</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">SkillCraft</p>
                      <Input
                        type="number"
                        value={editedAccount.skillcraftScore}
                        onChange={(e) => updateField("skillcraftScore", parseInt(e.target.value))}
                        className="text-2xl font-bold text-primary"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pathways</p>
                      <Input
                        type="number"
                        value={editedAccount.pathwaysScore}
                        onChange={(e) => updateField("pathwaysScore", parseInt(e.target.value))}
                        className="text-2xl font-bold text-primary"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Eligibility</p>
                      <Input
                        type="number"
                        value={editedAccount.eligibilityScore}
                        onChange={(e) => updateField("eligibilityScore", parseInt(e.target.value))}
                        className="text-2xl font-bold text-primary"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Last Edited */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Last Edited</h3>
                  <p className="font-semibold">{editedAccount.lastEdited}</p>
                </div>

                <Separator />

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}