# File structures
After cloning/pulling from this repo, rename then remove the '_disable' from .gitignore files on the following directories.
<br />
Storage/app/ <br />
Storage/framework/ <br />
Storage/framework/cache <br />
Storage/logs/ <br /> 
            

# clear up previous data
Run these lines 1 by 1:
### php artisan cache:clear
### php artisan config:clear
### php artisan view:clear


# Running the application locally
Install the libraries
### `composer update`


Create the .env from .env.example
### `cp .env.example .env`


Generate key
### `php artisan key:generate`



Run the migration to generate tables and run the seeder. 
### `php artisan migrate:fresh --seed`


Run the application 
### `php artisan serve`

> Note: Commands should be run at the root. Application should be running in `http://127.0.0.1:8100/`. **DO NOT USE LOCALHOST**
