<?php

namespace AppCompass\AppCompass\Repositories\Criteria;


use AppCompass\AppCompass\Interfaces\RepositoryInterface;

class FilterBySort extends AbstractCriteria
{

    public function apply($model, RepositoryInterface $repo)
    {
        $query = $model->newQuery();

        if (request()->has('sorters')) {

            $sorters = request()->sorters;
            if (is_string($sorters)) {
                $sorters = json_decode($sorters, true);
            }

            foreach ((array)$sorters as $field => $order) {
                $query->orderBy($field, $order);
            }
        }

        return $query;
    }
}
