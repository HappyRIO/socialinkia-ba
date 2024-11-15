import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function Submanagement() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/subscription/details`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setSubscriptionData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/subscription/subscription-history`
        );
        const data = await response.json();
        if (data.paymentHistory) {
          setPaymentHistory(data.paymentHistory);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchUserDetails();
    fetchPaymentHistory();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Subscription History", 10, 10);
    doc.text("Plan: " + subscriptionData.plan, 10, 20);
    doc.text("Amount: " + subscriptionData.amount, 10, 30);
    doc.text("Status: " + subscriptionData.status, 10, 40);
    doc.save("subscription-history.pdf");
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/subscription/cancel-subscription`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscriptionId: subscriptionData.subscriptionId,
          }),
        }
      );
      if (response.ok) {
        alert("Subscription canceled successfully!");
        setSubscriptionData({ ...subscriptionData, status: "Cancelled" });
      } else {
        alert("Failed to cancel subscription.");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/subscription/create-subscription`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: selectedPlan,
            cardDetails,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Subscription successful!");
        setSubscriptionData(data.subscriptionDetails);
      } else {
        console.error("Subscription failed:", data.error);
      }
    } catch (error) {
      console.error("Error during subscription:", error);
    }
  };

  if (!subscriptionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Subscription"} />
      </div>
      <div className="contentzone mt-3 ml-0 sm:ml-64 w-full">
        <div className="subscription-info p-4 bg-background2 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
          <div className="subscription-details mb-4">
            <p>
              <strong>Plan:</strong> {subscriptionData.plan}
            </p>
            <p>
              <strong>Status:</strong> {subscriptionData.status}
            </p>
            <p>
              <strong>Amount:</strong> {subscriptionData.amount}
            </p>
            {subscriptionData.trialEnd && (
              <p>
                <strong>Trial End:</strong>{" "}
                {new Date(
                  subscriptionData.trialEnd * 1000
                ).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="actions flex gap-4 mt-4">
            <button
              className="bg-primary text-white py-2 px-4 rounded-md"
              onClick={handleDownloadPDF}
            >
              Download History as PDF
            </button>
            {subscriptionData.status === "Active" && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            )}
          </div>
          <div className="plan-upgrade mt-4">
            <label className="block mb-2 font-semibold">Upgrade Plan:</label>
            <select
              className="px-4 py-2 border rounded"
              value={subscriptionData.plan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
            <form onSubmit={handleSubscriptionSubmit} className="mt-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="expiryMonth"
                placeholder="Expiry Month (MM)"
                value={cardDetails.expiryMonth}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="expiryYear"
                placeholder="Expiry Year (YY)"
                value={cardDetails.expiryYear}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="cvc"
                placeholder="CVC"
                value={cardDetails.cvc}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded-md mt-4"
              >
                Upgrade Subscription
              </button>
            </form>
          </div>
        </div>

        <div className="w-full mt-4 bg-background2 rounded-lg flex flex-col justify-center items-center p-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-background rounded-lg">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Currency</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{`$${(
                      payment.amount / 100
                    ).toFixed(2)}`}</td>
                    <td className="px-4 py-2 capitalize">{payment.status}</td>
                    <td className="px-4 py-2">
                      {payment.currency.toUpperCase()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
