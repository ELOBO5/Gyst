# Gyst

## Installation & usage

### Installation

- Clone or download the repo.
- Open terminal and navigate to `gyst` folder.

### Usage

Run `bash _scripts/startDev.sh`

- starts api & db services
- runs db migrations
- seeds db for development
- serves api on localhost:3000

Run `bash _scripts/startTest.sh`

- starts api & db services
- runs db migrations
- attaches to server container and triggers test run

Run `bash _scripts/startCoverageTest.sh`

- starts api & db services
- runs db migrations
- attaches to server container and triggers test run coverage

Run `bash _scripts/teardown.sh`

- stop all running services
- removes containers
- removes volumes

## Changelog

- Users can login and track a habit of their choice
- Users can select the frequency at which they want to track habits (daily, weekly or monthly)
- Users can choose to make a habit a priority
- Users can mark a habit as complete and view their completion streak
- Users can delete a habit they are currently tracking
- Deployed client-side on Vercel: https://gyst.vercel.app/
- Deployed api and database on Heroku: https://get-your-sht-together.herokuapp.com/

## Bugs

- Need to refresh page after marking a habit as complete for habit streak counter to go up
- Need to refresh after clicking the bin icon to delete a habit
