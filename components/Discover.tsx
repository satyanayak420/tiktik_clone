import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { topics } from "../utils/constants";

const Discover = () => {
  const router = useRouter();
  const { topic } = router.query;
  const activeTopicStyle =
    "xl:border-[#F51997] hover:bg-primary xl:border-gray-300 px-3 py-2 rounded xl:rounded-full  flex items-center cursor-pointer justify-center gap-2 text-[#F51997]";
  const topicStyle =
    "xl:border-2 hover:bg-primary xl:border-gray-300 px-3 py-2 rounded xl:rounded-full  flex items-center cursor-pointer justify-center gap-2 text-black";
  return (
    <div className="xl:border-b-2 xl:border-gray-200 pb-6">
      <p className="text-gray-500 font-semibold m-3 mt-4 hidden xl:block">
        Popular Topics
      </p>
      <div className="flex gap-3 flex-wrap">
        {topics.map((topicItem) => (
          <Link href={`/?topic=${topicItem.name}`} key={topicItem.name}>
            <div
              className={
                topic === topicItem.name ? activeTopicStyle : topicStyle
              }
            >
              <span className="font-bold text-2xl xl:text-md">
                {topicItem.icon}
              </span>{" "}
              <span className="font-medium text-md hidden xl:block capitalize">
                {topicItem.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Discover;
