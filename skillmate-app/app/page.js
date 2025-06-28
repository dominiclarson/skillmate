import Image from "next/image";
import Link from 'next/link';

const skills = [
  "Vehicle Mechanic", "Farm/Industrial Mechanic", "Machinist", "Welder", "Fabricator", 
  "Carpenter/Woodworker", "Plumber", "Electrician", "Computer Repair/Building", 
  "Mobile device repair", "Chef", "Roofing/Framing", "Finish work (trim, paint)", 
  "Structural Engineer", "HVAC", "Gunsmith", "Artist", "Musician", "Manufacturing", 
  "Programmer", "Web designer", "System Administrator", "Database Administrator", 
  "Networking Engineer"
]

export default function Home() {
  return (

    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Featured Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow bg-white hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{skill}</h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
  
}
