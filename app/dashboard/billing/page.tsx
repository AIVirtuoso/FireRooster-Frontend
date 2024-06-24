"use client";
import getStripe from "@/lib/get-stripe";
import accountService from "@/services/account";
import stripeService from "@/services/stripe";
import { Card, CardActions, CardContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";

const SILVER_ID = "price_1P0KRSLk5QNf8hoZ3n8XAd2V";
const GOLD_ID = "price_1P0KRCLk5QNf8hoZXWozxZEK";

export default function Page() {
  const [user, setUser] = useState();
  useEffect(() => {
    async function getUser() {
      const response = await accountService.getProfile();
      // console.log(response);
      // need subscribed flag to handle the page
    }

    getUser();
  }, []);

  const handleCheckoutSubscription = async (stripeSubId: string) => {
    const data = {
      email: "test4@email.com",
      plan_id: stripeSubId,
    };
    const { checkout_session_id } = await stripeService.checkout(data);

    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: checkout_session_id });
  };

  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Billing</div>
      </div>
      <Divider />
      <div className="font-semibold text-xl text-coolGray-800 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          <Card
            className="sm:me-4 bg-gray-900 text-white"
            sx={{
              backgroundColor: "rgb(21,24,39)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
              padding: "20px",
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              <div className="title text-2xl font-bold mb-4">Silver</div>
              <div className="font-light mb-4">Some description</div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$12</span>
                /month
              </div>
            </CardContent>
            <CardActions
              sx={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
              }}
            >
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                onClick={() => handleCheckoutSubscription(SILVER_ID)}
              >
                Subscribe
              </button>
            </CardActions>
          </Card>
          
          <Card
            className="sm:me-4 bg-gray-900 text-white"
            variant="outlined"
            sx={{
              backgroundColor: "rgb(21,24,39)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
              padding: "20px",
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              <div className="title text-2xl font-bold mb-4">Gold</div>
              <div className="font-light mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                laboriosam error tenetur? Accusamus ullam quisquam mollitia
                suscipit quibusdam pariatur maxime.
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$24</span>
                /month
              </div>
            </CardContent>
            <CardActions
              sx={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
              }}
            >
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                onClick={() => handleCheckoutSubscription(GOLD_ID)}
              >
                Subscribe
              </button>
            </CardActions>
          </Card>

          <Card
            className="sm:me-4 bg-gray-900 text-white"
            variant="outlined"
            sx={{
              backgroundColor: "rgb(21,24,39)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
              padding: "20px",
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              <div className="title text-2xl font-bold mb-4">Platinum</div>
              <div className="font-light mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                laboriosam error tenetur? Accusamus ullam quisquam mollitia
                suscipit quibusdam pariatur maxime.
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$50</span>
                /month
              </div>
            </CardContent>
            <CardActions
              sx={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
              }}
            >
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                onClick={() => handleCheckoutSubscription(GOLD_ID)}
              >
                Subscribe
              </button>
            </CardActions>
          </Card>
        </div>
      </div>
    </>
  );
}
