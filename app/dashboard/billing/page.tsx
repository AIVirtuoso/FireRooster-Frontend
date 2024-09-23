"use client";
import { BillingModal } from "@/components/billing/BillingModal";
import { SubEnum, PlanEnum } from "@/lib/constants";
import getStripe from "@/lib/get-stripe";
import accountService from "@/services/account";
import stripeService from "@/services/stripe";
import { Card, CardActions, CardContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";



export default function Page() {
  const [user, setUser] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubEnum>(SubEnum.Ember);

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
              <div className="title text-2xl font-bold mb-4">Ember</div>
              <div className="font-light mb-4">
                Only scanners from 1 state
                <br></br>
                Only scanners from 1 county
                <br></br>
                Up to 10 scanners
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$800</span>
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
              {user?.usertype?.tier == "Ember" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  // onClick={() => handleCheckoutSubscription(SILVER_ID)}
                  onClick={() => handleOpenModal(SubEnum.Ember)}
                >
                  Choose Scanners
                </button>
              )}

              {user?.usertype?.tier != "Ember" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleCheckoutSubscription(PlanEnum.Ember)}
                >
                  Subscribe
                </button>
              )}
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
              <div className="title text-2xl font-bold mb-4">Blaze</div>
              <div className="font-light mb-8">
                Only scanners from 1 state
                <br></br>
                Scanners from 2 counties
                <br></br>
                Up to 20 scanners(10 scanners / county)
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$1500</span>
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
              {user?.usertype?.tier == "Blaze" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleOpenModal(SubEnum.Blaze)}
                >
                  Choose Scanners
                </button>
              )}

              {user?.usertype?.tier != "Blaze" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleCheckoutSubscription(PlanEnum.Blaze)}
                >
                  Subscribe
                </button>
              )}
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
              <div className="title text-2xl font-bold mb-4">Inferno</div>
              <div className="font-light mb-8">
                Scanners from 2 states
                <br></br>
                Scanners from 3 counties
                <br></br>
                Up to 30 scanners (10 scanners / county)
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$2000</span>
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
              {user?.usertype?.tier == "Inferno" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  // onClick={() => handleCheckoutSubscription(SILVER_ID)}
                  onClick={() => handleOpenModal(SubEnum.Inferno)}
                >
                  Choose Scanners
                </button>
              )}

              {user?.usertype?.tier != "Inferno" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleCheckoutSubscription(PlanEnum.Inferno)}
                >
                  Subscribe
                </button>
              )}
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
              <div className="title text-2xl font-bold mb-4">WildFire</div>
              <div className="font-light mb-8">
                Scanners from 2 states
                <br></br>
                Scanners from 4 counties
                <br></br>
                Up to 50 scanners
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$3000</span>
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
              {user?.usertype?.tier == "WildFire" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  // onClick={() => handleCheckoutSubscription(SILVER_ID)}
                  onClick={() => handleOpenModal(SubEnum.WildFire)}
                >
                  Choose Scanners
                </button>
              )}

              {user?.usertype?.tier != "WildFire" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleCheckoutSubscription(PlanEnum.WildFire)}
                >
                  Subscribe
                </button>
              )}
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
              <div className="title text-2xl font-bold mb-4">Partner Plus</div>
              <div className="font-light mb-8">
                Scanners from 2 states
                <br></br>
                Scanners from 5 counties
                <br></br>
                Up to 80 scanners
              </div>
              <div className="price mt-auto font-light">
                <span className="text-4xl font-bold">$3800</span>
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
              {user?.usertype?.tier == "Partner" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleOpenModal(SubEnum.Partner)}
                >
                  Choose Scanners
                </button>
              )}

              {user?.usertype?.tier != "Partner" && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 rounded-sm py-2"
                  onClick={() => handleCheckoutSubscription(PlanEnum.Partner)}
                >
                  Subscribe
                </button>
              )}
            </CardActions>
          </Card>


          {
            user?.usertype?.tier == "Administrator" && (
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
                  <div className="title text-2xl font-bold mb-1">Administrator</div>
                  <div className="title text-xl font-bold mb-4">(Only visiable for Administrator)</div>
                  <div className="font-light mb-8">
                    All states
                    <br></br>
                    All counties
                    <br></br>
                    All scanners
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
                    onClick={() => handleOpenModal(SubEnum.ADMINISTRATOR)}
                  >
                    Choose Scanners
                  </button>
                </CardActions>
              </Card>
            )
          }
        </div>
      </div>

      {openModal && <BillingModal handleClose={() => setOpenModal(false)} type={selectedSub} />}
    </>
  );
}
