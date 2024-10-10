"use client";
import { BillingModal } from "@/components/billing/BillingModal";
import { SubEnum, PlanEnum } from "@/lib/constants";
import getStripe from "@/lib/get-stripe";
import accountService from "@/services/account";
import stripeService from "@/services/stripe";
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
  const [user, setUser] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubEnum>(SubEnum.Ember);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function getUser() {
      const response = await accountService.getProfile();
      console.log(response);
      setUser(response);
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
      console.error("No URL found in the response");
    }
  };

  const handleOpenModal = (type: SubEnum) => {
    setSelectedSub(type);
    setOpenModal(true);
  };

  // Subscription plans data
  const plans = [
    {
      title: "Ember",
      description: (
        <>
          Only scanners from 1 state
          <br />
          Only scanners from 1 county
          <br />
          Up to 10 scanners
        </>
      ),
      price: "$800",
      per: "/month",
      tier: "Ember",
      planId: PlanEnum.Ember,
    },
    {
      title: "Blaze",
      description: (
        <>
          Only scanners from 1 state
          <br />
          Scanners from 2 counties
          <br />
          Up to 20 scanners (10 scanners / county)
        </>
      ),
      price: "$1500",
      per: "/month",
      tier: "Blaze",
      planId: PlanEnum.Blaze,
    },
    {
      title: "Inferno",
      description: (
        <>
          Scanners from 2 states
          <br />
          Scanners from 3 counties
          <br />
          Up to 30 scanners (10 scanners / county)
        </>
      ),
      price: "$2000",
      per: "/month",
      tier: "Inferno",
      planId: PlanEnum.Inferno,
    },
    {
      title: "WildFire",
      description: (
        <>
          Scanners from 2 states
          <br />
          Scanners from 4 counties
          <br />
          Up to 50 scanners
        </>
      ),
      price: "$3000",
      per: "/month",
      tier: "WildFire",
      planId: PlanEnum.WildFire,
    },
    {
      title: "Partner Plus",
      description: (
        <>
          Scanners from 2 states
          <br />
          Scanners from 5 counties
          <br />
          Up to 80 scanners
        </>
      ),
      price: "$3800",
      per: "/month",
      tier: "Partner",
      planId: PlanEnum.Partner,
    },
    // Administrator plan (if applicable)
    ...(user?.usertype?.tier === "Administrator"
      ? [
          {
            title: "Administrator",
            description: (
              <>
                All states
                <br />
                All counties
                <br />
                All scanners
              </>
            ),
            price: "",
            per: "",
            tier: "Administrator",
            planId: "", // No plan ID needed
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Billing</div>
      </div>
      <Divider />
      <div className="font-semibold text-xl text-coolGray-800 mt-6">
        <Grid container spacing={2}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.title}>
              <Card
                className="bg-gray-900 text-white"
                sx={{
                  backgroundColor: "rgb(21,24,39)",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {plan.title}
                  </Typography>
                  {plan.title === "Administrator" && (
                    <Typography
                      variant="subtitle1"
                      component="div"
                      gutterBottom
                    >
                      (Only visible for Administrator)
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>
                  {plan.price && (
                    <Typography variant="h4" sx={{ mt: "auto" }}>
                      {plan.price}
                      <Typography variant="body2" component="span">
                        {plan.per}
                      </Typography>
                    </Typography>
                  )}
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                  }}
                >
                  {user?.usertype?.tier === plan.tier ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(plan.tier as SubEnum)}
                      sx={{
                        backgroundColor: "gray",
                        "&:hover": { backgroundColor: "darkgray" },
                      }}
                    >
                      Choose Scanners
                    </Button>
                  ) : (
                    plan.planId && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleCheckoutSubscription(plan.planId)
                        }
                        sx={{
                          backgroundColor: "gray",
                          "&:hover": { backgroundColor: "darkgray" },
                        }}
                      >
                        Subscribe
                      </Button>
                    )
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {openModal && (
        <BillingModal
          handleClose={() => setOpenModal(false)}
          type={selectedSub}
        />
      )}
    </>
  );
}
