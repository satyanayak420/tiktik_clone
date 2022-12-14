import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import { GoVerified } from "react-icons/go";
import { Video } from "../types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { BASE_URL } from "../utils";
import { setDefaultResultOrder } from "dns";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import useAuthStore from "../store/authStore";
import swal from "sweetalert";

interface IProps {
  post: Video;
}
// const VideoCard = ({ post }: IProps) => {
//   return <div>VideoCard</div>;
// };

// export default VideoCard;
const VideoCard: NextPage<IProps> = ({ post }) => {
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const router = useRouter();
  const { userProfile }: any = useAuthStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  const handleDelete = async (id: string) => {
    if (userProfile._id === post.postedBy._id) {
      await axios
        .delete(`${BASE_URL}/api/post/${id}`)
        .then((response) => console.log(response))
        .catch((error) => {
          console.log(error.response.data.message);
        });
    } else {
      swal("You are not allowed to delete other user's post");
    }
  };

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 font-semibold cursor-pointer rounded">
          <div className="md:w-16 md:h-16 w-10 h-10">
            <Link href={`/profile/${post.postedBy._id}`}>
              <>
                <Image
                  src={post.postedBy.image}
                  alt="profile photo"
                  width={62}
                  height={62}
                  className="rounded-full"
                />
              </>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div className="flex items-center gap-2">
                <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                  {post.postedBy.userName}{" "}
                  <GoVerified className="text-blue-400 text-md" />
                </p>
                <p className="capitalize font-md text-xs text-gray-500 hidden md:block">
                  {post.postedBy.userName}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:ml-20 flex gap-4 relative flex-col">
        <p className="text-md font-semibold text-black">{post.caption}</p>

        <div
          className="rounded-3xl"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Link href={`/detail/${post._id}`}>
            <video
              ref={videoRef}
              src={post.video.asset.url}
              loop
              className="lg:w-[600px] w-[200px] h-[300px] md:h-[400px] lg:h-[530px] rounded-2xl cursor-pointer bg-gray-100"
            />
          </Link>

          <button
            className="absolute   top-14 right-24 md:right-20 text-xl p-2 hover:rounded-full hover:bg-gray-200"
            onClick={() => handleDelete(post._id)}
          >
            <MdDelete className="text-2xl text-gray-400 cursor-pointer" />
          </button>

          {isHover && (
            <div>
              <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px]  p-3">
                {playing ? (
                  <button onClick={onVideoPress}>
                    <BsFillPauseFill className="text-black text-2xl lg:text-4xl" />
                  </button>
                ) : (
                  <button onClick={onVideoPress}>
                    <BsFillPlayFill className="text-black text-2xl lg:text-4xl" />
                  </button>
                )}
                {isVideoMuted ? (
                  <button
                    onClick={
                      () => setIsVideoMuted(false)
                      //   videoRef?.current?.defaultMuted()
                      //   videoRef?.current?.muted()
                    }
                  >
                    <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
                  </button>
                ) : (
                  <button onClick={() => setIsVideoMuted(true)}>
                    <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
