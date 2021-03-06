<?php

namespace AppCompass\AppCompass\Controllers;

use AppCompass\AppCompass\Models\Permission;
use AppCompass\AppCompass\Policies\ResourcesPolicy;
use AppCompass\AppCompass\Repositories\Criteria\HasRole;
use AppCompass\AppCompass\Repositories\PermissionsRepository;

class RolePermissionsController extends AbstractBaseResourceController
{
    protected $param_name = 'permission';
    protected $view_types = ['MultiSelect'];

    public function __construct(PermissionsRepository $repo)
    {
        $this->repo = $repo;

        $role_id = $this->getRouteParam('role');
        $this->repo->pushCriteria(new HasRole($role_id));

        // $company_id = $this->getRouteParam('company');
        // $this->repo->pushCriteria(new HasCompany($company_id));

        $this->selectable = Permission::byAllowed()->get();
    }

    public function getPolicy()
    {
        return ResourcesPolicy::class;
    }
}
