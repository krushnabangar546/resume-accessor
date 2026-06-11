import Resume from '../models/Resume.js';

export const create = (data) => Resume.create(data);
export const findAll = () => Resume.find().sort({ uploadedAt: -1 });
export const findById = (id) => Resume.findById(id);
export const deleteById = (id) => Resume.findByIdAndDelete(id);
export const count = () => Resume.countDocuments();
export const updateById = (id, data) =>
  Resume.findByIdAndUpdate(id, { $set: data }, { new: true });
