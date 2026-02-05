import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { category: "Digital Skills", average: 78 },
  { category: "Communication", average: 85 },
  { category: "Problem Solving", average: 72 },
  { category: "Leadership", average: 68 },
];

export function SkillCraftInfo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">SkillCraft Test Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#00A1DE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#00A1DE]">1,247</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#FAD201]">75.8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#00A651]">82%</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
