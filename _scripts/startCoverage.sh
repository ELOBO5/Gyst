docker-compose -f docker-compose.yaml -f docker-compose.test.yaml up -d
docker exec -it habit_tracker_test_api bash -c "npm i && npm run coverage"
