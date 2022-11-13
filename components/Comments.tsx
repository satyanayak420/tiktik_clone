import React, { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import useAuthStore from "../store/authStore";
import NoResults from "./NoResults";
import { IUser } from "../types";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../utils";

interface IProps {
  isPostingComment: Boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  handleDelete: (key: string) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const Comments = ({
  comment,
  isPostingComment,
  comments,
  addComment,
  handleDelete,
  setComment,
}: IProps) => {
  const { userProfile, allUsers } = useAuthStore();

  console.log(comments);

  return (
    <div className="border-t-2 border-gray-200 pt-4 px-10 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]">
      <div className="overflow-scroll lg:h-[475px]">
        {comments?.length ? (
          comments.map((comment, idx) => (
            <>
              {allUsers.map(
                (user: IUser) =>
                  user._id ===
                    (comment.postedBy._id || comment.postedBy._ref) && (
                    <div className="flex flex-col p-2 items-start" key={idx}>
                      <Link href={`/profile/${user._id}`}>
                        <div className="flex item-start gap-3">
                          <div className="w-8 h-8">
                            <Image
                              src={user.image}
                              width={34}
                              height={34}
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
                      <div className="mt-4 flex justify-between w-full">
                        <p>{comment.comment}</p>
                        <p
                          className="text-2xl cursor-pointer"
                          onClick={() => handleDelete(comment._key)}
                        >
                          <MdDelete />
                        </p>
                      </div>
                    </div>
                  )
              )}
            </>
          ))
        ) : (
          <NoResults text="No comments yet! Be the first one to add a comment." />
        )}
      </div>
      {userProfile && (
        <div className="absolute bottom-0 left-0 pb-6 px-2 md:px-10 ">
          <form className="flex gap-4 mt-8" onSubmit={addComment}>
            <input
              type="text"
              value={comment}
              className="w-[250px] md:w-[750px] lg:w-[350px] font-medium border-2 py-4 px-6 focus:outline-none text-md bg-primary border-gray-100 focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comment..."
            />
            <button
              className="text-md bg-[#F51997] text-white w-[150px] rounded-lg"
              onClick={() => {}}
            >
              {isPostingComment ? "Commenting" : "Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Comments;
