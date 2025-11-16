import { CourseRepository } from '@/repositories/CourseRepository';
import { SectionRepository } from '@/repositories/SectionRepository';
import { LessonRepository } from '@/repositories/LessonRepository';
import { ResourceRepository } from '@/repositories/ResourceRepository';
import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { ProgressRepository } from '@/repositories/ProgressRepository';
import { MediaService } from './MediaService';
import { AppError } from '@/types';
import { Types } from 'mongoose';

export class CourseService {
  constructor(
    private courseRepository: CourseRepository,
    private sectionRepository: SectionRepository,
    private lessonRepository: LessonRepository,
    private resourceRepository: ResourceRepository,
    private enrollmentRepository: EnrollmentRepository,
    private progressRepository: ProgressRepository,
    private mediaService: MediaService
  ) {}

  async createCourse(instructorId: string, data: { title: string; description: string }, thumbnailBuffer?: Buffer): Promise<any> {
    let thumbnail = '';
    let thumbnailPublicId = '';

    if (thumbnailBuffer) {
      const uploadResult = await this.mediaService.uploadImage(
        thumbnailBuffer,
        `course-${Date.now()}`,
        'thumbnails'
      );
      thumbnail = uploadResult.url;
      thumbnailPublicId = uploadResult.publicId;
    }

    const course = await this.courseRepository.create({
      ...data,
      instructorId: new Types.ObjectId(instructorId),
      thumbnail,
      thumbnailPublicId,
      published: false,
      sections: [],
      resources: [],
    } as any);

    return course;
  }

  async updateCourse(courseId: string, instructorId: string, data: any, thumbnailBuffer?: Buffer): Promise<any> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new AppError(403, 'You are not authorized to update this course');
    }

    if (thumbnailBuffer) {
      // Delete old thumbnail if exists
      if (course.thumbnailPublicId) {
        await this.mediaService.deleteMedia(course.thumbnailPublicId, 'image');
      }

      const uploadResult = await this.mediaService.uploadImage(
        thumbnailBuffer,
        `course-${courseId}-${Date.now()}`,
        'thumbnails'
      );
      data.thumbnail = uploadResult.url;
      data.thumbnailPublicId = uploadResult.publicId;
    }

    const updatedCourse = await this.courseRepository.updateById(courseId, data);
    return updatedCourse;
  }

  async deleteCourse(courseId: string, instructorId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new AppError(403, 'You are not authorized to delete this course');
    }

    // Delete all associated media
    const lessons = await this.lessonRepository.findByCourse(courseId);
    for (const lesson of lessons) {
      await this.mediaService.deleteMedia(lesson.videoPublicId, 'video');
    }

    const resources = await this.resourceRepository.findByCourse(courseId);
    for (const resource of resources) {
      await this.mediaService.deleteMedia(resource.filePublicId, 'raw');
    }

    if (course.thumbnailPublicId) {
      await this.mediaService.deleteMedia(course.thumbnailPublicId, 'image');
    }

    await this.courseRepository.deleteById(courseId);
  }

  async getCourse(courseId: string, userId?: string): Promise<any> {
    const course = await this.courseRepository.findWithDetails(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    let isEnrolled = false;
    let progress = null;

    if (userId) {
      isEnrolled = await this.enrollmentRepository.isEnrolled(userId, courseId);
      if (isEnrolled) {
        progress = await this.progressRepository.getCourseProgress(userId, courseId);
      }
    }

    return {
      ...course.toObject(),
      isEnrolled,
      progress,
    };
  }

  async getPublishedCourses(searchQuery?: string): Promise<any[]> {
    if (searchQuery) {
      return await this.courseRepository.searchCourses(searchQuery);
    }
    return await this.courseRepository.findPublished();
  }

  async getInstructorCourses(instructorId: string): Promise<any[]> {
    return await this.courseRepository.findByInstructor(instructorId);
  }

  async publishCourse(courseId: string, instructorId: string): Promise<any> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new AppError(403, 'You are not authorized to publish this course');
    }

    const updatedCourse = await this.courseRepository.updateById(courseId, { published: true });
    return updatedCourse;
  }

  async addSection(courseId: string, instructorId: string, data: { title: string; order: number }): Promise<any> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new AppError(403, 'You are not authorized to modify this course');
    }

    const section = await this.sectionRepository.create({
      courseId: new Types.ObjectId(courseId),
      ...data,
      lessons: [],
    } as any);

    course.sections.push(section._id);
    await course.save();

    return section;
  }

  async addLesson(
    courseId: string,
    instructorId: string,
    data: { sectionId: string; title: string; description: string; duration: number; order: number },
    videoBuffer: Buffer
  ): Promise<any> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new AppError(403, 'You are not authorized to modify this course');
    }

    const section = await this.sectionRepository.findById(data.sectionId);
    if (!section || section.courseId.toString() !== courseId) {
      throw new AppError(404, 'Section not found');
    }

    // Upload video
    const videoResult = await this.mediaService.uploadVideo(
      videoBuffer,
      `lesson-${Date.now()}`,
      `courses/${courseId}/videos`
    );

    const lesson = await this.lessonRepository.create({
      sectionId: new Types.ObjectId(data.sectionId),
      courseId: new Types.ObjectId(courseId),
      title: data.title,
      description: data.description,
      duration: videoResult.duration || data.duration,
      order: data.order,
      videoUrl: videoResult.url,
      videoPublicId: videoResult.publicId,
    } as any);

    section.lessons.push(lesson._id);
    await section.save();

    return lesson;
  }

  async addResource(
    courseId: string,
    instructorId: string,
    data: { title: string; fileType: string; size: number },
    fileBuffer: Buffer
  ): Promise<any> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new AppError(403, 'You are not authorized to modify this course');
    }

    // Upload file
    const fileResult = await this.mediaService.uploadFile(
      fileBuffer,
      `resource-${Date.now()}`,
      `courses/${courseId}/resources`
    );

    const resource = await this.resourceRepository.create({
      courseId: new Types.ObjectId(courseId),
      title: data.title,
      fileType: data.fileType,
      size: data.size,
      fileUrl: fileResult.url,
      filePublicId: fileResult.publicId,
    } as any);

    course.resources.push(resource._id);
    await course.save();

    return resource;
  }
}

