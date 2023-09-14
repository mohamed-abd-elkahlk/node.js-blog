# Routes

description for the routes of this app !

## auth routes

| route |description |access|
|---|---|---|
|`/api/auth/signup`| this route for signup and make new user and add it to database |(public)|
|`/api/auth/verify` |  this route for verify your email using nodemailer to send the  verifcation link to the email that provided in the body |(public)|
|`/api/auth/login`| this route is used after verifing your email and if you already have emial |(public)|
|`/api/auth/forgotPassword`| this route used for genrate random 6 number that will be the verifcation code and it will send it to your email |(public)|
|`/api/auth/verifyResetCode`|this route  used for sending the verifcation code|(public)|
|`/api/auth/resetPassword`|this route  used for type your new password|(public)|
|`/api/auth/logout`|this route  used for logout|(public)|

that's all what i write in this routes if have any future i can add just let me know.

<!-- TODO: add some examples -->

## user routes

these routes have some difference  from the above routes, the above routes the normal user and admin can use this routes but the routes below some user can use and the other onley for admins.

| route |description |access|
|---|---|---|
|`/api/user/getme`| this route for display all user data  |(user/admin)|
|`/api/user/change/Password` |  this route for change the loged user data |(user/admin)|
|`/api/user/update`| this route is used for update user data like name etc |(user/admin)|
|`/api/user/delete`| this route for disaple the  user not delete it from database ! |(user/admin)|
|`/api/user/changePassword`/:id|this route  used for change the user password|(admin)|
|`/api/user/admin`|this route  used for get all users|(admin)|
|`/api/user/admin`/:id|this route  used for get or update and delete spcifc user from the database|(admin)|

## category  routes

| route |description |access|
|---|---|---|
|`/api/category`|this route to add new category and get all category information|(admin)|
|`/api/category/:id`|this route to get or update and delete category |(admin)|

## blogpost  routes

| route |description |access|
|---|---|---|
|`/api/blog`|this route to get all blog postes |(public)|
|`/api/blog/:id`|this route to get blog post |(public)|
|`/api/blog/create`|this route to create new  blog post |(user)|
|`/api/blog/update/:id`|this route to update new  blog post |(user)|
|`/api/blog/delete/:id`|this route to delete blog post |(user)|
|`/api/blog/addimage/:id`|this route to add image to the blog post |(user)|

## reviewes routes

| route |description |access|
|---|---|---|
|`/api/reviews`|this route to get all reviewes and make new review |(public/user)|
|`/api/reviews/:id`|this route to get ,update  and delete  blog post |(user/admin)|

and this all routes in the app there are more but i will add it as soon as possple