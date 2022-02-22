<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Users\RegisterMultipleUserRequest;
use App\Http\Requests\Users\RegisterNewUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\Affiliation;
use App\Models\Department;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser()
    {
        $user = Auth::user();
        if ($user['membership_type'] > 1) {
            $user['all_user_count'] = UserController::getAllUserCount();
        }

        $user['date_registered'] = date('Y/m/d', strtotime($user->created_at));
        $user['plan'] = User::find($user->id)->plan;

        return response()->json(['user' => $user], 200);
    }

    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => ['required'],
            'email' => ['required', 'confirmed', 'unique:users,email'],
            'email_confirmation' => ['required'],
            'sex' => ['required'],
            'birthday' => ['required'],
            'password' => ['required', 'confirmed'],
            'password_confirmation' => ['required'],
            'image' => ['nullable'],
        ]);

        //check file
        $picture = '';
        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $picture   = date('His') . '-' . $filename;

            //move image to public/img folder
            $file->move(public_path('images'), $picture);
        }

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'membership_type' => 0,
            'sex' => $fields['sex'],
            'birthday' => $fields['birthday'],
            'image' => $picture
        ]);

        $token = $user->createToken('access_token')->plainTextToken;
        return response()->json(['status' => 200, 'message' => 'Registration Successful!', 'user' => $user, 'access_token' => $token,]);
    }

    /**
     * Register New User
     * Used by Admin and Corporate users to create new accounts
     *
     * @param  \Illuminate\Http\RegisterMultipleUserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registerNewUser(RegisterNewUserRequest $request)
    {
        $fields = $request->validated();

        //check file
        $picture = '';
        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $picture   = date('His') . '-' . $filename;

            //move image to public/img folder
            $file->move(public_path('images'), $picture);
        }
        // Clear affiliation and department fields when membership type is set to trial (0) or to student (1)
        $fields['membership_type'] ??= 0;
        if ($fields['membership_type'] < 2) {
            $fields['affiliation_id'] = null;
            $fields['department_id'] = null;
            $fields['department_child_id'] = null;
        }
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'sex' => $fields['sex'],
            'birthday' => $fields['birthday'],
            'password' => Hash::make($fields['password']),
            'membership_type' => $fields['membership_type'],
            'affiliation_id' => $fields['affiliation_id'] ?? null,
            'department_id' => $fields['department_id'] ?? null,
            'department_child_id' => $fields['department_child_id'] ?? null,
            'remarks' => $fields['remarks'] ?? null,
            'image' => $picture,
        ]);

        // $token = $user->createToken('access_token')->plainTextToken;
        return response()->json($user);
    }

    /**
     * Register Multiple Users
     * Retrieve data from CSV File
     * Perform registration process
     *
     * @param  \Illuminate\Http\RegisterMultipleUserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registerMultipleUsers(RegisterMultipleUserRequest $request)
    {
        $fields = $request->validated();
        $csvFile = $fields['csv_file'];
        $accountList = [];
        // Parse csv file into an array
        $accountCSV = array_map('str_getcsv', file($csvFile));
        // Remove header
        $csvHeader = array_shift($accountCSV);
        // Validate CSV file header
        $csvHeaderValidator = Validator::make(
            $csvHeader,
            $request->csvHeaderRules(),
            $request->csvHeaderMessages(),
        );
        if ($csvHeaderValidator->fails()) return response()->json($csvHeaderValidator->errors(), 422);
        foreach ($accountCSV as $row) {
            $row = array_combine($csvHeader, $row); // adds header to each row as key
            array_push($accountList, $row);
        }
        // Validate CSV file contents
        $csvFileValidator = Validator::make(
            $accountList,
            $request->csvFileRules(),
            $request->csvFileMessages(),
        );
        if ($csvFileValidator->fails()) return response()->json($csvFileValidator->errors(), 422);
        $accountList = $csvFileValidator->validated();
        // DB Transaction
        $result = DB::transaction(function () use ($accountList, $request) {
            $count = 0;
            $genderList = [
                'unknown' => 0,
                'male' => 1,
                'female' => 2,
            ];
            $membershipList = [
                'trial' => 0,
                'individual' => 1,
                'corporate' => 2,
                'admin' => 3,
            ];
            foreach ($accountList as $row) {
                // Membership Type permissions
                if (auth()->user()->membership_type === 2) {
                    $membershipTypeValidator = Validator::make(
                        ['membershipType' => $row['MembershipType']],
                        $request->membershipTypeRules(),
                        $request->membershipTypeMessages(),
                    );
                    if ($membershipTypeValidator->fails()) return $membershipTypeValidator;
                }
                // Affiliation validation
                $affiliation_id = (Affiliation::whereRaw('LOWER(name) = ?', [strtolower($row['Affiliation'])])->first()->id) ?? 0;
                $affiliationValidator = Validator::make(
                    ['affiliation' => $affiliation_id],
                    $request->affiliationRules(),
                );
                if ($affiliationValidator->fails()) return $affiliationValidator;

                // Department validation
                $department_id = (Department::whereRaw('LOWER(name) = ?', [strtolower($row['Department'])])->first()->id) ?? 0;
                $departmentValidator = Validator::make(
                    ['department' => $department_id],
                    $request->departmentRules(),
                );
                if ($departmentValidator->fails()) return $departmentValidator;

                User::create([
                    'name' => $row['Name'],
                    'email' => $row['Email'],
                    'sex' => $genderList[strtolower($row['Gender'])],
                    'birthday' => date("Y-m-d", strtotime($row['Birthday'])),
                    'password' => Hash::make($row['Password']),
                    'membership_type' => $membershipList[strtolower($row['MembershipType'])],
                    'affiliation_id' => $affiliation_id,
                    'department_id' => $department_id,
                    'remarks' => empty($row['Remarks']) ? null : $row['Remarks'],
                ]);
                $count++;
            }
            return $count;
        });
        if ((gettype($result) !== 'integer') && $result?->errors()) {
            return response()->json($result->errors(), 422);
        }
        return response()->json(['createdUserCount' => $result]);
    }

    /**
     * @param Request $request
     * @return array
     */
    public static function getAllUserCount()
    {
        $trialAccount = User::where('membership_type', 0)->count();
        $individualAccount = User::where('membership_type', 1)->count();
        $corporateAccount = User::where('membership_type', 2)->count();
        $totalAccount = $trialAccount + $individualAccount + $corporateAccount;

        return [
            'trial' => $trialAccount,
            'individual' => $individualAccount,
            'corporate' => $corporateAccount,
            'total' => $totalAccount
        ];
    }

    /**
     * Update user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request)
    {
        $fields = $request->validated();
        // When user is admin or corporate, use form request field 'id' for modifying other accounts
        $isAuthorized = in_array(auth()->user()->membership_type, [2, 3]);
        $user = $isAuthorized ? User::find($fields['id']) : Auth::user();
        //check file
        $picture = '';
        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $picture   = date('His') . '-' . $filename;

            //move image to public/img folder
            $file->move(public_path('images'), $picture);
            if ($user->image) {
                unlink('images/' . $user->image);
            }
            $user->image = $picture;
        }

        $user->name = $fields['name'];
        $user->email = $fields['email'];
        $user->sex = $fields['sex'];
        $user->birthday = $fields['birthday'];
        // Clear affiliation and department fields when membership type is set to trial or to student
        $fields['membership_type'] ??= 0;
        $user->membership_type = $fields['membership_type'];
        if ($fields['membership_type'] < 2) {
            $fields['affiliation_id'] = null;
            $fields['department_id'] = null;
            $fields['department_child_id'] = null;
        }
        $user->affiliation_id = $fields['affiliation_id'] ?? null;
        $user->department_id = $fields['department_id'] ?? null;
        $user->department_child_id = $fields['department_child_id'] ?? null;
        $user->remarks = $fields['remarks'] ?? null;
        $user->save();

        return response()->json([
            'message' => 'You have successfully updated your profile.',
            'user' => $user
        ], 200);
    }

    /**
     * Change user password
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $fields = $request->validate([
            'id' => ['numeric', 'required'],
            'oldPassword' => ['required'],
            'password' => ['required', 'confirmed'],
            'password_confirmation' => ['required'],
        ]);
        // When user is admin, use form request field 'id' for modifying other accounts
        $isAuthorized = auth()->user()->membership_type === 3;
        $user = $isAuthorized ? User::find($fields['id']) : Auth::user();

        if (!Hash::check($fields['oldPassword'], $user->password)) {
            return response()->json([
                'message' => 'Invalid old password.'
            ], 422);
        }

        $user->password = Hash::make($fields['password']);
        $user->save();

        return response()->json([
            'message' => 'You have successfully updated your password.',
            'user' => $user
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $request->validate([
            '.*' => 'numeric|required',
        ]);

        $deletedUserIdCount = User::destroy($request->input());
        return response()->json($deletedUserIdCount);
    }

    /**
     * Retrieve categories, courses, attending courses for a user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserAttendingCourses()
    {
        $user = auth()->user();
        $courses = $user->attendingCourses()->get()->map(function ($attending_course) {
            $course = $attending_course->course;
            $attending_course->name = $course->name;
            unset($attending_course->course);
            return $attending_course;
        });

        return response()->json($courses);
    }
}
