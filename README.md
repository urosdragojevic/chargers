# Chargers

Charging station booking app.

## Running the app

1. Run `docker compose up` to start the database.
2. Use the `/api/users` to insert your user in the database.
3. Set the `REACT_APP_USERNAME`, `REACT_APP_PASSWORD` and `REACT_APP_USER_ID` environment variables in the `.env` file of the `frontend` app.

## System design

System diagram can be found in the `docs` folder.

## Assumptions

- Communication between the actual charging stations and the API does not exist.
- Charging session starts as soon as the next user is selected from the queue.
- There is a max charging session duration.
- User can end the session before the max charging session is up.

## Constraints

- Queue is implemented in-memory, so an app restart resets the state of the queue. Storing the queue in a database table would preserve the queue state.
- System relies on the user ending the session.

## TODO

- [ ] Authorization
- [ ] Wrap database interactions with transactions
- [ ] Admin actions for managing the system
- [ ] Reservation system

