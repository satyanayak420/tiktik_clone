import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import useAuthStore from "../store/authStore";
import { IUser } from "../types";
import { createOrGetUser } from "../utils";
import Logo from "../utils/tiktik-logo.png";
import { FaVideo } from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState<IUser | null>();
  const [searchValue, setSearchValue] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { userProfile, addUser, removeUser } = useAuthStore();

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchValue) {
      router.push(`/search/${searchValue}`);
    }
  };
  const handleSearchSm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShow(false);

    if (searchValue) {
      router.push(`/search/${searchValue}`);
    }
  };
  // const searchbarAppear = show ? "bg-gray-800" : "";
  const showLogo = show ? "text-[#F51997] text-4xl md:hidden" : "hidden";
  const showLogo1 = show ? "hidden md:block" : "block";
  const showUploadButton = show ? "hidden  md:flex md:items-center" : "block";
  const showLogoutOption = show ? "hidden sm:block" : "block";

  return (
    <div
      className={`w-full relative flex justify-between items-center border-b-2 border-gray-200 py-2 px-4 items-center`}
    >
      <Link href="/">
        <FaVideo className={`${showLogo}`} />
      </Link>
      <Link href="/">
        <div
          className={`w-[100px] md:w-[129px] md:h-[30px] h-[38px] ${showLogo1}`}
        >
          <Image className="cursor-pointer" src={Logo} alt="logo" />
        </div>
      </Link>

      {userProfile ? (
        <div>
          <div className="relative hidden md:block flex items-center justify-center">
            <form
              onSubmit={handleSearch}
              className="absolute md:static top-10 -left-20 bg-white"
            >
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full  md:top-0 w-[50px]"
                placeholder="Search accounts and videos"
              />
              <button
                onClick={handleSearch}
                className="absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400 xs:mr-6"
              >
                <BiSearch />
              </button>
            </form>
          </div>
          {!show && (
            <button
              className="pl-1 text-2xl text-gray-400 md:hidden mt-1"
              onClick={() => setShow((prev) => !prev)}
            >
              <BiSearch />
            </button>
          )}

          {show && (
            <div className="flex justify-between absolute left-4 top-0 mr-4">
              <form
                onSubmit={handleSearch}
                className="absolute md:static top-1 left-10 bg-white md:hidden"
              >
                <button
                  onClick={handleSearchSm}
                  className="absolute top-4  pl-4 text-2xl text-gray-400"
                >
                  <BiSearch />
                </button>
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="bg-primary py-3 pl-12 pr-8   md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full  md:top-0"
                  placeholder="Search accounts and videos"
                />
                <button
                  className="absolute right-3 top-4 text-2xl text-black font-thin"
                  onClick={() => setShow(false)}
                >
                  <TiDelete />
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}

      {user ? (
        <div className="flex gap-5 md:gap-10">
          <Link href="/upload">
            <button
              className={`border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2 mt-2 ${showUploadButton}`}
            >
              <IoMdAdd className="text-xl" />{" "}
              <span className="hidden md:block">Upload </span>
            </button>
          </Link>
          {user.image && (
            <Link href={`/profile/${user._id}`}>
              <div>
                <Image
                  className={`rounded-full cursor-pointer ${showLogoutOption}`}
                  src={user.image}
                  alt="user"
                  width={40}
                  height={40}
                />
              </div>
            </Link>
          )}
          <button
            type="button"
            className={`border-2 p-2 rounded-full cursor-pointer outline-none shadow-md ${showLogoutOption}`}
            onClick={() => {
              googleLogout();
              removeUser();
            }}
          >
            <AiOutlineLogout color="red" fontSize={21} />
          </button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={(response) => createOrGetUser(response, addUser)}
          onError={() => console.log("Login Failed")}
        />
      )}
    </div>
  );
};

export default Navbar;
