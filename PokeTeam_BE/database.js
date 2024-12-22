import mysql from 'mysql2';
import dotenv from 'dotenv';


// -----------------------------------------          Config          ----------------------------------------------

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// -----------------------------------------         PokeTeam        ----------------------------------------------
export async function getPokeUserByUsernameOrEmailAndPassword(usernameOrEmail, password) {
    //DEBUG
    console.log(`Database : get PokeUser with username/email : ${usernameOrEmail} and password : ${password}`)
    //
    const [users] = await pool.query(`SELECT * FROM pokeUsers WHERE (username=? OR email=?) AND password=?;`,[usernameOrEmail,usernameOrEmail,password])
    
    
    return users[0];
} 

export async function getPokeUserByUsernameAndPassword(username, password){
    //DEBUG
    console.log(`Database : get PokeUsers with username: ${username} and password : ${password}`)
    //
    const [rows] = await pool.query(`SELECT * FROM pokeUsers WHERE username=? and password=?`,[username,password])
    return rows[0]
}

export async function getPokeUserByUsernameOrEmail(username, email){
    //DEBUG
    console.log(`Database : get PokeUsers with username: ${username} OR email : ${email}`)
    //
    const [rows] = await pool.query(`SELECT * FROM pokeUsers WHERE username=? OR email=?`,[username,email])
    return rows[0]
}
export async function createPokeUser(email, username, password){
    //DEBUG
    console.log(`Database : creating PokeUser with email: ${email}, username: ${username} and password : ${password}`)
    //
    const querry = await pool.query(`INSERT INTO pokeUsers (username,email,password) VALUES (?,?,?);`,[username,email,password])
    const [rows] = await pool.query(`SELECT id, username, email FROM pokeUsers WHERE username=? and email=?`,[username,email])
    return rows[0]
}

export async function getPokeUserById(id){
    //DEBUG
    console.log(`Database : get PokeUsers by Id : ${id}`)
    //
    const [rows] = await pool.query(`SELECT * FROM pokeUsers WHERE id=?`,[id])
    return rows[0]
}

export async function updatePokeUserProfile(userData){
    //DEBUG
    console.log(`Database : update PokeUsers with userData.id : ${userData.id}`)
    //
    const [rows] = await pool.query(`   UPDATE pokeUsers
                                        SET 
                                            username = ?,
                                            email = ?,
                                            profilePic = ?

                                        WHERE id = ?;`,[userData.username,userData.email,userData.profilePic,userData.id])
    return true
}

export async function deletePokeUserById(id){
    //DEBUG
    console.log(`Database : delete PokeUsers with id : ${id}`)
    //
    const status = await pool.query(`   DELETE FROM pokeUsers
                                        WHERE id = ?;`,[id])
    return status[0].affectedRows
}

export async function updatePokeUserTeam(userId,userData){
     //DEBUG
     console.log(`Database : update PokeUsers with userData.id : ${userId}`)
     //
     const [rows] = await pool.query(`   UPDATE pokeUsers
                                         SET 
                                            pokemon1_id = ?,
                                            pokemon2_id = ?,
                                            pokemon3_id = ?,
                                            pokemon4_id = ?,
                                            pokemon5_id = ?,
                                            pokemon6_id = ?
 
                                         WHERE id = ?;`,[userData.pokemon1_id,userData.pokemon2_id,userData.pokemon3_id,userData.pokemon4_id,userData.pokemon5_id,userData.pokemon6_id, userId])
     return true

}

export async function addPokemonToPokeUserTeam(pokeID, userID, placement){
    console.log(`Database : update PokeUsers with userData.id : ${userId}`)

    const [rows] = await pool.query(`UPDATE pokeUsers SET pokemon?_id = ? WHERE id = ?;`,[placement,pokeID,userID])
        return true
}

export async function getAllPokeTeamsAndRatings(){
    console.log(`Database : getting PokeTeams and Ratings`)
    const [rows] = await pool.query(`select * from pokeUsers`)
    return rows
}

export async function updateTeamRating(userId, userData){
    //DEBUG
    console.log(`Database : update Rating with userData.id : ${userId}`)
    //
    const [rows] = await pool.query(`   UPDATE pokeUsers
                                        SET 
                                           team_grade = ?,
                                           nbT_Rated = ?

                                        WHERE id = ?;`,[userData.rating, userData.nbT_Rated, userId])
    return true

}

