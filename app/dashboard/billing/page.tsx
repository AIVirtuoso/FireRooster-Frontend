"use client";
import { BillingModal } from "@/components/billing/BillingModal";
import { SubEnum } from "@/lib/constants";
import getStripe from "@/lib/get-stripe";
import accountService from "@/services/account";
import stripeService from "@/services/stripe";
import { Card, CardActions, CardContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";

const SILVER_ID = "price_1PV6UpAZfjTlvHBorhDSu5N7";
const GOLD_ID = "price_1PV6VgAZfjTlvHBo6XIjxJUM";
const PLATINUM_ID = "price_1PV6WHAZfjTlvHBoMdUxAcCJ";

export default function Page() {
  const [user, setUser] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubEnum>(SubEnum.SILVER);

  useEffect(() => {
    async function getUser() {
      const response = await accountService.getProfile();
      console.log(response);
      setUser(response)
    }

    getUser();
  }, []);

  const handleCheckoutSubscription = async (stripeSubId: string) => {
    console.log(user.user.email);
    const data = {
      email: user.user.email,
      plan_id: stripeSubId,
    };
    const checkout_session_id = await stripeService.checkout(data);
    if (checkout_session_id) {
      // Open the URL in a new tab
      window.open(checkout_session_id);
    } else {
      console.error('No URL found in the response');
    }    
  };

  const handleOpenModal = (type: SubEnum) => {
    setSelectedSub(type);
    setOpenModal(true);
  }

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
                <span className="text-4xl font-bold">$100</span>
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
                // onClick={() => handleCheckoutSubscription(SILVER_ID)}
                onClick={() => handleOpenModal(SubEnum.SILVER)}
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
                <span className="text-4xl font-bold">$300</span>
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
                // onClick={() => handleCheckoutSubscription(GOLD_ID)}
                onClick={() => handleOpenModal(SubEnum.GOLD)}
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
                <span className="text-4xl font-bold">$500</span>
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
                // onClick={() => handleCheckoutSubscription(PLATINUM_ID)}
                onClick={() => handleOpenModal(SubEnum.PLATINUM)}
              >
                Subscribe
              </button>
            </CardActions>
          </Card>
        </div>
      </div>

      { openModal && <BillingModal handleClose={() => setOpenModal(false)} type={selectedSub} /> }
    </>
  );
}
