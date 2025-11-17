import { Context } from 'hono';
import { CourseService } from '@/services/CourseService';
import { CourseRepository } from '@/repositories/CourseRepository';
import { SectionRepository } from '@/repositories/SectionRepository';
import { LessonRepository } from '@/repositories/LessonRepository';
import { ResourceRepository } from '@/repositories/ResourceRepository';
import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { ProgressRepository } from '@/repositories/ProgressRepository';
import { MediaService } from '@/services/MediaService';
import { asyncHandler } from '@/utils/helpers';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    const courseRepository = new CourseRepository();
    const sectionRepository = new SectionRepository();
    const lessonRepository = new LessonRepository();
    const resourceRepository = new ResourceRepository();
    const enrollmentRepository = new EnrollmentRepository();
    const progressRepository = new ProgressRepository();
    const mediaService = new MediaService();

    this.courseService = new CourseService(
      courseRepository,
      sectionRepository,
      lessonRepository,
      resourceRepository,
      enrollmentRepository,
      progressRepository,
      mediaService
    );
  }

  createCourse = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const body = await c.req.parseBody();
    
    // Extract data from FormData
    const data = {
      title: body.title as string,
      description: body.description as string,
    };

    // Validate required fields
    if (!data.title || !data.description) {
      return c.json({
        success: false,
        message: 'Title and description are required',
      }, 400);
    }

    const thumbnailFile = body.thumbnail as File | undefined;

    let thumbnailBuffer: Buffer | undefined;
    if (thumbnailFile && thumbnailFile instanceof File) {
      thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    }

    const course = await this.courseService.createCourse(user.id, data, thumbnailBuffer);

    return c.json({
      success: true,
      message: 'Course created successfully',
      data: course,
    }, 201);
  });

  updateCourse = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const body = await c.req.parseBody();
    
    // Extract data from FormData
    const data: any = {};
    if (body.title) data.title = body.title as string;
    if (body.description) data.description = body.description as string;
    if (body.published !== undefined) data.published = body.published === 'true';

    const thumbnailFile = body.thumbnail as File | undefined;

    let thumbnailBuffer: Buffer | undefined;
    if (thumbnailFile && thumbnailFile instanceof File) {
      thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    }

    const course = await this.courseService.updateCourse(id, user.id, data, thumbnailBuffer);

    return c.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  });

  deleteCourse = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();

    await this.courseService.deleteCourse(id, user.id);

    return c.json({
      success: true,
      message: 'Course deleted successfully',
    });
  });

  getCourse = asyncHandler(async (c: Context) => {
    const { id } = c.req.param();
    const user = c.get('user');

    const course = await this.courseService.getCourse(id, user?.id);

    return c.json({
      success: true,
      data: course,
    });
  });

  getPublishedCourses = asyncHandler(async (c: Context) => {
    const search = c.req.query('search');
    const courses = await this.courseService.getPublishedCourses(search);

    return c.json({
      success: true,
      data: courses,
    });
  });

  getInstructorCourses = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const courses = await this.courseService.getInstructorCourses(user.id);

    return c.json({
      success: true,
      data: courses,
    });
  });

  publishCourse = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const course = await this.courseService.publishCourse(id, user.id);

    return c.json({
      success: true,
      message: 'Course published successfully',
      data: course,
    });
  });

  addSection = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const data = c.get('validatedData');

    const section = await this.courseService.addSection(id, user.id, data);

    return c.json({
      success: true,
      message: 'Section added successfully',
      data: section,
    }, 201);
  });

  addLesson = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const body = await c.req.parseBody();
    
    const videoFile = body.video as File;
    if (!videoFile || !(videoFile instanceof File)) {
      return c.json({ success: false, message: 'Video file is required' }, 400);
    }

    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

    const data = {
      sectionId: body.sectionId as string,
      title: body.title as string,
      description: body.description as string,
      duration: parseInt(body.duration as string) || 0,
      order: parseInt(body.order as string) || 0,
    };

    const lesson = await this.courseService.addLesson(id, user.id, data, videoBuffer);

    return c.json({
      success: true,
      message: 'Lesson added successfully',
      data: lesson,
    }, 201);
  });

  addResource = asyncHandler(async (c: Context) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const body = await c.req.parseBody();
    
    const resourceFile = body.file as File;
    if (!resourceFile || !(resourceFile instanceof File)) {
      return c.json({ success: false, message: 'Resource file is required' }, 400);
    }

    const fileBuffer = Buffer.from(await resourceFile.arrayBuffer());

    const data = {
      title: body.title as string,
      fileType: body.fileType as string,
      size: resourceFile.size,
    };

    const resource = await this.courseService.addResource(id, user.id, data, fileBuffer);

    return c.json({
      success: true,
      message: 'Resource added successfully',
      data: resource,
    }, 201);
  });
}

