import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { GoVerified } from "react-icons/go";
import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";

interface IProps {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const profile = ({ data }: IProps) => {
  const [showUserVideo, setShowUserVideos] = useState(true);
  const [videoList, setVideoList] = useState<Video[]>([]);

  const { user, userLikedVideos, userVideos } = data;

  useEffect(() => {
    if (showUserVideo) {
      setVideoList(userVideos);
    } else {
      setVideoList(userLikedVideos);
    }
  }, [showUserVideo, userLikedVideos, userVideos]);
  const videos = showUserVideo ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideo ? "border-b-2 border-black" : "text-gray-400";

  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 bg-white w-full">
        <div className="w-16 md:w-32 md:h-32 h-8">
          <Image
            src={user.image}
            width={120}
            height={120}
            alt="user profile"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="md:text-2xl tracking-wider flex gap-1 items-center  jsutify-center text-md font-bold text-primary lowercase">
            {user.userName.replaceAll(" ", "")}{" "}
            <GoVerified className="text-blue-400" />
          </p>
          <p className="text-gray-400 capitalize text-xs md:text-xl">
            {user.userName}
          </p>
        </div>
      </div>
      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p
            className={` text-xl font-semibold cursor-pointer mt-2 ${videos}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={` text-xl font-semibold cursor-pointer mt-2 ${liked}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>
        <div className="flex flex-wrap gap-6  md:justify-start">
          {videoList.length > 0 ? (
            videoList?.map((post: Video, idx: number) => (
              <VideoCard post={post} key={idx} />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideo ? "" : "Liked"} Videos Yet!!`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default profile;

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/profile/${id}`);
  return {
    props: {
      data,
    },
  };
};
