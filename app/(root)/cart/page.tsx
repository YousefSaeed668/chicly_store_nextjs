"use client";
import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Cart = () => {
  const { user } = useUser();
  const router = useRouter();
  const cart = useCart();
  console.log(cart);
  const subTotal = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(subTotal.toFixed(2));
  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };
  const handleCheckout = async () => {
    try {
      if (!user) {
        router.push("/sign-in");
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
          method: "POST",
          body: JSON.stringify({ cartItems: cart.cartItems, customer }),
        });
        const data = await res.json();
        window.location.href = data.url;
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  return (
    <div className="flex gap-20 py-16 px-10  max-lg:flex-col">
      <div className="w-2/3 max-lg:w-full">
        <h2 className="text-heading3-bold">Shopping Cart</h2>
        <hr className="my-6" />
        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No Items In Cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="flex max-sm:flex-col max-sm:gap-3 max-sm:items-start hover:bg-grey-1 px-6 py-5 w-full justify-between items-center select-none"
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    alt="product"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex flex-col gap-3 ml-4  min-w-32">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">${cartItem.item.price}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <MinusCircle
                    className={` cursor-pointer ${
                      cartItem.quantity === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:text-red-1"
                    }`}
                    onClick={() =>
                      cartItem.quantity !== 1 &&
                      cart.decreaseQuantity(cartItem.item._id)
                    }
                  />
                  <p className="text-body-bold select-none">
                    {cartItem.quantity}
                  </p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>
                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>
            ( {cart.cartItems.length}{" "}
            {cart.cartItems.length > 1 ? "items" : "item"})
          </span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>${totalRounded}</span>
        </div>
        <button
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
