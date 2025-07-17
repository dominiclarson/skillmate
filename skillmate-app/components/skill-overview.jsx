import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SkillOverview({ activeSection }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full px-1"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Skill Overview</AccordionTrigger>
        <AccordionContent>
          <p>{activeSection.description}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
