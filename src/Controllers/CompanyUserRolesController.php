<?php

namespace AppCompass\AppCompass\Controllers;

use App\Company;
use AppCompass\AppCompass\Models\Role;
use AppCompass\AppCompass\Policies\ResourcesPolicy;
use AppCompass\AppCompass\Repositories\Criteria\HasCompany;
use AppCompass\AppCompass\Repositories\Criteria\HasUser;
use AppCompass\AppCompass\Repositories\RolesRepository;

class CompanyUserRolesController extends UserPermissionsController
{
    protected $param_name = 'role';
    protected $view_types = ['MultiSelect'];

    public function __construct(RolesRepository $repo)
    {
        $this->repo = $repo;

        $this->company_id = $this->getRouteParam('company');
        $this->user_id = $this->getRouteParam('user');

        $this->repo->pushCriteria(new HasCompany($this->company_id));
        $this->repo->pushCriteria(new HasUser($this->user_id));

        $this->repo->related()
            ->first(Company::class, $this->company_id)
            ->next('users', $this->user_id)
            ->last('roles')
        ;

        $this->selectable = Role::byAllowed()->get();
    }

    public function getPolicy()
    {
        return ResourcesPolicy::class;
    }
}
