"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const imgCuteBaoIllustration = "/thankyou.png";

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get order number from URL or generate a default one
  const orderNumber = useMemo(() => {
    const orderParam = searchParams.get("order");
    return orderParam || "#12345";
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Main Content Container */}
      <div className="max-w-md w-full flex flex-col items-center gap-5 py-8">
        {/* Cute Bao Illustration */}
        <div className="relative w-48 h-48">
          <Image
            src={imgCuteBaoIllustration}
            alt="Cute Bao"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Thank You Heading */}
        <h1 className="text-[30px] font-bold text-[#333333] text-center leading-9">
          Thank You!
        </h1>

        {/* Description */}
        <p className="text-lg text-[#333333] text-center leading-7">
          Your Taiwanese breakfast is on its way!
        </p>

        {/* Order Info Card */}
        <div className="w-full bg-[#f8f3ec] rounded-2xl p-6 flex flex-col gap-4">
          {/* Order Number */}
          <div className="flex items-center justify-between">
            <span className="text-base text-[#666666] leading-6">
              Order Number
            </span>
            <span className="text-base font-semibold text-[#333333] leading-6">
              {orderNumber}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-[#f2e6d9]" />

          {/* Pickup Time */}
          <div className="flex items-center justify-between">
            <span className="text-base text-[#666666] leading-6">
              Pickup Time
            </span>
            <span className="text-lg font-bold text-[#ed9c2a] leading-7">
              15-20 min
            </span>
          </div>
        </div>
      </div>

      {/* Back to Home Button - Fixed at Bottom */}
      <div className="w-full max-w-md px-4 pb-8 mt-auto">
        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#ed9c2a] text-white font-bold text-base py-3 px-6 rounded-full hover:bg-[#d88a24] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
