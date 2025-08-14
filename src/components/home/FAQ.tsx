
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Investify?",
      answer: "Investify is a solution that helps businesses find the perfect investors using AI-powered matchmaking. We offer an exceptional experience in the funding process with smart investor matching and secure data handling."
    },
    {
      question: "How long does it take for a business to secure funding?",
      answer: "On average, businesses on our platform secure funding 81% faster than through traditional methods. The exact timeline varies based on funding stage, industry, and investment size, but our data shows most successful matches move from introduction to term sheet in under 45 days."
    },
    {
      question: "How quickly can I activate Investify?",
      answer: "You can create your account immediately. Most businesses complete their profiles and start receiving investor matches within 24-48 hours. Our onboarding team provides support throughout the setup process."
    },
    {
      question: "Can I tailor the platform to my brand?",
      answer: "Yes! Investify offers customization options for businesses to maintain their brand identity throughout the investor presentation process. You can customize your profile, pitch deck templates, and data room to reflect your brand."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container-custom max-w-4xl">
        <h2 className="text-4xl font-garrett font-bold mb-12 text-center">FAQs</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border p-4 mb-4 rounded-lg bg-investify-mint/30 border-investify-primary/10 hover:border-investify-primary/30 transition-colors">
              <AccordionTrigger className="text-lg font-medium text-gray-800">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
