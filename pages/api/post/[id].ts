import { NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { client } from "../../../utils/client";
import { postDetailQuery } from "../../../utils/queries";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "GET") {
//       const { id} = req.query
//     const query = postDetailQuery(id);

//       const data = client.fetch(query);

//
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const query = postDetailQuery(id);

    const data = await client.fetch(query);

    res.status(200).json(data[0]);
  } else if (req.method === "PUT") {
    const { comment, userId, key, edit, newComment } = req.body;
    const { id }: any = req.query;
    const data = !key
      ? await client
          .patch(id)
          .setIfMissing({ comments: [] })
          .insert("after", "comments[-1]", [
            {
              comment,
              _key: uuid(),
              postedBy: { _type: "postedBy", _ref: userId },
            },
          ])
          .commit()
      : edit
      ? await client
          .patch(id)
          .insert("replace", `comments[_key=="${key}"]`, [
            {
              comment,
              _key: key,
              postedBy: { _type: "postedBy", _ref: userId },
            },
          ])
          .commit()
      : await client
          .patch(id)
          .unset([`comments[_key=="${key}"]`])
          .commit();

    res.status(200).json(data);
  }
}
