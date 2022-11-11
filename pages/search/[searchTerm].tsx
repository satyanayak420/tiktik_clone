import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { GoVerified } from "react-icons/go";
import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";
import { useRouter } from "next/router";
import useAuthStore from "../../store/authStore";

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccounts, setIsAccounts] = useState(false);
  const router = useRouter();
  const { allUsers } = useAuthStore();
  const { searchTerm }: any = router.query;
  const searchedAccounts = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const {} = useAuthStore();
  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p
          className={` text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
          onClick={() => setIsAccounts(true)}
        >
          Accounts
        </p>
        <p
          className={` text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
          onClick={() => setIsAccounts(false)}
        >
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div>
          <div className="md:mt-16">
            {searchedAccounts.length > 0 ? (
              searchedAccounts.map((user: IUser, idx: number) => (
                <Link href={`/profile/${user._id}`} key={idx}>
                  <div className="flex item-start gap-3 mb-8 p-2 border-b-2 border-gray-200 cursor-pointer font-semibold rounded">
                    <div>
                      <Image
                        src={user.image}
                        width={50}
                        height={50}
                        alt="user profile"
                        className="rounded-full"
                      />
                    </div>
                    <div className="hidden xl:block">
                      <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                        {user.userName.replaceAll(" ", "")}{" "}
                        <GoVerified className="text-blue-400" />
                      </p>
                      <p className="text-gray-400 capitalize text-xs">
                        {user.userName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <NoResults
                text={`No accounts found with the name ${searchTerm} `}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            <div>
              {videos.map((video: Video, idx: number) => (
                <VideoCard post={video} key={idx} />
              ))}
            </div>
          ) : (
            <NoResults text={`No video results for "${searchTerm}" `} />
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const response = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);
  return {
    props: {
      videos: response.data,
    },
  };
};
