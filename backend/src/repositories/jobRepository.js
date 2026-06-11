import Job from '../models/Job.js';

export const create = (data) => Job.create(data);
export const findAll = () => Job.find().sort({ createdAt: -1 });
export const findById = (id) => Job.findById(id);
export const update = (id, data) => Job.findByIdAndUpdate(id, data, { new: true });
export const deleteById = (id) => Job.findByIdAndDelete(id);
export const count = () => Job.countDocuments();
