


'use client';

import React, { useEffect, useState }  from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skill } from '@/lib/skills';

export function SkillOverview({ activeSection }: { activeSection: Skill }) {
  const [skills, setSkills] = useState([]);

  useEffect(()=> {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {setSkills(data);})
      .catch(err => console.error('Fetch error(skills):', err));
    }, []);

  return (
    <Accordion
      type="single"
      collapsible
      value={activeSection.id}
      className="w-full px-1"
    >
      <AccordionItem value={activeSection.id} className={undefined}>
        <AccordionTrigger className={undefined}>{activeSection.name} Overview</AccordionTrigger>
        <AccordionContent className={undefined}>
          <p>{activeSection.description}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

