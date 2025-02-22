import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase } from '@/service/mongo';
import { authUser } from '@fastgpt/support/user/auth';
import { getVectorModel } from '@/service/core/ai/model';
import { MongoDataset } from '@fastgpt/core/dataset/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { id } = req.query as {
      id: string;
    };

    if (!id) {
      throw new Error('缺少参数');
    }

    // 凭证校验
    const { userId } = await authUser({ req, authToken: true });

    const data = await MongoDataset.findOne({
      _id: id,
      userId
    });

    if (!data) {
      throw new Error('kb is not exist');
    }

    jsonRes(res, {
      data: {
        _id: data._id,
        avatar: data.avatar,
        name: data.name,
        userId: data.userId,
        vectorModel: getVectorModel(data.vectorModel),
        tags: data.tags.join(' ')
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
