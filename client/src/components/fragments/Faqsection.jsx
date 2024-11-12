import { CirclePower } from "lucide-react";
import { useEffect, useState } from "react";

const FAQSection = () => {
  const [faq, setFaqs] = useState([]);

  const faqQuestions = [
    {
      summary: "How can I get started?",
      content:
        "Starting is easy. Sign up to get an account and you'll have access to the functions of our platform. No credit card is required for the initial registration.",
    },
    {
      summary: "What is the price structure?",
      content:
        "Our pricing structure is flexible. We offer free plans and payments. You can choose the one that best suits your needs and budget.",
    },
    {
      summary: "What kind of support do you provide?",
      content:
        "We offer a comprehensive customer service. You can communicate with our support team through various channels, including email, chat and knowledge base.",
    },
    {
      summary: "Can I cancel my subscription any minute?",
      content:
        "Yes, you can cancel your subscription at any time without hidden charges. We believe in providing a smooth experience for our users.",
    },
  ];

  useEffect(() => {
    setFaqs(faqQuestions);
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-custom">
      <div className="py-24 px-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">F.A.Q</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>
        <ul className="basis-1/2">
          {faq.map((data, index) => (
            <li className="group" key={index}>
              <details className="border-t border-base-content/10 overflow-hidden transition-all duration-300 ease-in-out">
                <summary className="flex gap-2 items-center w-full py-5 text-base font-semibold text-left cursor-pointer md:text-lg">
                  <span className="flex-1 text-base-content">
                    {data.summary}
                  </span>
                  <CirclePower />
                </summary>
                <div className="pb-5 leading-relaxed">
                  <p className="space-y-2 leading-relaxed">{data.content}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FAQSection;
