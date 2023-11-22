import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../../redux/cart/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ _id: productId }));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity({ _id: item._id }));
    } else {
      dispatch(removeFromCart({ _id: item._id }));
    }
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(increaseQuantity({ _id: item._id }));
  };

  const isCartEmpty = cart.length === 0;

  return (
    <div>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                Your Cart
              </h1>
            </header>

            <div className="mt-8">
              {isCartEmpty ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item._id} className="flex items-center gap-4">
                      <img
                        src={item.imageUrls && item.imageUrls[0]}
                        alt=""
                        className="h-16 w-16 rounded object-cover"
                      />

                      <div>
                        <h3 className="text-sm text-gray-900">{item.name}</h3>

                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dt className="inline">Description: </dt>
                            <dd className="inline">{item.description}</dd>
                          </div>

                          <div>
                            <dt className="inline">Price: </dt>
                            <dd className="inline">{item.price}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="flex flex-1 items-center justify-end gap-2">
                        <form>
                          <label
                            htmlFor={`Qty-${item._id}`}
                            className="sr-only"
                          >
                            {" "}
                            Quantity{" "}
                          </label>

                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(item)}
                              className="h-8 px-2 border border-r-0 border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              id={`Qty-${item._id}`}
                              className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                              readOnly
                            />

                            <button
                              type="button"
                              onClick={() => handleIncreaseQuantity(item)}
                              className="h-8 px-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none"
                            >
                              +
                            </button>
                          </div>
                        </form>

                        <button
                          className="text-gray-600 transition hover:text-red-600"
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          <span className="sr-only">Remove item</span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!isCartEmpty && (
                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <dt>Subtotal</dt>
                        <dd>
                          ${" "}
                          {cart
                            .reduce(
                              (total, item) =>
                                total + item.quantity * item.price,
                              0
                            )
                            .toFixed(2)}
                        </dd>
                      </div>
                    </dl>

                    <div className="flex justify-end">
                      <Link to={isCartEmpty ? "/" : "/checkout"}>
                        <button
                          disabled={isCartEmpty}
                          className={`block rounded ${
                            isCartEmpty ? "bg-gray-300" : "bg-gray-700"
                          } px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600`}
                        >
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
