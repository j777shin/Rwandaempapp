import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const candidates = [
  { id: 1, name: "Jean Baptiste", businessIdea: "Tech Startup", score: 88, selected: false },
  { id: 2, name: "Marie Claire", businessIdea: "Agri-Business", score: 92, selected: true },
  { id: 3, name: "Patrick Nkusi", businessIdea: "E-commerce", score: 85, selected: false },
  { id: 4, name: "Ange Uwase", businessIdea: "Fashion Design", score: 78, selected: false },
];

export function EntrepreneurshipSelection() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Entrepreneurship Beneficiary Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Business Idea</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.businessIdea}</TableCell>
                    <TableCell>{candidate.score}</TableCell>
                    <TableCell>
                      <Badge variant={candidate.selected ? "default" : "secondary"}>
                        {candidate.selected ? "Selected" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-[#FAD201] text-black hover:bg-[#DAB201]">
                        {candidate.selected ? "Deselect" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
