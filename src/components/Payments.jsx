import axios from "axios";
import { Base_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Payments = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verify premium status from backend
  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(
        `${Base_URL}/premium/verify`,
        { withCredentials: true }
      );

      if (res.data?.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error("Premium verification failed", err);
    }
  };

  // ✅ MUST invoke the function
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const handleClick = async (type) => {
    try {
      setLoading(true);

      const order = await axios.post(
        `${Base_URL}/payment/create`,
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, currency, notes, orderId } = order.data.savePayments;
      const { keyId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevConnect",
        description: "Membership Payment",
        order_id: orderId,
        notes,

        handler: async () => {
          // ✅ Optimistic UI (instant UX)
          setIsUserPremium(true);

          // ✅ Backend truth check (after webhook)
          setTimeout(() => {
            verifyPremiumUser();
          }, 3000);
        },

        prefill: {
          name: notes.name,
          email: notes.emailId,
        },

        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isUserPremium ? (
        <div className="text-center text-2xl font-bold text-green-500">
          🎉 You are already a premium user
        </div>
      ) : (
        <div className="flex w-full gap-6">
          {/* SILVER */}
          <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
            <h1 className="text-3xl font-bold">Silver Plan</h1>
            <ul>
              <li>Unlimited connection requests</li>
              <li>Direct messages</li>
              <li>20 swipes/day</li>
              <li>Top feed placement</li>
            </ul>
            <button
              disabled={loading}
              className="bg-gray-300 text-black p-2 rounded-2xl active:bg-amber-400"
              onClick={() => handleClick("silver")}
            >
              Buy Now
            </button>
          </div>

          <div className="divider divider-horizontal">OR</div>

          {/* GOLD */}
          <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
            <h1 className="text-3xl font-bold">Gold Plan</h1>
            <ul>
              <li>Unlimited connection requests</li>
              <li>Direct messages</li>
              <li>20 swipes/day</li>
              <li>Top feed placement</li>
              <li>Verified profile tick</li>
            </ul>
            <button
              disabled={loading}
              className="bg-amber-300 text-black p-2 rounded-2xl active:bg-amber-400"
              onClick={() => handleClick("gold")}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;
