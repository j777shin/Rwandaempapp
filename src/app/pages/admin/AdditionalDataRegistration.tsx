import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, FilePlus, Upload, Search } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

export function AdditionalDataRegistration() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#00A1DE] rounded-lg flex items-center justify-center">
              <FilePlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Additional Data Registration</h1>
              <p className="text-muted-foreground">Add supplementary information for existing beneficiaries</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#00A1DE] text-[#00A1DE]">Phase 1</Badge>
        </div>

        {/* Search Beneficiary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Beneficiary</CardTitle>
            <CardDescription>Search for a beneficiary to add additional data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Beneficiary ID or Name</Label>
                <Input id="search" placeholder="Enter ID or name..." />
              </div>
              <Button className="mt-6 bg-[#00A1DE] hover:bg-[#00A1DE]/90">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Data Form */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Add supplementary data for selected beneficiary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="skills">Additional Skills</Label>
                <Textarea id="skills" placeholder="List any additional skills..." rows={4} />
              </div>
              <div>
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea id="experience" placeholder="Previous work experience..." rows={4} />
              </div>
              <div>
                <Label htmlFor="education">Educational Background</Label>
                <Textarea id="education" placeholder="Additional education details..." rows={4} />
              </div>
              <div>
                <Label htmlFor="interests">Career Interests</Label>
                <Textarea id="interests" placeholder="Career goals and interests..." rows={4} />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Administrative Notes</Label>
              <Textarea id="notes" placeholder="Any additional notes or observations..." rows={3} />
            </div>

            <div className="flex gap-4">
              <Button className="bg-[#00A651] hover:bg-[#00A651]/90">
                <Upload className="w-4 h-4 mr-2" />
                Save Additional Data
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
