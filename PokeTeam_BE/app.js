import express from 'express';
import { getPokeUserByUsernameOrEmailAndPassword, createPokeUser, getPokeUserByUsernameOrEmail, getPokeUserById, updatePokeUserProfile, deletePokeUserById, updatePokeUserTeam } from './database.js'
import jwt from 'jsonwebtoken';
import cors from 'cors'

const SECRET_KEY = 'your_secret_key'; // Use a strong secret key in production

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json())

app.post("/pokeusers/signin", async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    console.log("Post : pokeusers/signin")

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "Username or email and password are required." });
    }

    try {
        console.log(`End point request with user/email : ${usernameOrEmail} and pass : ${password}`)

        const user = await getPokeUserByUsernameOrEmailAndPassword(usernameOrEmail, password);
        console.log(`Found user : ${user}`)
        if (!user) {
            return res.status(401).json({ error: "Invalid username/email or password." });
        }
        const userId = user.id
        const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
        // Return user data (ensure sensitive data like password is not returned)
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token
            // Add any other fields you want to include in the response
        });
    } catch (error) {
        console.error('Error retrieving user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/pokeusers", async (req, res) => {
    const { username, password, email } = req.body;

    // Check for missing fields
    if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required." });
    }

    try {
        // Check if the username or email already exists
        const existingUser = await getPokeUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(409).json({ error: "Username or email already exists." });
        }

        // Proceed to create the user
        const newUser = await createPokeUser(email, username, password);
        const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: '1h' });
        console.log(token)
        // Return the newly created user information
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token

        });
    } catch (error) {
        console.error('Error during signup: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



app.get("/pokeusers/:id", async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).send('Forbidden');

        const userId = req.params.id;

        // Check for missing fields
        if (!userId) {
            return res.status(400).json({ error: "Request missing parameters" });
        }

        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY); // Synchronous verification
        if (!decoded?.userId) {
            return res.status(401).json({ error: "Forbidden: badToken" });
        }

        if (decoded.userId != userId) {
            return res.status(409).json({ error: "Forbidden: you are not allowed to get this info" });
        }

        // get user data
        const user = await getPokeUserById(userId);
        if (!user) {
            return res.status(404).json({ error: `Aucun utilisateur pour l'id : ${id}` });
        }

        // Return the information
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            pokemon1_id: user.pokemon1_id,
            pokemon2_id: user.pokemon2_id,
            pokemon3_id: user.pokemon3_id,
            pokemon4_id: user.pokemon4_id,
            pokemon5_id: user.pokemon5_id,
            pokemon6_id: user.pokemon6_id,
            team_grade: user.team_grade,
            nbT_Rated: user.nbT_Rated

        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token'); // Handle JWT-specific errors
        }
        console.error('Error fetching profile Data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


app.put("/pokeusers/:id", async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Forbidden');
    const userId = req.params.id;

    const userData = req.body;

    if (!userData || userId != userData?.id) {
        return res.status(409).json({ error: "Request missing userData" });

    }
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY); // Synchronous verification
    if (!decoded?.userId) {
        return res.status(401).json({ error: "Forbidden: badToken" });
    }

    if (decoded.userId != userId) {
        return res.status(409).json({ error: "Forbidden: you are not allowed to get this info" });
    }
    try {
        // Check for missing fields
        if (!userData?.id || !userData?.username || !userData?.email || !userData?.profilePic) {
            return res.status(400).json({ error: "Request body missing parameters" });
        }

        // alter user data
        const user = await updatePokeUserProfile(userData);
        if (!user) {
            return res.status(404).json({ error: `Error while updating data` });
        }

        // Return the information
        res.status(200).json({
            message: "Success"
        });
    } catch (error) {
        console.error('Error updating profile Data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.delete("/pokeusers/:id", async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).send('Forbidden');

        const userId = req.params.id;

        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY); // Synchronous verification
        if (!decoded?.userId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        if (decoded.userId != userId) {
            return res.status(403).json({ error: "Forbidden: you are not allowed to delete this user" });
        }

        const user = await deletePokeUserById(userId);
        if (!user) {
            return res.status(404).json({ error: `Aucun utilisateur pour l'id : ${id}` });
        }

        // Return the information
        res.status(200).json({
            message: "Success"
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token'); // Handle JWT-specific errors
        }
        console.error('Error deleting user: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.put("/pokeusers/addpoke/:userid/:pokeid", async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Forbidden');
    const userId = req.params.userid;
    const pokeId = req.params.pokeid;

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY); // Synchronous verification
    if (!decoded?.userId) {
        return res.status(401).json({ error: "Forbidden: badToken" });
    }

    if (decoded.userId != userId) {
        return res.status(409).json({ error: "Forbidden: you are not allowed to get this info" });
    }

    try {
        //Check if user already has 6 pokemon
        //If not, place in the first possible column (nb of pokemon + 1)
        const user = await getPokeUserById(userId);
        if (!user) {
            return res.status(404).json({ error: `Error while updating data` });
        }

        const nbPokemon = 0;
        for (let index = 6; index > 0; index--) {
            if (user?.[`pokemon${index}_id`] !== null) {
                nbPokemon++;
            }
        }

        if (nbPokemon == 6) {
            return res.status(400).json({ error: `Error: Team Full` });
        }

        const result = await addPokemonToPokeUserTeam(pokeId, userId, nbPokemon + 1)
        if (!result) {
            return res.status(500).json({ error: `Error executing query` });
        }

        // Return the information
        res.status(200).json({
            message: "Success"
        });
    } catch (error) {
        console.error('Error updating profile Data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


app.delete("/pokeusers/removepoke/:userid/:pokeid", async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Forbidden');
    
    const userId = req.params.userid;
    const removedPokeId = parseInt(req.params.pokeid,10);

    let decoded;
    try {
        decoded = jwt.verify(token, SECRET_KEY); // Verify token
    } catch (err) {
        return res.status(401).json({ error: "Forbidden: badToken" });
    }

    if (!decoded?.userId || decoded.userId != userId) {
        return res.status(409).json({ error: "Forbidden: you are not allowed to modify this data" });
    }

    const user = await getPokeUserById(userId);
    if (!user) {
        return res.status(404).json({ error: `User not found` });
    }

    try {
        const pokeTeam = {
            pokemon1_id: user.pokemon1_id,
            pokemon2_id: user.pokemon2_id,
            pokemon3_id: user.pokemon3_id,
            pokemon4_id: user.pokemon4_id,
            pokemon5_id: user.pokemon5_id,
            pokemon6_id: user.pokemon6_id
        };

        console.log('Initial pokeTeam:', pokeTeam);

        // Find the index of the Pokémon to remove and set it to an empty string
        let updated = false;
        for (let i = 0; i < 6; i++) {
            if (pokeTeam[`pokemon${i + 1}_id`] === removedPokeId) {
                console.log(`Removing Pokémon ID: ${removedPokeId} from slot pokemon${i + 1}_id`);
                pokeTeam[`pokemon${i + 1}_id`] = null;
                updated = true;
                break;
            }
        }

        if (!updated) {
            return res.status(404).json({ error: "Pokémon not found in team" });
        }

        console.log('Updated pokeTeam:', pokeTeam);

        // Update the team with the new pokeTeam object
        const result = await updatePokeUserTeam(userId, pokeTeam);
        if (!result) {
            return res.status(500).json({ error: `Error updating user team` });
        }

        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error('Error updating profile data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



app.post("/pokeusers/authenticate", async (req, res) => {

    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).send('Forbidden');

        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY); // Synchronous verification
        if (!decoded?.userId) {
            return res.status(409).json({ error: "Forbidden: badToken" });
        }



        res.status(200).json({
            id: decoded.userId,
        });
    } catch (error) {
        console.error('Error during authenticate: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.put("/pokeusers/modifypoke/:id", async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).send('Forbidden');
        const userId = req.params.id;
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY); // Synchronous verification
        if (!decoded?.userId) {
            return res.status(401).json({ error: "Forbidden: badToken" });
        }

        if (decoded.userId != userId) {
            return res.status(409).json({ error: "Forbidden: you are not allowed to get this info" });
        }
        const pokeData = req.body;

        const result = await updatePokeUserTeam(userId, pokeData)
        if (!result) {
            return res.status(500).json({ error: `Error executing query` });
        }

        // Return the information
        res.status(200).json({
            message: "Success"
        });


    } catch (error) {

    }

})

app.get("/pokeusers/TeamAndRatings/:id", async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).send('Forbidden');

        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded?.userId) {
            return res.status(401).json({ error: "Forbidden: badToken" });
        }

        if (decoded.userId != userId) {
            return res.status(409).json({ error: "Forbidden: you are not allowed to get this info" });
        }
        const teamData = await getAllPokeTeamsAndRatings();

        if (!teamData || teamData.length === 0) {
            return res.status(404).json({ error: 'No teams or ratings found' });
        }

        // Return the information
        res.status(200).json(teamData.map(team => ({
            id: team.id,
            username: team.username,
            pfp: team.profilePic ,
            pokemon1_id: team.pokemon1_id,
            pokemon2_id: team.pokemon2_id,
            pokemon3_id: team.pokemon3_id,
            pokemon4_id: team.pokemon4_id,
            pokemon5_id: team.pokemon5_id,
            pokemon6_id: team.pokemon6_id,
            rating: team.team_grade,
            nbT_Rated: team.nbT_Rated
        })));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token'); // Handle JWT-specific errors
        }
        console.error('Error fetching profile Data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.put("/pokeusers/modifyrating/:id", async (req, res) => {
    try {
        
        const userId = req.params.id;

        const ratingData = req.body;

        const result = await updateTeamRating(userId, ratingData)
        if (!result) {
            return res.status(500).json({ error: `Error executing query` });
        }

        res.status(200).json({
            message: "Success"
        });


    } catch (error) {

    }

})

// Lorsqu'une erreur se produit dans l'application (par exemple, une exception non gérée), Express appelle automatiquement
// ce middleware d'erreur avec l'objet d'erreur (err), ce qui permet de la gérer de manière centralisée et uniforme.
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(1045).send('Something broke!')
})

// Lance le serveur et lui indique quel port utiliser 
app.listen(8080, () => {
    console.log('Server is running on port 8080')
})