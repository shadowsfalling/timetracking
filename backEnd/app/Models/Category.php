<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Countdown;
use OpenApi\Attributes as OA;

#[OA\Schema(schema: "Category", description: "Category model")]
class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'color', 'user_id'];

    /**
     * Get the user that owns the category.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}