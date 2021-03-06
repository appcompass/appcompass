<?php

namespace AppCompass\AppCompass\Repositories\Relationships;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use AppCompass\AppCompass\Interfaces\RepositoryInterface;

class Relationship
{
    protected $repo;
    protected $relationship;

    public function __construct(RepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function first($class, $id)
    {
        $this->relationship = app()->make($class)->findOrFail($id);

        return $this;
    }

    public function next($name, $id)
    {
        $this->checkForMethod($name);

        $this->relationship = $this->relationship->{$name}()->findOrFail($id);

        return $this;
    }

    public function last($name)
    {
        $this->checkForMethod($name);

        $this->relationship = $this->relationship->{$name}();

        return $this;
    }

    public function relationship()
    {
        return $this;
    }

    public function getTable()
    {
        return $this->relationship->getTable();
    }

    public function create($data)
    {
        switch (get_class($this->relationship)) {

            case BelongsToMany::class:
                if (!empty($data['removed'])) {
                    $this->relationship->detach($data['removed']);
                }
                if (!empty($data['added'])) {
                    $this->relationship->attach($data['added']);
                }
                break;

            case BelongsTo::class:
                $this->relationship->save($data);
                break;

            case HasMany::class:
                // $this->model = new $this->model($attributes);
                //
                // // if there is a file in the attributes, lets store it.
                // $this->checkForUploads($attributes);
                //
                // $this->parent->{$this->relationName}()->save($this->model);

                break;

        }
    }

    public function detach($data)
    {
        return $this->relationship->detach($data);
    }

    public function attach($data, $pivot = [])
    {
        return $this->relationship->attach($data, $pivot);
    }

    public function get()
    {
        return $this->relationship->get();
    }

    private function checkForMethod($name)
    {
        if (!method_exists($this->relationship, $name)) {
            throw new \Exception("Relationship {$name} doesn't exist on " . get_class($this->relationship));
        }
    }
}
