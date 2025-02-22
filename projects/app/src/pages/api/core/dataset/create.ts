import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoDataset } from '@fastgpt/core/dataset/schema';
import { authUser } from '@fastgpt/support/user/auth';
import type { CreateDatasetParams } from '@/global/core/api/datasetReq.d';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { name, tags, avatar, vectorModel, parentId, type } = req.body as CreateDatasetParams;

    // 凭证校验
    const { userId } = await authUser({ req, authToken: true });

    const { _id } = await MongoDataset.create({
      name,
      userId,
      tags,
      vectorModel,
      avatar,
      parentId: parentId || null,
      type
    });

    jsonRes(res, { data: _id });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
