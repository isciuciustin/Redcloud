import React, { useRef, useEffect } from "react";
import Axios from 'axios';


export default function Paypal({type, user, price}) {
  const paypal = useRef();
  const post = () => {
    Axios.post(`http://localhost:3001/api/buy`, { user: user, type : type });
  }
  useEffect(() => {
    window.paypal.Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: type,
                amount: {
                  currency_code: "USD",
                  value: price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order.purchase_units[0].description);
          post()
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}