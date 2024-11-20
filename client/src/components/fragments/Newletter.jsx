import { useState } from "react";

const Newsletter = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  // const thanskUrl = window.location.href;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate form submission success
    setEmail("");
    setIsSubmitted(true);
  };

  return (
    <div className="w-full gap-2 flex flex-col justify-center items-center">
      <form
        action="https://formsubmit.co/cuesitweb@hamham.uk"
        method="POST"
        className="flex flex-row gap-1 border-[2px] border-accent w-fit p-1 rounded-lg"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="_captcha" value="false" />
        {/* <input type="hidden" name="_next" value={thanskUrl} /> */}

        <input
          placeholder="subscribe"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="border-transparent bg-transparent p-2 focus:border-none"
          type="email"
          required
        />
        <button
          type="submit"
          className="bg-accent p-2 rounded-r-lg hover:bg-background2"
        >
          sign up
        </button>
      </form>
      {isSubmitted && (
        <div className="submitsucsess text-sm border-[2px] border-green-500 rounded-lg px-2">
          <p>Thank you for your email have been submitted</p>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
