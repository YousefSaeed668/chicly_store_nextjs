"use client";
import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const { user } = useUser();
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const cart = useCart();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-10 py-2 px-10 gap-2 flex justify-between items-center bg-white max-sm:px-2">
      <Link href={"/"}>
        <Image src="/logo.png" alt="logo" width={130} height={100} />
      </Link>
      <div className="flex gap-4 text-base-bold max-lg:hidden">
        <Link
          href="/"
          className={`hover:text-red-1 ${pathname === "/" && "text-red-1"}`}
        >
          Home
        </Link>
        <Link
          href={user ? "/wishlist" : "/sign-in"}
          className={`hover:text-red-1 ${
            pathname === "/wishlist" && "text-red-1"
          }`}
        >
          WishList
        </Link>
        <Link
          href={user ? "/orders" : "/sign-in"}
          className={`hover:text-red-1 ${
            pathname === "/orders" && "text-red-1"
          }`}
        >
          Orders
        </Link>
      </div>
      <div className="flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-lg">
        <input
          className="outline-none max-[470px]:max-w-[100px] sm:max-w-[200px]"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query !== "") {
              router.push(`/search/${query}`);
            }
          }}
        />
        <button
          disabled={query === ""}
          onClick={() => {
            if (query !== "") {
              router.push(`/search/${query}`);
            }
          }}
        >
          <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
        </button>
      </div>
      <div className="flex items-center gap-3 relative">
        <Link
          href="/cart"
          className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white transition-all max-md:hidden"
        >
          <ShoppingCart />
          <p className="text-bass-bold">Cart ({cart.cartItems.length})</p>
        </Link>

        <Menu
          className="cursor-pointer lg:hidden"
          onClick={() => setDropDownMenu(!dropDownMenu)}
        />

        {dropDownMenu && (
          <div className="absolute flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold top-12 right-5 lg:hidden">
            <Link href="/" className={`hover:text-red-1`}>
              Home
            </Link>
            <Link
              href={user ? "/wishlist" : "/sign-in"}
              className="hover:text-red-1"
            >
              WishList
            </Link>
            <Link
              href={user ? "/orders" : "/sign-in"}
              className="hover:text-red-1"
            >
              Orders
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white transition-all"
            >
              <ShoppingCart />
              <p className="text-bass-bold">Cart ({cart.cartItems.length})</p>
            </Link>
          </div>
        )}
        {user ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <CircleUserRound />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
