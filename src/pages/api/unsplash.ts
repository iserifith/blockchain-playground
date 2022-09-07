import { NextApiResponse, NextApiRequest } from "next";
import { random } from "radash";
import { createApi } from "unsplash-js";
const serverApi = createApi({
  accessKey: process.env.UNSLPASH_API_KEY || "",
});

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const word = _req.query.word as string;
  const r = random(0, 29);
  let data;
  let picked;

  if (r > 95) {
    data = await serverApi.photos.getRandom({
      count: 1,
    });

    picked = data.response;
  } else {
    data = await serverApi.search.getPhotos({
      query: word,
      perPage: 30,
    });
    picked = data.response?.results[r];
  }

  return res.status(200).json({
    word,
    picked,
    r,
  });
}
