
'use client';

import { useEffect, useState } from 'react';

type Skill = { id: number; name: string; description: string; city?: string };

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <section className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Featured Skills
        </h1>
        <p className="text-gray-600">
          Connect with peers and swap knowledge in your city.
        </p>
      </section>

      {loading && <p>Loading…</p>}
      {error   && <p className="text-red-600">{error}</p>}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map(s => (
          <article
            key={s.id}
            className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-lg"
          >
            <h2 className="mb-1 text-lg font-semibold">{s.name}</h2>
            <p className="mb-2 text-sm text-gray-700">{s.description}</p>
            {s.city && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">
                {s.city}
              </span>
            )}
          </article>
        ))}
      </section>

      {!loading && skills.length === 0 && (
        <p className="text-sm text-gray-600">No skills found.</p>
      )}
    </>
  );
}
