import Enrollment from '../../models/Enrollment.js';
import Grade from '../../models/Grade.js';

export async function getEnrollmentSummary() {
  const total = await Enrollment.countDocuments();

  const perCourse = await Enrollment.aggregate([
    { $group: { _id: '$courseId', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $project: {
        _id: 0,
        courseId: '$_id',
        title: '$course.title',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]);

  return { total, perCourse };
}

export async function getGradeSummary() {
  return Grade.aggregate([
    {
      $group: {
        _id: '$courseId',
        avgScore: { $avg: '$score' },
        minScore: { $min: '$score' },
        maxScore: { $max: '$score' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $project: {
        _id: 0,
        courseId: '$_id',
        title: '$course.title',
        avgScore: { $round: ['$avgScore', 2] },
        minScore: 1,
        maxScore: 1,
        count: 1,
      },
    },
    { $sort: { avgScore: -1 } },
  ]);
}
