import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";
import { topicPostsQuery } from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { topic }: any = req.query;
    const videosByTopicQuery = topicPostsQuery(topic);

    const videosByTopic = await client.fetch(videosByTopicQuery);
    res.status(200).json(videosByTopic);
  }
}
