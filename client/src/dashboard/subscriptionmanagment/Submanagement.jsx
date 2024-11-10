import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useState } from "react";
import { jsPDF } from "jspdf";

export default function Submanagement() {
  // Fake subscription data
  const [subscriptionData, setSubscriptionData] = useState({
    plan: "Premium",
    startDate: "2024-01-01",
    nextBilling: "2024-02-01",
    status: "Active",
    amount: "$20",
  });

  const [subscriptionHistory, setSubscriptionHistory] = useState([
    { date: "2024-01-01", amount: "$20", status: "Paid" },
    { date: "2024-02-01", amount: "$20", status: "Paid" },
    { date: "2024-03-01", amount: "$20", status: "Paid" },
    { date: "2024-04-01", amount: "$20", status: "Paid" },
    { date: "2024-05-01", amount: "$20", status: "Paid" },
    { date: "2024-06-01", amount: "$20", status: "Paid" },
    { date: "2024-07-01", amount: "$20", status: "Paid" },
    { date: "2024-08-01", amount: "$20", status: "Paid" },
    { date: "2024-09-01", amount: "$20", status: "Paid" },
    { date: "2024-10-01", amount: "$20", status: "Paid" },
    { date: "2024-11-01", amount: "$20", status: "Paid" },
    { date: "2024-12-01", amount: "$20", status: "Paid" },
  ]);


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Subscription History", 10, 10);
    doc.text("Plan: " + subscriptionData.plan, 10, 20);
    doc.text("Amount: " + subscriptionData.amount, 10, 30);
    doc.text("Status: " + subscriptionData.status, 10, 40);

    doc.text("History:", 10, 50);
    subscriptionHistory.forEach((history, index) => {
      doc.text(
        `${history.date} - ${history.amount} - ${history.status}`,
        10,
        60 + index * 10
      );
    });

    doc.save("subscription-history.pdf");
  };

  const handleCancelSubscription = () => {
    // You can call your API here to cancel the subscription
    alert("Subscription canceled!");
    setSubscriptionData({ ...subscriptionData, status: "Cancelled" });
  };

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
              <strong>Start Date:</strong> {subscriptionData.startDate}
            </p>
            <p>
              <strong>Next Billing:</strong> {subscriptionData.nextBilling}
            </p>
            <p>
              <strong>Status:</strong> {subscriptionData.status}
            </p>
            <p>
              <strong>Amount:</strong> {subscriptionData.amount}
            </p>
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
        </div>

        <div className="subscription-history mt-8 p-2 bg-background2 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Subscription History</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionHistory.map((history, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{history.date}</td>
                  <td className="px-4 py-2">{history.amount}</td>
                  <td className="px-4 py-2">{history.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
