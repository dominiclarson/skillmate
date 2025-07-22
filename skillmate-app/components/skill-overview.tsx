


'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skill } from '@/lib/skills';

export function SkillOverview({ activeSection }: { activeSection: Skill }) {
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

