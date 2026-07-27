import Counter from "../models/counter";
export const getNextSequence = async (
  sequenceName: string,
): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
    },
  );

  return counter.seq;
};
