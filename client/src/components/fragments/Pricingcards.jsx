import { Link } from "react-router-dom";

export default function Pricingcard() {
  return (
    <div className="flex items-center justify-center bg-background">
      {/* Button 1 */}
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto mb-8 max-w-screen-md lg:mb-12 text-center">
          <h2 className="mb-10 text-4xl font-bold tracking-tight text-primary">
            Affordable Plans for Every Business
          </h2>
        </div>
        <div className="space-y-8 lg:grid md:grid-cols-3 lg:space-y-0 lg:gap-10">
          {/* Pricing Card 1 */}
          <div className="mx-auto flex max-w-lg space-y-8 items-start flex-col rounded-lg border border-gray-200 bg-white p-6 text-gray-900 xl:p-8">
            <h3 className="text-lg font-normal">Basic</h3>
            <div className="my-8 flex items-baseline justify-center">
              <span className="mr-2 text-5xl font-extrabold">$29</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="font-light text-gray-600 sm:text-sm">
              Best option for personal use & for your next project.
            </p>
            <Link
              to={"/signup?subscription=basic"}
              className="cursor-pointer bg-gray-900 w-full rounded-md p-3 text-center text-sm font-semibold text-white shadow-sm hover:-translate-y-1"
            >
              Get started
            </Link>
            {/* List */}
            <ul
              role="list"
              className="mb-8 space-y-4 text-left text-gray-600 text-sm"
            >
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>10,000 visitors</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Unlimited widgets</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>All analytics features</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Lifetime updates</span>
              </li>
            </ul>
          </div>

          {/* Pricing Card 2 */}
          <div className="mx-auto flex max-w-lg space-y-8 items-start flex-col rounded-lg bg-accent p-6 text-gray-200 xl:p-8">
            <h3 className="text-lg font-normal">Essential</h3>
            <div className="my-8 flex items-baseline justify-center">
              <span className="mr-2 text-5xl font-extrabold">$29</span>
              <span className="text-gray-200">/month</span>
            </div>
            <p className="font-light text-gray-200 sm:text-sm">
              Best option for personal use & for your next project.
            </p>
            <Link
              to={"/signup?subscription=standard"}
              className="cursor-pointer bg-gray-900 w-full rounded-md p-3 text-center text-sm font-semibold text-white shadow-sm hover:-translate-y-1"
            >
              Get started
            </Link>
            {/* List */}
            <ul
              role="list"
              className="mb-8 space-y-4 text-left text-gray-200 text-sm"
            >
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>10,000 visitors</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Unlimited widgets</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>All analytics features</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Lifetime updates</span>
              </li>
            </ul>
          </div>

          {/* Pricing Card 3 */}
          <div className="mx-auto flex max-w-lg space-y-8 items-start flex-col rounded-lg border border-gray-200 bg-white p-6 text-gray-900 xl:p-8">
            <h3 className="text-lg font-normal">Premium</h3>
            <div className="my-8 flex items-baseline justify-center">
              <span className="mr-2 text-5xl font-extrabold">$49</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="font-light text-gray-600 sm:text-sm">
              Best option for personal use & for your next project.
            </p>
            <Link
              to={"/signup?subscription=premium"}
              className="cursor-pointer bg-gray-900 w-full rounded-md p-3 text-center text-sm font-semibold text-white shadow-sm hover:-translate-y-1"
            >
              Get started
            </Link>
            {/* List */}
            <ul
              role="list"
              className="mb-8 space-y-4 text-left text-gray-600 text-sm"
            >
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>10,000 visitors</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Unlimited widgets</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>All analytics features</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Lifetime updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
