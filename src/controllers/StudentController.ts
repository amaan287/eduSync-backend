import { Context } from 'hono';
import { CourseRepository } from '@/repositories/CourseRepository';
import { LessonRepository } from '@/repositories/LessonRepository';
import { ResourceRepository } from '@/repositories/ResourceRepository';
import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { MediaService } from '@/services/MediaService';
import { asyncHandler } from '@/utils/helpers';
import { AppError } from '@/types';

export class StudentController {
  private courseRepository: CourseRepository;
  private lessonRepository: LessonRepository;
  private resourceRepository: ResourceRepository;
  private enrollmentRepository: EnrollmentRepository;
  private mediaService: MediaService;

  constructor() {
    this.courseRepository = new CourseRepository();
    this.lessonRepository = new LessonRepository();
    this.resourceRepository = new ResourceRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.mediaService = new MediaService();
  }

  getDownloadManifest = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Check enrollment
    const isEnrolled = await this.enrollmentRepository.isEnrolled(user.id, id);
    if (!isEnrolled) {
      throw new AppError(403, 'You must be enrolled to download course content');
    }

    // Get course details
    const course = await this.courseRepository.findWithDetails(id);
    if (!course) {
      throw new AppError(404, 'Course not found');
    }

    // Get all lessons
    const lessons = await this.lessonRepository.findByCourse(id);
    
    // Get all resources
    const resources = await this.resourceRepository.findByCourse(id);

    // Build manifest with download URLs
    const manifest = {
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
      },
      lessons: lessons.map((lesson) => ({
        id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        sectionId: lesson.sectionId,
        order: lesson.order,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        videoUrls: {
          auto: this.mediaService.generateVideoStreamingUrl(lesson.videoPublicId, 'auto'),
          low: this.mediaService.generateVideoStreamingUrl(lesson.videoPublicId, 'low'),
          medium: this.mediaService.generateVideoStreamingUrl(lesson.videoPublicId, 'medium'),
          high: this.mediaService.generateVideoStreamingUrl(lesson.videoPublicId, 'high'),
        },
      })),
      resources: resources.map((resource) => ({
        id: resource._id,
        title: resource.title,
        fileType: resource.fileType,
        size: resource.size,
        fileUrl: resource.fileUrl,
      })),
    };

    return c.json({
      success: true,
      data: manifest,
    });
  });
}

