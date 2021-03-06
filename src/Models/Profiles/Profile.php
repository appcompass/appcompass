<?php

namespace AppCompass\AppCompass\Models\Profiles;

use AppCompass\AppCompass\Models\User;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    public $table = 'profiles';

    public $fillable = [
        'name',
        'class_name'
    ];

    public static function registerProfiles($profiles)
    {
        foreach ($profiles as $name => $class_name) {
            static::firstOrCreate([
                'name' => $name,
                'class_name' => $class_name,
            ]);
        }
    }

    public static function getUserProfiles(User $user)
    {
        $profiles = $user->profiles;
        $rtn = [];
        foreach ($profiles as $profile_type) {
            if (!is_null($profile = $user->{$profile_type->name})) {
                $profile->profile_key = $profile_type->name;
                $rtn[] = $profile;
            }
        }

        return $rtn;
    }
}
