<?php

namespace Nemrutco\NovaGlobalFilter;

use Laravel\Nova\Http\Requests\NovaRequest;

trait DependentFilter
{
    public function dependsOn(string $filter)
    {
        $this->withMeta(['dependsOn' => $filter]);
        return $this;
    }
}