<?php

namespace AppCompass\AppCompass\Policies;

use AppCompass\AppCompass\Models\Resource;
use AppCompass\AppCompass\Models\User;
use Route;

class ResourcesPolicy
{

    /**
     *  Check for root
     */
    public function before($user, $perm)
    {
        if ($user->isAdmin()) {
            return true;
        }
    }

    public function index(User $user)
    {
        return (bool) Resource::byAllowed()->whereName(Route::currentRouteName())->first();

        // if (is_null($role)) {
        //     return true;
        // }

        // return $user->hasRole($role);


        // return false;
    }

    public function create(User $user)
    {
        // info('Hit Show');

        return true;
    }

    public function show(User $user)
    {
        // info('Hit Show');

        return true;
    }

    public function edit(User $user)
    {
        // info('Hit Show');

        return true;
    }

    public function update(User $user)
    {
        // info('Hit Update');

        return true;
    }

    public function store(User $user)
    {
        // info('Hit Update');

        return true;
    }

    public function destroy(User $user)
    {
        // info('Hit Destroy');

        return true;
    }
}
