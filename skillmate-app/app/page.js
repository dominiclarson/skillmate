import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const skills = [
  "Vehicle Mechanic",
  "Farm/Industrial Mechanic",
  "Machinist",
  "Welder",
  "Fabricator",
  "Carpenter / Woodworker",
  "Plumber",
  "Electrician",
  "Computer Repair / Building",
  "Mobile device repair",
  "Chef",
  "Roofing/Framing",
  "Finish work (trim, paint)",
  "Structural Engineer",
  "HVAC",
  "Gunsmith",
  "Artist",
  "Musician",
  "Manufacturing",
  "Programmer",
  "Web designer",
  "System Administrator",
  "Database Administrator",
  "Networking Engineer",
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-black shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link
            href="/"
            className="text-2xl font-bold text-black dark:text-white"
          >
            SkillMate
          </Link>
          <nav className="space-x-6 text-black dark:text-white">
            <Link
              href="/"
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Featured Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition w-full h-24"
            >
              <CardContent>
                <h2 className="text-xl font-semibold break-words whitespace-normal">
                  {skill}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SkillMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
