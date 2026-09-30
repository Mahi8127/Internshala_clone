import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import {
  Check,
  Crown,
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Subscription {
  user: string;
  plan: "free" | "bronze" | "silver" | "gold";
  price: number;
  monthlyApplicationLimit: number | null;
  applicationsUsed: number;
  currentMonth: string;
  startDate: string | null;
  endDate: string | null;
  paymentId: string;
  orderId: string;
  paymentStatus: string;
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    applications: "1 application / month",
    description: "Get started with basic internship applications.",
    popular: false,
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 100,
    applications: "3 applications / month",
    description: "For students applying to a few opportunities.",
    popular: false,
  },
  {
    id: "silver",
    name: "Silver",
    price: 300,
    applications: "5 applications / month",
    description: "For students actively looking for internships.",
    popular: true,
  },
  {
    id: "gold",
    name: "Gold",
    price: 1000,
    applications: "Unlimited applications",
    description: "Apply to as many internships as you want.",
    popular: false,
  },
];

const SubscriptionPage = () => {
  const user = useSelector(selectuser);

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* =====================================================
     FETCH CURRENT SUBSCRIPTION
     ===================================================== */

  const fetchSubscription = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://internshala-backend-5ycp.onrender.com/api/payment/subscription/${user.id}`
      );

      if (response.data.success) {
        setSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error("Subscription fetch error:", error);
      toast.error("Unable to load subscription");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  /* =====================================================
     CHECK PAYMENT TIME
     ===================================================== */

  const isPaymentTimeAllowed = () => {
    const now = new Date();

    const indiaTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    const [hour] = indiaTime.split(":").map(Number);

    return hour === 10;
  };

  /* =====================================================
     FORMAT DATE
     ===================================================== */

  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     START RAZORPAY PAYMENT
     ===================================================== */

  const handleSubscribe = async (planId: string) => {
    if (!user?.id) {
      toast.error("Please login first");
      return;
    }

    if (planId === "free") {
      toast.success("Free plan is already available");

      const element = document.getElementById("current-plan");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }

      return;
    }

    /* ---------------------------------------------
       Frontend time check
       --------------------------------------------- */

    if (!isPaymentTimeAllowed()) {
      toast.error(
        "Payments are available only between 10:00 AM and 11:00 AM IST."
      );
      return;
    }

    try {
      setPaymentLoading(true);

      /* ---------------------------------------------
         Create Razorpay Order
         --------------------------------------------- */

      const orderResponse = await axios.post(
        "http://internshala-backend-5ycp.onrender.com/api/payment/subscription/create-order",
        {
          userId: user.id,
          plan: planId,
        }
      );

      if (!orderResponse.data.success) {
        toast.error(
          orderResponse.data.message ||
            "Unable to create payment order"
        );

        setPaymentLoading(false);
        return;
      }

      const order = orderResponse.data.order;

      /* ---------------------------------------------
         Razorpay Checkout Options
         --------------------------------------------- */

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "InternArea",

        description: `${orderResponse.data.plan.name} Subscription`,

        order_id: order.id,

        prefill: {
          name: user.name || "",
          email: user.email || "",
        },

        notes: {
          userId: user.id,
          plan: planId,
        },

        theme: {
          color: "#2563eb",
        },

        handler: async function (response: any) {
          try {
            toast.loading(
              "Verifying your payment...",
              {
                id: "payment-verification",
              }
            );

            /* -----------------------------------------
               Verify Payment
               ----------------------------------------- */

            const verifyResponse = await axios.post(
              "http://internshala-backend-5ycp.onrender.com/api/payment/subscription/verify-payment",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                userId: user.id,

                plan: planId,
              }
            );

            toast.dismiss("payment-verification");

            if (verifyResponse.data.success) {
              toast.success(
                "Payment successful! Your plan is now active."
              );

              setSubscription(
                verifyResponse.data.subscription
              );

              await fetchSubscription();
            } else {
              toast.error(
                verifyResponse.data.message ||
                  "Payment verification failed"
              );
            }
          } catch (error: any) {
            toast.dismiss("payment-verification");

            console.error(
              "Payment verification error:",
              error
            );

            toast.error(
              error?.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);

            toast.error("Payment cancelled");
          },
        },
      };

      /* ---------------------------------------------
         Check Razorpay
         --------------------------------------------- */

      if (!window.Razorpay) {
        toast.error(
          "Razorpay is not loaded. Please refresh the page."
        );

        setPaymentLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          toast.error(
            response?.error?.description ||
              "Payment failed"
          );

          setPaymentLoading(false);
        }
      );

      razorpay.open();
    } catch (error: any) {
      console.error(
        "Subscription payment error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to start payment"
      );

      setPaymentLoading(false);
    }
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />

          <p className="text-gray-600">
            Loading subscription...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Crown className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h1>

          <p className="mt-3 text-gray-600 text-lg">
            Apply for more internships with a plan that
            fits your needs.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm">
            <CreditCard className="w-4 h-4" />

            <span>
              Paid subscriptions are available only from
              <strong> 10:00 AM to 11:00 AM IST</strong>.
            </span>
          </div>
        </div>

        {/* =================================================
            CURRENT PLAN
            ================================================= */}

        {subscription && (
          <div
            id="current-plan"
            className="mb-10 bg-white rounded-2xl shadow-md border p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />

                  <h2 className="text-xl font-bold text-gray-900">
                    Current Plan
                  </h2>
                </div>

                <p className="text-2xl font-bold text-blue-600 capitalize">
                  {subscription.plan}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">

                <div>
                  <p className="text-gray-500">
                    Monthly Limit
                  </p>

                  <p className="font-semibold text-gray-900">
                    {subscription.monthlyApplicationLimit ===
                    null
                      ? "Unlimited"
                      : subscription.monthlyApplicationLimit}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Used
                  </p>

                  <p className="font-semibold text-gray-900">
                    {subscription.applicationsUsed}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Price
                  </p>

                  <p className="font-semibold text-gray-900">
                    ₹{subscription.price}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Valid Until
                  </p>

                  <p className="font-semibold text-gray-900">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* =================================================
            PLAN CARDS
            ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {plans.map((plan) => {
            const isCurrentPlan =
              subscription?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border shadow-md p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-200"
                }`}
              >

                {/* Popular badge */}

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan icon */}

                <div className="mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.id === "gold"
                        ? "bg-yellow-100"
                        : plan.id === "silver"
                        ? "bg-gray-100"
                        : plan.id === "bronze"
                        ? "bg-orange-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <Crown
                      className={`w-6 h-6 ${
                        plan.id === "gold"
                          ? "text-yellow-600"
                          : plan.id === "silver"
                          ? "text-gray-600"
                          : plan.id === "bronze"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Plan name */}

                <h2 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h2>

                {/* Description */}

                <p className="text-gray-500 text-sm mt-2 min-h-[42px]">
                  {plan.description}
                </p>

                {/* Price */}

                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>

                  {plan.price > 0 && (
                    <span className="text-gray-500">
                      /month
                    </span>
                  )}
                </div>

                {/* Features */}

                <div className="mt-6 flex-1">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />

                    <span className="text-gray-700">
                      {plan.applications}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />

                    <span className="text-gray-700">
                      Access to internship applications
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />

                    <span className="text-gray-700">
                      Secure Razorpay payment
                    </span>
                  </div>
                </div>

                {/* Button */}

                <button
                  disabled={
                    isCurrentPlan ||
                    paymentLoading
                  }
                  onClick={() =>
                    handleSubscribe(plan.id)
                  }
                  className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                    isCurrentPlan
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : plan.id === "gold"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } ${
                    paymentLoading
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />

                      Processing...
                    </span>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : plan.id === "free" ? (
                    "Free Plan"
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* =================================================
            PAYMENT INFORMATION
            ================================================= */}

        <div className="mt-12 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-7 h-7 text-green-600 shrink-0" />

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Secure Subscription Payment
              </h3>

              <p className="text-gray-600 mt-1">
                Payments are processed securely through
                Razorpay. Your subscription will be activated
                only after successful payment verification.
              </p>

              <p className="text-sm text-gray-500 mt-3">
                After a successful payment, you will receive
                your plan details and PDF invoice by email.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPage;