import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GoVerified } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BASE_URL } from "../../utils";
import useAuthStore from "../../store/authStore";
import { Video } from "../../types";
import axios from "axios";
import LikeButton from "../../components/LikeButton";
import Comments from "../../components/Comments";
import { uuid } from "uuidv4";
import { IComment } from "../../components/Comments";

interface IProps {
  postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [edit, setEdit] = useState(false);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });
      setPost({ ...post, likes: data.likes });
    }
  };

  const addComent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userProfile && comment) {
      setIsPostingComment(true);
      const { data } = edit
        ? await axios.put(`${BASE_URL}/api/post/${post._id}`, {
            key: editKey,
            edit,
            comment,
            userId: userProfile._id,
          })
        : await axios.put(`${BASE_URL}/api/post/${post._id}`, {
            userId: userProfile._id,
            comment,
          });
      setPost({ ...post, comments: data.comments });
      setComment("");
      setEditKey("");
      setIsPostingComment(false);
    }
  };

  const handleCommentDelete = async (key: string) => {
    const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
      key,
    });
    setPost({ ...post, comments: data.comments });
  };

  const handleCommentEdit = async (comment: IComment, edit: boolean) => {
    setEdit(true);
    setComment(comment.comment);
    setEditKey(comment._key);

    // setPost({ ...post, comments: data.comments });
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const onVideoClick = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };
  useEffect(() => {
    if (post && videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [post, isVideoMuted]);

  return (
    <>
      {post && (
        <div className="flex w-full absolute left-0 top-0  bg-white flex-wrap lg:flex-nowrap">
          <div className="relative flex-2 w-full lg:w-9/12 flex justify-center items-center bg-black">
            {/* bg-blurred-img bg-no-repeat bg-cover bg-center */}
            <div className="opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
              <p className="cursor-pointer " onClick={() => router.back()}>
                <MdOutlineCancel className="text-white text-[35px] hover:opacity-90" />
              </p>
            </div>
            <div className="relative">
              <div className="lg:h-[100vh] h-[60vh]">
                <video
                  ref={videoRef}
                  loop
                  onClick={onVideoClick}
                  src={post?.video?.asset.url}
                  className=" h-full cursor-pointer"
                ></video>
              </div>
              <div className="absolute top-[45%] left-[45%] cursor-pointer">
                {!playing && (
                  <button>
                    <BsFillPlayFill
                      className="text-white text-6xl lg:text-8xl"
                      onClick={onVideoClick}
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
              {isVideoMuted ? (
                <HiVolumeOff
                  onClick={() => setIsVideoMuted(false)}
                  className="text-white text-2xl lg:text-4xl"
                />
              ) : (
                <HiVolumeUp
                  onClick={() => setIsVideoMuted(true)}
                  className="text-white text-2xl lg:text-4xl"
                />
              )}
            </div>
          </div>
          <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
            <div className="lg:mt-20 mt-10">
              <div className="flex gap-3 p-2 font-semibold cursor-pointer rounded">
                <div className=" ml-4 md:w-20 md:h-20 w-16 h-16">
                  <Link href={`/profile/${userProfile._id}`}>
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
                  <Link href={`/profile/${userProfile._id}`}>
                    <div className="flex  gap-2 flex-col ">
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
              <p className="px-10 text-lg font-semibold capitalize text-gray-600">
                {post.caption}
              </p>
              <div className="px-10 mt-10">
                {userProfile && (
                  <LikeButton
                    likes={post.likes}
                    handleLike={() => handleLike(true)}
                    handleDislike={() => handleLike(false)}
                  />
                )}
              </div>
              <Comments
                handleCommentEdit={handleCommentEdit}
                handleCommentDelete={handleCommentDelete}
                comment={comment}
                comments={post.comments}
                edit={edit}
                setComment={setComment}
                addComment={addComent}
                isPostingComment={isPostingComment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const res = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: res.data },
  };
};

export default Detail;
