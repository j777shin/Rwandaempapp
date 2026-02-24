import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Checkbox } from "@/app/components/ui/checkbox";
import { ArrowLeft, UserPlus, Upload, FileSpreadsheet, User, Database, Edit2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { api } from "@/app/lib/api";

export function DataRegistration() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [additionalCsvFile, setAdditionalCsvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    email: "test.user@example.com",
    name: "Test User",
    age: "24",
    gender: "female",
    contact: "+250788123456",

    // Household Information
    marriage_status: false,
    disability: false,
    education_level: "secondary",
    occupation: true,
    informal_working: true,

    // Livestock Assets
    num_cows: "0",
    num_goats: "2",
    num_chickens: "0",
    num_sheep: "0",
    num_pigs: "1",
    num_rabbits: "0",

    // Land & Housing
    land_ownership: true,
    land_size: "0.5",
    num_radio: "1",
    num_phone: "1",
    num_tv: "0",
    fuel: "EU4",
    water_source: "WS1",
    floor: false,
    roof: true,
    walls: false,
    toilet: true,
  });

  // Candidates for Additional Info manual entry - loaded from API
  const [candidates, setCandidates] = useState<{ id: string; name: string; age: number; email: string; attendance: string }[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState("");

  // Loading states for submit buttons
  const [csvSubmitting, setCsvSubmitting] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [additionalCsvSubmitting, setAdditionalCsvSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Load candidates from API for the Additional Info tab
  useEffect(() => {
    const loadCandidates = async () => {
      setCandidatesLoading(true);
      try {
        const data = await api.adminListBeneficiaries();
        const beneficiaries = Array.isArray(data) ? data : data.items ?? data.beneficiaries ?? [];
        setCandidates(
          beneficiaries.map((b: any) => ({
            id: b.id ?? b.beneficiary_id ?? "",
            name: b.name ?? `${b.first_name ?? ""} ${b.last_name ?? ""}`.trim(),
            age: b.age ?? 0,
            email: b.email ?? "",
            attendance: String(b.offline_attendance ?? b.attendance_score ?? b.attendance ?? "0"),
          }))
        );
      } catch (err: any) {
        toast.error(err.message || "Failed to load candidates");
      } finally {
        setCandidatesLoading(false);
      }
    };
    loadCandidates();
  }, []);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleAdditionalCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdditionalCsvFile(file);
    }
  };

  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error("Please select a CSV file to upload");
      return;
    }
    setCsvSubmitting(true);
    try {
      const result = await api.adminUploadCsv(csvFile);
      const count = result?.count ?? result?.registered ?? result?.total ?? "";
      toast.success(
        count
          ? `Successfully registered ${count} candidates from ${csvFile.name}`
          : `Successfully processed ${csvFile.name}`
      );
      setCsvFile(null);
      // Reset the file input
      const fileInput = document.getElementById("csv-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      toast.error(err.message || "Failed to upload CSV file");
    } finally {
      setCsvSubmitting(false);
    }
  };

  const handleAdditionalCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalCsvFile) {
      toast.error("Please select a CSV file to upload");
      return;
    }
    setAdditionalCsvSubmitting(true);
    try {
      const result = await api.adminUploadCsv(additionalCsvFile);
      const count = result?.count ?? result?.updated ?? result?.total ?? "";
      toast.success(
        count
          ? `Successfully processed ${count} records from ${additionalCsvFile.name}`
          : `Successfully processed ${additionalCsvFile.name}`
      );
      setAdditionalCsvFile(null);
      const fileInput = document.getElementById("additional-csv-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      toast.error(err.message || "Failed to upload additional CSV file");
    } finally {
      setAdditionalCsvSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualSubmitting(true);
    try {
      const payload = {
        email: formData.email,
        name: formData.name,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        contact: formData.contact,
        marriage_status: formData.marriage_status,
        disability: formData.disability,
        education_level: formData.education_level,
        occupation: formData.occupation,
        informal_working: formData.informal_working,
        num_cattle: parseInt(formData.num_cows, 10),
        num_goats: parseInt(formData.num_goats, 10),
        num_sheep: parseInt(formData.num_sheep, 10),
        num_pigs: parseInt(formData.num_pigs, 10),
        land_ownership: formData.land_ownership,
        land_size: parseFloat(formData.land_size),
        num_radio: parseInt(formData.num_radio, 10),
        num_phone: parseInt(formData.num_phone, 10),
        num_tv: parseInt(formData.num_tv, 10),
        cooking_firewood: formData.fuel === "EU4",
        cooking_gas: formData.fuel === "EU8",
        cooking_charcoal: formData.fuel === "EU9",
        floor_earth_sand: !formData.floor,
        floor_tiles: formData.floor,
        lighting: formData.roof,
      };

      await api.adminRegisterManual(payload);
      toast.success("Candidate registered successfully!");

      // Reset form
      setFormData({
        email: "",
        name: "",
        age: "",
        gender: "",
        contact: "",
        marriage_status: false,
        disability: false,
        education_level: "",
        occupation: false,
        informal_working: false,
        num_cows: "0",
        num_goats: "0",
        num_chickens: "0",
        num_sheep: "0",
        num_pigs: "0",
        num_rabbits: "0",
        land_ownership: false,
        land_size: "0",
        num_radio: "0",
        num_phone: "0",
        num_tv: "0",
        fuel: "",
        water_source: "",
        floor: false,
        roof: false,
        walls: false,
        toilet: false,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to register candidate");
    } finally {
      setManualSubmitting(false);
    }
  };

  const handleEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSave = async (id: string) => {
    try {
      await api.adminUpdateBeneficiary(id, { offline_attendance: parseInt(editValue, 10) || 0 });
      setCandidates(candidates.map(c =>
        c.id === id ? { ...c, attendance: editValue } : c
      ));
      setEditingId(null);
      toast.success("Attendance score updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save attendance score");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Data Registration</CardTitle>
                <CardDescription>Register candidates and manage additional beneficiary data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Main Tabs: Candidate Info and Additional Info */}
            <Tabs defaultValue="candidate" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="candidate" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Candidate Info
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Phase 1 Offline Training Info
                </TabsTrigger>
              </TabsList>

              {/* Candidate Info Tab */}
              <TabsContent value="candidate">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="csv" className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Bulk Upload (CSV)
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Manual Entry
                    </TabsTrigger>
                  </TabsList>

                  {/* CSV Upload Tab */}
                  <TabsContent value="csv" className="mt-6">
                    <div className="space-y-6">
                      <Alert className="border-primary bg-primary/10">
                        <FileSpreadsheet className="h-4 w-4 text-primary" />
                        <AlertTitle>CSV Format Requirements</AlertTitle>
                        <AlertDescription>
                          Upload a CSV file with the following columns: name, age, gender, contact, marriage_status, disability, education_level, occupation, informal_working, num_cows, num_goats, num_chickens, num_sheep, num_pigs, num_rabbits, land_ownership, land_size, num_radio, num_phone, num_tv, fuel, water_source, floor, roof, walls, toilet
                        </AlertDescription>
                      </Alert>

                      <form onSubmit={handleCsvSubmit} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <Label htmlFor="csv-upload" className="cursor-pointer">
                            <div className="text-lg mb-2">
                              {csvFile ? csvFile.name : "Click to upload CSV file"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              or drag and drop your file here
                            </div>
                          </Label>
                          <Input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleCsvUpload}
                            className="hidden"
                          />
                        </div>

                        {csvFile && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                              <strong>File selected:</strong> {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                            </p>
                          </div>
                        )}

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={csvSubmitting}>
                          {csvSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {csvSubmitting ? "Uploading..." : "Upload and Process CSV"}
                        </Button>
                      </form>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Download CSV Template</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download a template CSV file with all required columns to ensure proper formatting
                        </p>
                        <Button variant="outline" size="sm">
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Manual Entry Tab */}
                  <TabsContent value="manual" className="mt-6">
                    <form onSubmit={handleManualSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2 border-primary">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="age">Age (15-35) *</Label>
                            <Input
                              id="age"
                              type="number"
                              min="15"
                              max="35"
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gender *</Label>
                            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact">Contact</Label>
                            <Input
                              id="contact"
                              value={formData.contact}
                              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Household Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2 border-primary">Household Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Education Level *</Label>
                            <Select value={formData.education_level} onValueChange={(value) => setFormData({ ...formData, education_level: value })} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="below_primary">Below Primary</SelectItem>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="secondary">Secondary</SelectItem>
                                <SelectItem value="secondary_professional">Secondary Professional</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="tertiary_and_above">Tertiary and Above</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="marriage_status"
                                checked={formData.marriage_status}
                                onCheckedChange={(checked) => setFormData({ ...formData, marriage_status: checked as boolean })}
                              />
                              <Label htmlFor="marriage_status">Married</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="disability"
                                checked={formData.disability}
                                onCheckedChange={(checked) => setFormData({ ...formData, disability: checked as boolean })}
                              />
                              <Label htmlFor="disability">Has Disability</Label>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="occupation"
                              checked={formData.occupation}
                              onCheckedChange={(checked) => setFormData({ ...formData, occupation: checked as boolean })}
                            />
                            <Label htmlFor="occupation">Has Occupation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="informal_working"
                              checked={formData.informal_working}
                              onCheckedChange={(checked) => setFormData({ ...formData, informal_working: checked as boolean })}
                            />
                            <Label htmlFor="informal_working">Informal Working</Label>
                          </div>
                        </div>
                      </div>

                      {/* Livestock Assets */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2 border-primary">Livestock Assets</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="num_cows">Number of Cows</Label>
                            <Input
                              id="num_cows"
                              type="number"
                              min="0"
                              value={formData.num_cows}
                              onChange={(e) => setFormData({ ...formData, num_cows: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_goats">Number of Goats</Label>
                            <Input
                              id="num_goats"
                              type="number"
                              min="0"
                              value={formData.num_goats}
                              onChange={(e) => setFormData({ ...formData, num_goats: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_chickens">Number of Chickens</Label>
                            <Input
                              id="num_chickens"
                              type="number"
                              min="0"
                              value={formData.num_chickens}
                              onChange={(e) => setFormData({ ...formData, num_chickens: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_sheep">Number of Sheep</Label>
                            <Input
                              id="num_sheep"
                              type="number"
                              min="0"
                              value={formData.num_sheep}
                              onChange={(e) => setFormData({ ...formData, num_sheep: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_pigs">Number of Pigs</Label>
                            <Input
                              id="num_pigs"
                              type="number"
                              min="0"
                              value={formData.num_pigs}
                              onChange={(e) => setFormData({ ...formData, num_pigs: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_rabbits">Number of Rabbits</Label>
                            <Input
                              id="num_rabbits"
                              type="number"
                              min="0"
                              value={formData.num_rabbits}
                              onChange={(e) => setFormData({ ...formData, num_rabbits: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Land & Housing */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2 border-primary">Land & Housing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="land_ownership"
                              checked={formData.land_ownership}
                              onCheckedChange={(checked) => setFormData({ ...formData, land_ownership: checked as boolean })}
                            />
                            <Label htmlFor="land_ownership">Land Ownership</Label>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="land_size">Land Size (hectares)</Label>
                            <Input
                              id="land_size"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.land_size}
                              onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_radio">Number of Radios</Label>
                            <Input
                              id="num_radio"
                              type="number"
                              min="0"
                              value={formData.num_radio}
                              onChange={(e) => setFormData({ ...formData, num_radio: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_phone">Number of Phones</Label>
                            <Input
                              id="num_phone"
                              type="number"
                              min="0"
                              value={formData.num_phone}
                              onChange={(e) => setFormData({ ...formData, num_phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_tv">Number of TVs</Label>
                            <Input
                              id="num_tv"
                              type="number"
                              min="0"
                              value={formData.num_tv}
                              onChange={(e) => setFormData({ ...formData, num_tv: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Fuel Type</Label>
                            <Select value={formData.fuel} onValueChange={(value) => setFormData({ ...formData, fuel: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EU4">EU4</SelectItem>
                                <SelectItem value="EU8">EU8</SelectItem>
                                <SelectItem value="EU9">EU9</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Water Source</Label>
                            <Select value={formData.water_source} onValueChange={(value) => setFormData({ ...formData, water_source: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select water source" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="WS1">WS1</SelectItem>
                                <SelectItem value="WS2">WS2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="floor"
                              checked={formData.floor}
                              onCheckedChange={(checked) => setFormData({ ...formData, floor: checked as boolean })}
                            />
                            <Label htmlFor="floor">Quality Floor</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="roof"
                              checked={formData.roof}
                              onCheckedChange={(checked) => setFormData({ ...formData, roof: checked as boolean })}
                            />
                            <Label htmlFor="roof">Quality Roof</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="walls"
                              checked={formData.walls}
                              onCheckedChange={(checked) => setFormData({ ...formData, walls: checked as boolean })}
                            />
                            <Label htmlFor="walls">Quality Walls</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="toilet"
                              checked={formData.toilet}
                              onCheckedChange={(checked) => setFormData({ ...formData, toilet: checked as boolean })}
                            />
                            <Label htmlFor="toilet">Has Toilet</Label>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={manualSubmitting}>
                        {manualSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        {manualSubmitting ? "Registering..." : "Register Candidate"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Additional Info Tab */}
              <TabsContent value="additional">
                <Tabs defaultValue="csv-additional" className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="csv-additional" className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Bulk Upload (CSV)
                    </TabsTrigger>
                    <TabsTrigger value="manual-additional" className="flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      Manual Entry
                    </TabsTrigger>
                  </TabsList>

                  {/* Additional Info CSV Upload */}
                  <TabsContent value="csv-additional" className="mt-6">
                    <div className="space-y-6">
                      <Alert className="border-primary bg-primary/10">
                        <FileSpreadsheet className="h-4 w-4 text-primary" />
                        <AlertTitle>CSV Format Requirements</AlertTitle>
                        <AlertDescription>
                          Upload a CSV file with candidate ID and attendance score columns: candidate_id, attendance_score
                        </AlertDescription>
                      </Alert>

                      <form onSubmit={handleAdditionalCsvSubmit} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <Label htmlFor="additional-csv-upload" className="cursor-pointer">
                            <div className="text-lg mb-2">
                              {additionalCsvFile ? additionalCsvFile.name : "Click to upload CSV file"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              or drag and drop your file here
                            </div>
                          </Label>
                          <Input
                            id="additional-csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleAdditionalCsvUpload}
                            className="hidden"
                          />
                        </div>

                        {additionalCsvFile && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                              <strong>File selected:</strong> {additionalCsvFile.name} ({(additionalCsvFile.size / 1024).toFixed(2)} KB)
                            </p>
                          </div>
                        )}

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={additionalCsvSubmitting}>
                          {additionalCsvSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {additionalCsvSubmitting ? "Uploading..." : "Upload and Process CSV"}
                        </Button>
                      </form>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Download CSV Template</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download a template CSV file for additional data
                        </p>
                        <Button variant="outline" size="sm">
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Additional Info Manual Entry - Table of Candidates */}
                  <TabsContent value="manual-additional" className="mt-6">
                    <div className="space-y-4">
                      <Alert className="border-primary bg-primary/10">
                        <Database className="h-4 w-4 text-primary" />
                        <AlertTitle>Attendance Score Management</AlertTitle>
                        <AlertDescription>
                          Edit attendance scores for registered candidates. Click the edit button to modify scores.
                        </AlertDescription>
                      </Alert>

                      <Card>
                        <CardHeader>
                          <CardTitle>Registered Candidates</CardTitle>
                          <CardDescription>Update attendance scores for Phase 1 candidates</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <Input
                              type="text"
                              placeholder="Search by name or email..."
                              value={candidateSearch}
                              onChange={(e) => setCandidateSearch(e.target.value)}
                              className="max-w-md"
                            />
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Attendance Score</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {candidatesLoading ? (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Loading candidates...</p>
                                  </TableCell>
                                </TableRow>
                              ) : candidates.filter(c => {
                                if (!candidateSearch) return true;
                                const q = candidateSearch.toLowerCase();
                                return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
                              }).length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {candidates.length === 0
                                      ? "No candidates found. Register candidates first using the Candidate Info tab."
                                      : "No candidates match your search."}
                                  </TableCell>
                                </TableRow>
                              ) : candidates.filter(c => {
                                if (!candidateSearch) return true;
                                const q = candidateSearch.toLowerCase();
                                return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
                              }).map((candidate) => (
                                <TableRow key={candidate.id}>
                                  <TableCell className="font-medium">{candidate.name}</TableCell>
                                  <TableCell>{candidate.age}</TableCell>
                                  <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
                                  <TableCell>
                                    {editingId === candidate.id ? (
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-24"
                                      />
                                    ) : (
                                      <span>{candidate.attendance}</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {editingId === candidate.id ? (
                                      <Button
                                        size="sm"
                                        onClick={() => handleSave(candidate.id)}
                                        className="bg-primary hover:bg-primary/90"
                                      >
                                        <Save className="w-4 h-4 mr-1" />
                                        Save
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(candidate.id, candidate.attendance)}
                                      >
                                        <Edit2 className="w-4 h-4 mr-1" />
                                        Edit
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}