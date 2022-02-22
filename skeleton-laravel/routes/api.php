<?php

use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\AttendingCourseController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UnsubscribeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\SignatureController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MailTemplateController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ChapterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConditionalMailController;
use App\Http\Controllers\ExplainerVideoController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestUserAnswerResultController;
use App\Http\Controllers\UserAnswerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// public routes
// auth
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// protected routes all routes that need to be authenticated is under this group
Route::group(['middleware' => ['auth:sanctum']], function () {
    // All private routes that need the access token
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/me', [UserController::class, 'getUser']);
    Route::post('/user/me/edit', [UserController::class, 'update']);
    Route::post('/user/me/changePassword', [UserController::class, 'changePassword']);
    Route::get('/user/attending_course', [UserController::class, 'getUserAttendingCourses']);

    // Affiliations
    Route::get('/affiliations', [AffiliationController::class, 'index']);
    Route::get('/affiliation_departments', [AffiliationController::class, 'getAffiliationsWithDepartments']);

    // Departments
    Route::get('/departments', [DepartmentController::class, 'index']);

    // Notices
    Route::get('/notices', [NoticeController::class, 'index']);

    // Categories
    Route::get('/categories/courses/{status}', [CategoryController::class, 'getCategoriesWithCourses']);

    // Courses
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/course/edit/{id}', [CourseController::class, 'edit']);

    // Plans
    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/plans/{id}', [PlanController::class, 'show']);

	// Search
    Route::get('/search', [SearchController::class, 'index']);
    
    // Unsubscribe
    Route::post('/user/unsubscribe', [UnsubscribeController::class, 'store']);
    Route::post('/user/cancel_unsubscribe', [UnsubscribeController::class, 'cancelUnsubscribe']);

    // Contact us
    Route::post('/send_inquiry', [InquiryController::class, 'store']);

    // Student Chapters
    Route::post('/chapter_list', [ChapterController::class, 'index']);
    Route::post('/test_score', [ChapterController::class, 'view_test_score']);
    Route::post('/count_questions', [ChapterController::class, 'count_questions']);

    // Explainer Video
    Route::get('/explainer_videos/{id}', [ExplainerVideoController::class, 'show']);
    Route::post('/update_video_playback', [ExplainerVideoController::class, 'update_playback']);

    // Student Courses
    Route::post('/attending_course', [AttendingCourseController::class, 'store']);
    Route::get('/course/{id}', [CourseController::class, 'show']);
    Route::get('/course/attending_courses/{id}', [CourseController::class, 'getAttendingCoursesByCourseId']);
    Route::get('/course_list', [CourseController::class, 'showCourseList']);
    Route::get('/course_screen/{id}', [CourseController::class, 'show_course']);

    // Get test questions
    Route::get('/test/{id}', [TestController::class, 'show']);

    // Answer test
    Route::post('/post_answers', [UserAnswerController::class, 'store']);

    // Get test results
    Route::get('/get_results/{user_id},{test_id}', [TestUserAnswerResultController::class, 'show']);

    // Admin and Corporate access restrictions
    Route::group(['middleware' => ['role:admin,corporate']], function () {
        // User Create, Update, Delete
        Route::post('/user/create', [UserController::class, 'registerNewUser']);
        Route::delete('/users', [UserController::class, 'destroy']);
        Route::post('/users', [UserController::class, 'registerMultipleUsers']);

        // Signatures
        Route::resource('signatures', SignatureController::class);
        Route::delete('/signatures', [SignatureController::class, 'destroyAll']);

        // Mail templates
        Route::resource('mail-templates', MailTemplateController::class);
        Route::delete('/mail-templates', [MailTemplateController::class, 'destroyAll']);
        Route::patch('/mail-templates', [MailTemplateController::class, 'updateAll']);

        // Affiliations
        Route::post('/affiliations/', [AffiliationController::class, 'store'])->name('affiliations.store');
        Route::post('/affiliations/delete/', [AffiliationController::class, 'destroy']);
        Route::post('/affiliations/{id}/update/', [AffiliationController::class, 'update'])->name('affiliations.update');

        // Departments
        Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
        Route::post('/departments/delete/', [DepartmentController::class, 'destroy']);
        Route::post('/departments/{id}/update/', [DepartmentController::class, 'update'])->name('departments.update');

        // Notices
        Route::post('/notices', [NoticeController::class, 'store'])->name('notices.store');
        Route::post('/notices/delete/', [NoticeController::class, 'destroy']);
        Route::post('/notices/{id}/update/', [NoticeController::class, 'update'])->name('notices.update');

        // Categories
        Route::resource('categories', CategoryController::class);
        Route::delete('/categories', [CategoryController::class, 'destroyAll']);
        Route::patch('/categories', [CategoryController::class, 'updateAll'])->name('categories.updateAll');

        // Conditional Mails (course) Endpoint: /courses/{course}/conditional-mails/{conditional-mail}
        Route::post('/courses/{course}/conditional-mails/send', [ConditionalMailController::class, 'send']);
        Route::delete('/courses/{course}/conditional-mails', [ConditionalMailController::class, 'destroyAll']);
        Route::resource('courses.conditional-mails', ConditionalMailController::class)
            ->scoped(['conditional-mail' => 'id']) // ConditionalMail Model must be a child of Course Model
            ->except(['create', 'edit']);

        // Search
        Route::get('/search', [SearchController::class, 'index']);

        // Courses
        Route::post('/courses/status/update', [CourseController::class, 'updateCourseStatus']);
        Route::post('/course/create', [CourseController::class, 'store']);
        Route::post('/course/update', [CourseController::class, 'update']);
        Route::post('/course/delete', [CourseController::class, 'destroyAll']);

        // Plans
        Route::post('/update_plan', [PlanController::class, 'update']);
    });
});
