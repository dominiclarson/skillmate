import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { skills } from "@/lib/skills";
import { ModeToggle } from "@/components/theme-toggle";

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
            <ModeToggle />
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
              <CardContent className="p-4 h-full flex items-center justify-center">
                <Link href={`/search?skill=${skill.name}`}>
                  <h2 className="text-lg font-semibold break-words whitespace-normal text-center line-clamp-2">
                    <span className="mr-2">{skill.emoji}</span>
                    {skill.name}
                  </h2>
                </Link>
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
