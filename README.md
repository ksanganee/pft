# Personal Finance Tool

## My 3rd year project repository containing the documentation and software

The full repository can be found at https://github.com/ksanganee/pft

### How to run the software:

1. Frontend
   - Ensure required environment variables set (see .env.template)*
   - `cd frontend`
   - `npm i`
   - `npm run build`
   - `npm run start`
2. PocketBase
	- Ensure pocketbase executable is in backend
	- `cd backend`
	- `./pocketbase serve`
	- Navigate to the admin ui
	- Import the schema from pb_schema.json
3. Flask API
	- Ensure libraries in requirements.txt are installed
	- Ensure constants in model.py and app.py match
	- `python model.py`
	- `flask run`

Should now be able to access the website at http://localhost:3000

*Some of the keys in the .env file require an account from Plaid (at https://plaid.com/docs/) and Financial Modelling Prep (at https://financialmodelingprep.com/developer/docs/)